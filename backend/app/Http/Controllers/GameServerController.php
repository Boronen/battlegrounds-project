<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class GameServerController extends Controller
{
    // A restarted Node process has a new instance ID. The scheduler voids its abandoned games.
    public function claim(Request $request)
    {
        $instance = $request->validate(['instance' => 'required|uuid'])['instance'];

        return DB::transaction(function () use ($instance) {
            $ids = DB::table('games')->where('status', 'running')
                ->where(fn ($q) => $q->whereNull('server_instance')->orWhere('server_instance', $instance))
                ->lockForUpdate()->pluck('id');
            DB::table('games')->whereIn('id', $ids)->update(['server_instance' => $instance]);

            return ['ids' => $ids];
        });
    }

    public function redeem(Request $request)
    {
        return DB::transaction(function () use ($request) {
            $ticket = DB::table('game_tickets')->where('digest', hash('sha256', (string) $request->input('ticket')))
                ->where('expires_at', '>', now())->lockForUpdate()->first();
            abort_unless($ticket, 403);
            DB::table('game_tickets')->where('digest', $ticket->digest)->delete();
            abort_if(DB::table('users')->where('id', $ticket->user_id)->value('suspended'), 403);

            return ['userId' => $ticket->user_id, 'gameId' => $ticket->game_id];
        });
    }

    public function bootstrap(int $id)
    {
        $game = DB::table('games')->where(['id' => $id, 'status' => 'running'])->firstOrFail();
        $members = DB::table('seats')->join('users', 'seats.user_id', '=', 'users.id')->where('game_id', $id)
            ->orderBy('seats.id')->get(['user_id as id', 'name', 'suspended']);

        return ['id' => $id, 'seed' => $game->seed, 'members' => $members, 'catalog' => json_decode($game->catalog)];
    }

    public function heartbeat(int $id)
    {
        $game = DB::table('games')->where('id', $id);
        (clone $game)->where('status', 'running')->update(['heartbeat' => now()]);

        return ['status' => $game->value('status'), 'suspended' => DB::table('seats')->join('users', 'users.id', '=', 'user_id')->where('game_id', $id)->where('suspended', true)->pluck('user_id')];
    }

    public function result(Request $request, int $id)
    {
        $data = $request->validate(['ruleset' => 'required|string|max:100', 'placements' => 'required|array|min:2|max:8',
            'placements.*.userId' => 'required|integer|distinct', 'placements.*.place' => 'required|integer|distinct|min:1|max:8']);

        return DB::transaction(function () use ($data, $id) {
            $game = DB::table('games')->where('id', $id)->lockForUpdate()->firstOrFail();
            if ($game->status === 'finished') {
                $stored = DB::table('seats')->where('game_id', $id)->pluck('place', 'user_id')->all();
                $received = collect($data['placements'])->pluck('place', 'userId')->all();
                abort_unless($stored == $received && $game->ruleset === $data['ruleset'], 409);

                return response()->noContent();
            }
            abort_unless($game->status === 'running', 409);
            $members = DB::table('seats')->where('game_id', $id)->pluck('user_id')->sort()->values();
            $results = collect($data['placements'])->sortBy('userId');
            abort_unless($members->all() == $results->pluck('userId')->values()->all() &&
                $results->pluck('place')->sort()->values()->all() == range(1, $members->count()), 422);
            foreach ($results as $row) {
                $delta = $game->mode === 'ranked' ? [70, 50, 30, 10, -10, -30, -50, -70][$row['place'] - 1] : 0;
                DB::table('seats')->where(['game_id' => $id, 'user_id' => $row['userId']])->update(['place' => $row['place'], 'delta' => $delta]);
                if ($delta) {
                    DB::table('profiles')->where('user_id', $row['userId'])->increment('rating', $delta);
                }
            }
            DB::table('games')->where('id', $id)->update(['status' => 'finished', 'ruleset' => $data['ruleset'], 'updated_at' => now()]);

            return response()->noContent();
        }, 3);
    }
}

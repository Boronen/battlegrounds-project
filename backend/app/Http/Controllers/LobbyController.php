<?php

namespace App\Http\Controllers;

use App\Services\Catalog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class LobbyController extends Controller
{
    private function membership(int $userId)
    {
        return DB::table('games')->join('seats', 'games.id', '=', 'seats.game_id')->where('user_id', $userId)
            ->whereIn('status', ['waiting', 'running'])->first(['games.*']);
    }

    private function mutate(callable $operation)
    {
        return DB::transaction(function () use ($operation) {
            DB::table('matchmaking_lock')->lockForUpdate()->first();

            return $operation();
        }, 3);
    }

    public function current(Request $request)
    {
        $game = $this->membership($request->user()->id);
        if (! $game) {
            return response('null', 200, ['Content-Type' => 'application/json']);
        }
        $members = DB::table('seats')->join('users', 'users.id', '=', 'seats.user_id')->where('game_id', $game->id)
            ->orderBy('seats.id')->get(['user_id', 'name', 'ready']);

        return ['id' => $game->id, 'code' => $game->code, 'status' => $game->status, 'mode' => $game->mode, 'members' => $members];
    }

    public function enter(Request $request, string $operation)
    {
        $userId = $request->user()->id;

        return $this->mutate(function () use ($operation, $request, $userId) {
            abort_if($this->membership($userId), 409, 'Már van aktív játékod.');
            $game = null;
            if ($operation === 'join') {
                $code = $request->validate(['code' => 'required|string|size:8'])['code'];
                $game = DB::table('games')->where(['code' => strtoupper($code), 'mode' => 'private', 'status' => 'waiting'])->firstOrFail();
            }
            if ($operation === 'queue') {
                $game = DB::table('games')->where(['mode' => 'ranked', 'status' => 'waiting'])->oldest('id')->first();
            }
            $id = $game?->id ?? DB::table('games')->insertGetId(['mode' => $operation === 'queue' ? 'ranked' : 'private',
                'code' => strtoupper(Str::random(8)), 'seed' => random_int(1, 2147483647), 'created_at' => now(), 'updated_at' => now()]);
            abort_if(DB::table('seats')->where('game_id', $id)->count() >= 8, 409, 'A szoba megtelt.');
            DB::table('seats')->insert(['game_id' => $id, 'user_id' => $userId, 'ready' => $operation === 'queue']);
            if ($operation === 'queue' && DB::table('seats')->where('game_id', $id)->count() === 8) {
                $this->begin($id);
            }

            return $this->current($request);
        });
    }

    private function begin(int $id): void
    {
        $catalog = Catalog::current();
        abort_unless(count($catalog), 503, 'A karakterkatalógus feltöltése szükséges.');
        DB::table('games')->where('id', $id)->update(['status' => 'running', 'catalog' => json_encode($catalog), 'heartbeat' => now(), 'updated_at' => now()]);
    }

    public function action(Request $request, int $id, string $action)
    {
        return $this->mutate(function () use ($request, $id, $action) {
            $game = $this->membership($request->user()->id);
            abort_unless($game && $game->id == $id && $game->status === 'waiting', 409);
            $members = DB::table('seats')->where('game_id', $id);
            $mine = (clone $members)->where('user_id', $request->user()->id);
            if ($action === 'leave') {
                $mine->delete();
                if (! $members->exists()) {
                    DB::table('games')->where('id', $id)->update(['status' => 'void']);
                }
            } elseif ($action === 'ready') {
                $mine->update($request->validate(['ready' => 'required|boolean']));
            } else {
                abort_unless($game->mode === 'private' && (clone $members)->oldest('id')->value('user_id') == $request->user()->id, 403);
                abort_if($members->count() < 2 || (clone $members)->where('ready', false)->exists(), 409, 'Legalább két kész játékos szükséges.');
                $this->begin($id);
            }

            return $this->current($request);
        });
    }

    public function ticket(Request $request)
    {
        $game = $this->membership($request->user()->id);
        abort_unless($game && $game->status === 'running' && $game->id == $request->input('game_id'), 403);
        $ticket = Str::random(64);
        DB::table('game_tickets')->insert(['digest' => hash('sha256', $ticket), 'user_id' => $request->user()->id, 'game_id' => $game->id, 'expires_at' => now()->addSeconds(60)]);

        return ['ticket' => $ticket];
    }
}

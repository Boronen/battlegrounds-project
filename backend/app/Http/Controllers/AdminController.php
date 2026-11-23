<?php

namespace App\Http\Controllers;

use App\Services\Catalog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    private function audit(Request $request, string $action, int $target, ?string $reason = null): void
    {
        DB::table('audit_log')->insert(['user_id' => $request->user()->id, 'action' => $action, 'target' => $target, 'reason' => $reason, 'created_at' => now()]);
    }

    public function overview()
    {
        return ['players' => DB::table('users')->count(), 'running' => DB::table('games')->where('status', 'running')->count(), 'characters' => DB::table('characters')->count()];
    }

    public function users(Request $request)
    {
        return DB::table('users')->where('name', 'like', '%'.$request->query('search', '').'%')->orderBy('id')->paginate(20, ['id', 'name', 'role', 'suspended']);
    }

    public function status(Request $request, int $id)
    {
        $data = $request->validate(['suspended' => 'required|boolean']);
        abort_if($request->user()->id === $id, 422, 'A saját adminfiókod aktív kell maradjon.');
        DB::transaction(function () use ($request, $id, $data) {
            DB::table('matchmaking_lock')->lockForUpdate()->first();
            DB::table('users')->where('id', $id)->lockForUpdate()->firstOrFail();
            DB::table('users')->where('id', $id)->update($data);
            if ($data['suspended']) {
                DB::table('sessions')->where('user_id', $id)->delete();
                DB::table('game_tickets')->where('user_id', $id)->delete();
                $waiting = DB::table('games')->where('status', 'waiting')->pluck('id');
                DB::table('seats')->where('user_id', $id)->whereIn('game_id', $waiting)->delete();
                DB::table('games')->whereIn('id', $waiting)->whereNotIn('id', DB::table('seats')->select('game_id'))->update(['status' => 'void']);
            }
            $this->audit($request, $data['suspended'] ? 'suspend' : 'restore', $id);
        });

        return response()->noContent();
    }

    public function characters()
    {
        return Catalog::current(false);
    }

    public function publish(Request $request, ?int $id = null)
    {
        $data = $request->validate(['template' => 'required|integer|exists:characters,id', 'name' => 'required|string|max:64',
            'tier' => 'required|integer|between:1,6', 'attack' => 'required|integer|between:0,999', 'health' => 'required|integer|between:1,999']);
        DB::transaction(function () use ($request, $id, $data) {
            $template = DB::table('character_versions')->where('character_id', $data['template'])->latest('id')->value('definition');
            $definition = json_decode($template, true);
            if ($id !== null) {
                DB::table('characters')->where('id', $id)->lockForUpdate()->firstOrFail();
            } else {
                $id = DB::table('characters')->insertGetId(['enabled' => true]);
            }
            foreach (['tier', 'attack', 'health'] as $stat) {
                $data[$stat] = (int) $data[$stat];
            }
            $definition = array_merge($definition, collect($data)->except('template')->all(), ['id' => $id]);
            DB::table('character_versions')->insert(['character_id' => $id, 'definition' => json_encode($definition)]);
            $this->audit($request, 'publish_character', $id);
        });

        return response()->noContent();
    }

    public function enable(Request $request, int $id)
    {
        $data = $request->validate(['enabled' => 'required|boolean']);
        DB::transaction(function () use ($request, $id, $data) {
            DB::table('characters')->where('id', $id)->lockForUpdate()->firstOrFail();
            DB::table('characters')->where('id', $id)->update($data);
            $this->audit($request, $data['enabled'] ? 'enable_character' : 'disable_character', $id);
        });

        return response()->noContent();
    }

    public function games()
    {
        return DB::table('games')->latest('id')->paginate(20, ['id', 'mode', 'status', 'heartbeat']);
    }

    public function auditLog()
    {
        return DB::table('audit_log')->latest('id')->paginate(20);
    }

    public function void(Request $request, int $id)
    {
        $reason = $request->validate(['reason' => 'required|string|min:3|max:255'])['reason'];
        DB::transaction(function () use ($request, $id, $reason) {
            abort_unless(DB::table('games')->where(['id' => $id, 'status' => 'running'])->update(['status' => 'void', 'updated_at' => now()]), 409);
            $this->audit($request, 'void_match', $id, $reason);
        });

        return response()->noContent();
    }
}

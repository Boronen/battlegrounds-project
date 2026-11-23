<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CommunityController extends Controller
{
    private function players()
    {
        return DB::table('profiles')->join('users', 'users.id', '=', 'profiles.user_id')
            ->select('users.name', 'display_name', 'avatar_key', 'bio', 'rating');
    }

    public function leaderboard(Request $request)
    {
        $term = '%'.$request->query('search', '').'%';

        return $this->players()->where(fn ($q) => $q->where('users.name', 'like', $term)->orWhere('display_name', 'like', $term))
            ->orderByDesc('rating')->orderBy('users.id')->paginate(20);
    }

    public function profile(string $username)
    {
        return $this->players()->where('users.name', $username)->firstOrFail();
    }

    public function history(string $username)
    {
        return DB::table('seats')->join('games', 'games.id', '=', 'seats.game_id')->join('users', 'users.id', '=', 'seats.user_id')
            ->where('users.name', $username)->where('games.status', 'finished')->orderByDesc('games.id')
            ->paginate(20, ['games.id', 'mode', 'place', 'delta']);
    }

    public function summary(int $id)
    {
        $game = DB::table('games')->where('id', $id)->where('status', 'finished')->firstOrFail(['id', 'mode', 'ruleset']);
        $game->players = DB::table('seats')->join('users', 'users.id', '=', 'seats.user_id')->where('game_id', $id)
            ->orderBy('place')->get(['name', 'place', 'delta']);

        return $game;
    }
}

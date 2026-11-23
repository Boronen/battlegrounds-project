<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class GameServerOnly
{
    public function handle(Request $request, Closure $next)
    {
        $secret = config('services.game_server.secret');
        abort_unless($secret && hash_equals($secret, (string) $request->bearerToken()), 403);

        return $next($request);
    }
}

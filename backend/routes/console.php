<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schedule;

Schedule::call(function () {
    DB::table('games')->where('status', 'running')->where('heartbeat', '<', now()->subMinutes(2))->update(['status' => 'void', 'updated_at' => now()]);
    DB::table('game_tickets')->where('expires_at', '<', now())->delete();
})->everyMinute();

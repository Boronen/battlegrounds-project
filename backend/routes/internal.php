<?php

use App\Http\Controllers\GameServerController;
use App\Http\Middleware\GameServerOnly;
use Illuminate\Support\Facades\Route;

Route::middleware(GameServerOnly::class)->controller(GameServerController::class)->group(function () {
    Route::post('matches/claim', 'claim');
    Route::post('tickets/redeem', 'redeem');
    Route::get('matches/{id}/bootstrap', 'bootstrap');
    Route::post('matches/{id}/heartbeat', 'heartbeat');
    Route::post('matches/{id}/result', 'result');
});

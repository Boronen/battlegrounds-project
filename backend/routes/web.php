<?php

use App\Http\Controllers\AccountController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\CommunityController;
use App\Http\Controllers\LobbyController;
use Illuminate\Support\Facades\Route;

Route::prefix('api')->group(function () {
    Route::post('register', [AccountController::class, 'register'])->middleware('throttle:10,1');
    Route::post('login', [AccountController::class, 'login'])->middleware('throttle:10,1');
    Route::get('leaderboard', [CommunityController::class, 'leaderboard']);
    Route::get('profiles/{username}', [CommunityController::class, 'profile']);
    Route::get('profiles/{username}/matches', [CommunityController::class, 'history']);
    Route::get('matches/{id}', [CommunityController::class, 'summary']);

    Route::middleware(['auth:sanctum', 'can:play'])->group(function () {
        Route::get('me', [AccountController::class, 'me']);
        Route::post('logout', [AccountController::class, 'logout']);
        Route::patch('me/profile', [AccountController::class, 'profile']);
        Route::patch('me/password', [AccountController::class, 'password']);
        Route::get('lobbies/current', [LobbyController::class, 'current']);
        Route::post('queue', [LobbyController::class, 'enter'])->defaults('operation', 'queue');
        Route::post('lobbies', [LobbyController::class, 'enter'])->defaults('operation', 'create');
        Route::post('lobbies/join', [LobbyController::class, 'enter'])->defaults('operation', 'join');
        Route::post('lobbies/{id}/{action}', [LobbyController::class, 'action'])->whereIn('action', ['ready', 'leave', 'start']);
        Route::post('game-tickets', [LobbyController::class, 'ticket'])->middleware('throttle:60,1');

        Route::middleware('can:admin')->prefix('admin')->controller(AdminController::class)->group(function () {
            Route::get('overview', 'overview');
            Route::get('users', 'users');
            Route::patch('users/{id}/status', 'status');
            Route::get('characters', 'characters');
            Route::post('characters', 'publish');
            Route::post('characters/{id}/versions', 'publish');
            Route::patch('characters/{id}', 'enable');
            Route::get('matches', 'games');
            Route::post('matches/{id}/void', 'void');
            Route::get('audit','auditLog');
        });
    });
});

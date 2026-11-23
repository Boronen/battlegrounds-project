<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $t) {
            $t->unique('name');
            $t->string('role')->default('player');
            $t->boolean('suspended')->default(false);
        });
        Schema::create('profiles', function (Blueprint $t) {
            $t->foreignId('user_id')->primary()->constrained();
            $t->string('display_name');
            $t->string('avatar_key')->default('default_01');
            $t->string('bio', 500)->nullable();
            $t->integer('rating')->default(1000)->index();
        });
        Schema::create('games', function (Blueprint $t) {
            $t->id();
            $t->string('code', 8)->unique();
            $t->string('mode');
            $t->string('status')->default('waiting')->index();
            $t->unsignedInteger('seed');
            $t->uuid('server_instance')->nullable();
            $t->string('ruleset')->nullable();
            $t->json('catalog')->nullable();
            $t->timestamp('heartbeat')->nullable();
            $t->timestamps();
        });
        Schema::create('seats', function (Blueprint $t) {
            $t->id();
            $t->foreignId('game_id')->constrained();
            $t->foreignId('user_id')->constrained();
            $t->boolean('ready')->default(false);
            $t->unsignedTinyInteger('place')->nullable();
            $t->integer('delta')->default(0);
            $t->unique(['game_id', 'user_id']);
        });
        Schema::create('game_tickets', function (Blueprint $t) {
            $t->string('digest', 64)->primary();
            $t->foreignId('user_id')->constrained();
            $t->foreignId('game_id')->constrained();
            $t->timestamp('expires_at');
        });
        Schema::create('matchmaking_lock', fn (Blueprint $t) => $t->id());
        DB::table('matchmaking_lock')->insert(['id' => 1]);
        Schema::create('characters', function (Blueprint $t) {
            $t->id();
            $t->boolean('enabled')->default(true);
        });
        Schema::create('character_versions', function (Blueprint $t) {
            $t->id();
            $t->foreignId('character_id')->constrained();
            $t->json('definition');
        });
        Schema::create('audit_log', function (Blueprint $t) {
            $t->id();
            $t->foreignId('user_id')->constrained();
            $t->string('action');
            $t->unsignedBigInteger('target');
            $t->string('reason')->nullable();
            $t->timestamp('created_at');
        });
    }

    public function down(): void
    {
        foreach (['audit_log', 'character_versions', 'characters', 'matchmaking_lock', 'game_tickets', 'seats', 'games', 'profiles'] as $table) {
            Schema::dropIfExists($table);
        }
        Schema::table('users', function (Blueprint $t) {
            $t->dropUnique(['name']);
            $t->dropColumn(['role', 'suspended']);
        });
    }
};

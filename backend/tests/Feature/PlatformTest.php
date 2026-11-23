<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class PlatformTest extends TestCase
{
    use RefreshDatabase;

    private function player(string $name): User
    {
        $user = User::factory()->create(['name' => $name]);
        DB::table('profiles')->insert(['user_id' => $user->id, 'display_name' => $name]);

        return $user;
    }

    public function test_registration_profile_privacy_and_role_checks(): void
    {
        $data = ['name' => 'rookie', 'email' => 'rookie@example.test', 'password' => 'exam-password', 'password_confirmation' => 'exam-password', 'role' => 'admin'];
        $this->postJson('/api/register', $data)->assertCreated()->assertJsonPath('role', 'player')->assertJsonPath('profile.rating', 1000);
        $this->patchJson('/api/me/profile', ['display_name' => 'Kapitány', 'avatar_key' => 'default_03', 'bio' => 'Helló'])->assertOk();
        $this->getJson('/api/admin/users')->assertForbidden();
        $this->postJson('/api/logout')->assertNoContent();
        auth()->forgetGuards();
        auth()->shouldUse('web');
        $this->getJson('/api/me')->assertUnauthorized();
        $this->postJson('/api/register', $data)->assertUnprocessable()->assertJsonValidationErrors(['name', 'email']);
        $this->postJson('/api/login', $data)->assertOk();
        $this->patchJson('/api/me/password', ['current_password' => 'wrong', 'password' => 'updated-password', 'password_confirmation' => 'updated-password'])->assertUnprocessable();
        $this->patchJson('/api/me/password', ['current_password' => 'exam-password', 'password' => 'updated-password', 'password_confirmation' => 'updated-password'])->assertNoContent();
        $this->assertTrue(Hash::check('updated-password', User::where('name', 'rookie')->firstOrFail()->password));
        $this->getJson('/api/profiles/rookie')->assertJsonPath('display_name', 'Kapitány')->assertJsonMissingPath('email')->assertJsonMissingPath('password');
    }

    public function test_ranked_result_is_atomic_and_repeatable(): void
    {
        config(['services.game_server.secret' => 'test-secret']);
        $this->seed();
        $ids = [];
        foreach (range(1, 8) as $i) {
            $user = $this->player('player'.$i);
            $ids[] = $user->id;
            $room = $this->actingAs($user)->postJson('/api/queue')->assertOk();
            $room->assertJsonPath('status', $i === 8 ? 'running' : 'waiting');
        }
        $id = $room->json('id');
        $ticket = $this->postJson('/api/game-tickets', ['game_id' => $id])->assertOk()->json('ticket');
        $this->withToken('test-secret')->postJson('/internal/tickets/redeem', ['ticket' => $ticket])->assertOk();
        $this->postJson('/internal/tickets/redeem', ['ticket' => $ticket])->assertForbidden();
        $expired = $this->postJson('/api/game-tickets', ['game_id' => $id])->json('ticket');
        $this->travel(61)->seconds();
        $this->postJson('/internal/tickets/redeem', ['ticket' => $expired])->assertForbidden();
        $placements = [];
        foreach ($ids as $index => $uid) {
            $placements[] = ['userId' => $uid, 'place' => $index + 1];
        }
        $url = "/internal/matches/$id/result";
        $this->postJson($url, ['ruleset' => 'test', 'placements' => array_slice($placements, 1)])->assertUnprocessable();
        $payload = ['ruleset' => 'test', 'placements' => $placements];
        $this->postJson($url, $payload)->assertNoContent();
        $this->postJson($url, $payload)->assertNoContent();
        $this->getJson('/api/leaderboard')->assertJsonPath('data.0.rating', 1070)->assertJsonPath('data.7.rating', 930);
        $this->getJson('/api/profiles/player1/matches')->assertJsonPath('data.0.delta', 70);
        $this->getJson("/api/matches/$id")->assertJsonCount(8, 'players');
    }

    public function test_admin_changes_apply_to_future_matches_and_void_excludes_results(): void
    {
        config(['services.game_server.secret' => 'test-secret']);
        $this->seed();
        $host = $this->player('host');
        $guest = $this->player('guest');
        $admin = $this->player('moderator');
        $admin->forceFill(['role' => 'admin'])->save();
        $room = $this->actingAs($host)->postJson('/api/lobbies')->json();
        $id = $room['id'];
        $this->postJson("/api/lobbies/$id/start")->assertConflict();
        $this->postJson("/api/lobbies/$id/ready", ['ready' => true])->assertOk();
        $this->actingAs($guest)->postJson('/api/lobbies/join', ['code' => $room['code']])->assertOk();
        $this->postJson("/api/lobbies/$id/ready", ['ready' => true])->assertOk();
        $this->actingAs($host)->postJson("/api/lobbies/$id/start")->assertOk();
        $snapshot = DB::table('games')->where('id', $id)->value('catalog');
        $card = json_decode($snapshot, true)[0];
        $this->actingAs($admin)->postJson('/api/admin/characters/'.$card['id'].'/versions',
            ['template' => $card['id'], 'name' => 'Új név', 'tier' => 2, 'attack' => 4, 'health' => 5])->assertNoContent();
        $this->assertSame($snapshot, DB::table('games')->where('id', $id)->value('catalog'));
        $this->patchJson('/api/admin/users/'.$guest->id.'/status', ['suspended' => true])->assertNoContent();
        $this->actingAs($guest->refresh())->postJson('/api/game-tickets', ['game_id' => $id])->assertForbidden();
        $this->actingAs($admin)->postJson("/api/admin/matches/$id/void", ['reason' => 'Teszt lezárása'])->assertNoContent();
        $this->withToken('test-secret')->postJson("/internal/matches/$id/result", ['ruleset' => 'test', 'placements' => [
            ['userId' => $host->id, 'place' => 1], ['userId' => $guest->id, 'place' => 2]]])->assertConflict();
        $this->assertDatabaseCount('audit_log', 3);
        $this->assertDatabaseHas('profiles', ['user_id' => $host->id, 'rating' => 1000]);
    }
}

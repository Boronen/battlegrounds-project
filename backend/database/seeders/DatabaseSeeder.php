<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function () {
            $definitions = json_decode(file_get_contents(database_path('seeders/catalog.json')), true, flags: JSON_THROW_ON_ERROR);
            foreach ($definitions as $card) {
                if (DB::table('characters')->where('id', $card['id'])->exists()) {
                    continue;
                }
                DB::table('characters')->insert(['id' => $card['id'], 'enabled' => true]);
                DB::table('character_versions')->insert(['character_id' => $card['id'], 'definition' => json_encode($card)]);
            }
            if ($email = env('ADMIN_EMAIL')) {
                if (User::where('email', $email)->exists()) {
                    return;
                }
                $password = env('ADMIN_PASSWORD');
                if (strlen((string) $password) < 12) {
                    throw new \RuntimeException('Legalább 12 karakteres ADMIN_PASSWORD szükséges.');
                }
                $user = User::create(['name' => env('ADMIN_NAME', 'admin'), 'email' => $email, 'password' => $password]);
                $user->forceFill(['role' => 'admin'])->save();
                DB::table('profiles')->insert(['user_id' => $user->id, 'display_name' => $user->name]);
            }
        });
    }
}

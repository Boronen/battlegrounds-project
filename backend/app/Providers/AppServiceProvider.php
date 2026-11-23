<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Gate::define('play', fn (User $user) => ! $user->suspended);
        Gate::define('admin', fn (User $user) => ! $user->suspended && $user->role === 'admin');
    }
}

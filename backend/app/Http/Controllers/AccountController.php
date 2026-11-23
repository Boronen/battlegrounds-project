<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AccountController extends Controller
{
    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'alpha_dash:ascii', 'min:3', 'max:30', 'unique:users'],
            'email' => ['required', 'email', 'max:254', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'max:72', 'confirmed'],
        ]);
        $user = DB::transaction(function () use ($data) {
            $user = User::create($data);
            $profile = new Profile(['display_name' => $user->name]);
            $profile->user_id = $user->id;
            $profile->save();

            return $user->refresh();
        });
        Auth::guard('web')->login($user);
        $request->session()->regenerate();

        return response()->json($this->me($request), 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate(['email' => 'required|email', 'password' => 'required|string']);
        if (! Auth::guard('web')->attempt($credentials + ['suspended' => false])) {
            throw ValidationException::withMessages(['email' => 'A belépési adatok hibásak vagy a fiók fel van függesztve.']);
        }
        $request->session()->regenerate();

        return $this->me($request);
    }

    public function logout(Request $request)
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->noContent();
    }

    public function me(Request $request)
    {
        $user = $request->user();

        return $user->only('id', 'name', 'role', 'email') + ['profile' => Profile::findOrFail($user->id)];
    }

    public function profile(Request $request)
    {
        $data = $request->validate(['display_name' => 'required|string|max:40', 'bio' => 'nullable|string|max:500', 'avatar_key' => 'required|in:default_01,default_02,default_03']);
        Profile::findOrFail($request->user()->id)->update($data);

        return $this->me($request);
    }

    public function password(Request $request)
    {
        $data = $request->validate(['current_password' => 'required|current_password', 'password' => 'required|string|min:8|max:72|confirmed']);
        $request->user()->update(['password' => $data['password']]);
        $request->session()->regenerate();

        return response()->noContent();
    }
}

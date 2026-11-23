<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    protected $primaryKey = 'user_id';

    public $timestamps = false;

    protected $fillable = ['display_name', 'avatar_key', 'bio'];
}

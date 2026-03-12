<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Collection extends Model
{
    public $timestamps = false;

    protected $fillable = ['user_id', 'title', 'description', 'image_url'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function dices(): HasMany
    {
        return $this->hasMany(Dice::class);
    }

    public function likedByUsers(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(User::class, 'likes');
    }
}

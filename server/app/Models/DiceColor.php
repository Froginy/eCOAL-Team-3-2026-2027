<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DiceColor extends Model
{
    protected $fillable = ['dice_id', 'name', 'hex'];

    public function dice(): BelongsTo
    {
        return $this->belongsTo(Dice::class);
    }
}

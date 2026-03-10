<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DiceImage extends Model
{
    protected $fillable = ['dice_id', 'image_url'];

    public function dice(): BelongsTo
    {
        return $this->belongsTo(Dice::class);
    }
}

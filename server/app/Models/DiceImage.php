<?php

namespace App\Models;

use App\Models\Dice;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Validation\ValidationException;

class DiceImage extends Model
{
    protected $fillable = ['dice_id', 'image_url'];

    protected static function booted(): void
    {
        static::creating(function (DiceImage $diceImage) {
            $count = DiceImage::where('dice_id', $diceImage->dice_id)->count();
            if ($count >= 3) {
                throw ValidationException::withMessages([
                    'dice_id' => ['Un dé ne peut avoir que 3 photos maximum.'],
                ]);
            }
        });
    }

    public function dice(): BelongsTo
    {
        return $this->belongsTo(Dice::class);
    }
}

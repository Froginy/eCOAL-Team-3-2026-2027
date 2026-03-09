<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Criteria extends Model
{
    protected $table = 'criterias';

    protected $fillable = ['title', 'description'];

    public $timestamps = false;

    public function dices(): BelongsToMany
    {
        return $this->belongsToMany(Dice::class, 'criteria_dice', 'criteria_id', 'dice_id')
            ->withPivot('value');
    }
}

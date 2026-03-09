<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Dice extends Model
{
    protected $table = 'dices';

    public $timestamps = false;

    protected $fillable = [
        'collection_id',
        'category_1_id',
        'category_2_id',
        'name',
        'description',
        'image_url',
    ];

    public function collection(): BelongsTo
    {
        return $this->belongsTo(Collection::class);
    }

    public function primaryCategory(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'category_1_id');
    }

    public function secondaryCategory(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'category_2_id');
    }

    public function criterias(): BelongsToMany
    {
        return $this->belongsToMany(Criteria::class, 'criteria_dice', 'dice_id', 'criteria_id')
            ->withPivot('value');
    }
}

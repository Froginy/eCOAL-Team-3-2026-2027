<?php

namespace Database\Seeders;

use App\Models\Dice;
use App\Models\User;
use App\Models\Category;
use App\Models\Criteria;
use App\Models\Collection;
use Illuminate\Database\Seeder;

class DiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::where('email', 'liam@example.com')->first();
        if (!$user) return;

        $collection = Collection::where('user_id', $user->id)->first();
        if (!$collection) return;

        $catDnd = Category::where('title', 'D&D')->first();
        $catResine = Category::where('title', 'Resin')->first();
        $catWarhammer = Category::where('title', 'Warhammer')->first();
        $catMetal = Category::where('title', 'Metal')->first();
        $catSet = Category::where('title', 'Full Set')->first();

        $critFaces = Criteria::where('title', 'Faces')->first();
        $critSize = Criteria::where('title', 'Size')->first();

        // Dice 1
        $dice1 = Dice::create([
            'collection_id' => $collection->id,
            'category_1_id' => $catDnd->id ?? null,
            'category_2_id' => $catResine->id ?? null,
            'name' => 'White Dragon Die',
            'description' => 'A gorgeous resin die with icy reflections.',
        ]);
        $dice1->images()->createMany([
            ['image_url' => 'storage/dices/dice_1.jpg'],
            ['image_url' => 'storage/dices/dice-2.jpg'],
            ['image_url' => 'storage/dices/dice-3.jpg'],
        ]);
        $dice1->color()->create([
            'name' => 'Azure',
            'hex' => '#2563eb',
        ]);
        if ($critFaces) $dice1->criterias()->attach($critFaces->id, ['value' => 20]);
        if ($critSize) $dice1->criterias()->attach($critSize->id, ['value' => 15]);

        // Dice 2
        $dice2 = Dice::create([
            'collection_id' => $collection->id,
            'category_1_id' => $catWarhammer->id ?? null,
            'category_2_id' => $catMetal->id ?? null,
            'name' => 'Heavy Metal Die',
            'description' => 'Perfect for crushing enemies on the table.',
        ]);
        $dice2->images()->createMany([
            ['image_url' => 'storage/dices/dice-2.jpg'],
            ['image_url' => 'storage/dices/dice-3.jpg'],
            ['image_url' => 'storage/dices/dice_1.jpg'],
        ]);
        $dice2->color()->create([
            'name' => 'Crimson',
            'hex' => '#dc2626',
        ]);
        if ($critFaces) $dice2->criterias()->attach($critFaces->id, ['value' => 6]);
        if ($critSize) $dice2->criterias()->attach($critSize->id, ['value' => 12]);

        // Dice 3
        $dice3 = Dice::create([
            'collection_id' => $collection->id,
            'category_1_id' => $catSet->id ?? null,
            'category_2_id' => null,
            'name' => 'Galactic Set',
            'description' => 'A set reminiscent of nebulas.',
        ]);
        $dice3->images()->createMany([
            ['image_url' => 'storage/dices/dice-3.jpg'],
            ['image_url' => 'storage/dices/dice_1.jpg'],
            ['image_url' => 'storage/dices/dice-2.jpg'],
        ]);
        $dice3->color()->create([
            'name' => 'Obsidian',
            'hex' => '#1a1a2e',
        ]);
        if ($critFaces) $dice3->criterias()->attach($critFaces->id, ['value' => 12]);
        if ($critSize) $dice3->criterias()->attach($critSize->id, ['value' => 20]);
    }
}

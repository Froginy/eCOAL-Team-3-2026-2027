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

        $critFaces = Criteria::where('title', 'Number of faces')->first();
        $critPoids = Criteria::where('title', 'Weight')->first();

        // Dé 1
        $dice1 = Dice::create([
            'collection_id' => $collection->id,
            'category_1_id' => $catDnd->id ?? null,
            'category_2_id' => $catResine->id ?? null,
            'name' => 'White Dragon Die',
            'description' => 'A gorgeous resin die with icy reflections.',
            'image_url' => asset('storage/dices/dice_1.jpg'),
        ]);
        if ($critFaces) $dice1->criterias()->attach($critFaces->id, ['value' => 20]);
        if ($critPoids) $dice1->criterias()->attach($critPoids->id, ['value' => 15]);

        // Dé 2
        $dice2 = Dice::create([
            'collection_id' => $collection->id,
            'category_1_id' => $catWarhammer->id ?? null,
            'category_2_id' => $catMetal->id ?? null,
            'name' => 'Heavy Metal Die',
            'description' => 'Perfect for crushing enemies on the table.',
            'image_url' => asset('storage/dices/dice-2.jpg'),
        ]);
        if ($critFaces) $dice2->criterias()->attach($critFaces->id, ['value' => 6]);
        if ($critPoids) $dice2->criterias()->attach($critPoids->id, ['value' => 35]);

        // Dé 3
        $dice3 = Dice::create([
            'collection_id' => $collection->id,
            'category_1_id' => $catSet->id ?? null,
            'category_2_id' => null,
            'name' => 'Galactic Set',
            'description' => 'A set reminiscent of nebulas.',
            'image_url' => asset('storage/dices/dice-3.jpg'),
        ]);
        if ($critFaces) $dice3->criterias()->attach($critFaces->id, ['value' => 12]);
        if ($critPoids) $dice3->criterias()->attach($critPoids->id, ['value' => 20]);
    }
}

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

        $critFaces = Criteria::where('title', 'Nombre de face')->first();
        $critTaille = Criteria::where('title', 'Taille')->first();
        $critCouleur = Criteria::where('title', 'Couleur')->first();

        // Dé 1
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
        if ($critFaces) $dice1->criterias()->attach($critFaces->id, ['value' => 20]);
        if ($critTaille) $dice1->criterias()->attach($critTaille->id, ['value' => 15]);
        if ($critCouleur) $dice1->criterias()->attach($critCouleur->id, ['value' => '0.95 0.05 240']);

        // Dé 2
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
        if ($critFaces) $dice2->criterias()->attach($critFaces->id, ['value' => 6]);
        if ($critTaille) $dice2->criterias()->attach($critTaille->id, ['value' => 12]);
        if ($critCouleur) $dice2->criterias()->attach($critCouleur->id, ['value' => '0.6 0 0']);

        // Dé 3
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
        if ($critFaces) $dice3->criterias()->attach($critFaces->id, ['value' => 12]);
        if ($critTaille) $dice3->criterias()->attach($critTaille->id, ['value' => 20]);
        if ($critCouleur) $dice3->criterias()->attach($critCouleur->id, ['value' => '0.4 0.2 300']);
    }
}

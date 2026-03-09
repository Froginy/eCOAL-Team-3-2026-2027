<?php

namespace Database\Seeders;

use App\Models\Criteria;
use Illuminate\Database\Seeder;

class CriteriaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $criterias = [
            ['title' => 'Number of faces', 'description' => 'How many faces does this die have? (e.g., 20)'],
            ['title' => 'Weight', 'description' => 'Weight of the die in grams'],
            ['title' => 'Size', 'description' => 'Size or diameter in mm'],
            ['title' => 'Release Year', 'description' => 'Release year of this model'],
        ];

        foreach ($criterias as $criteria) {
            Criteria::firstOrCreate(['title' => $criteria['title']], ['description' => $criteria['description']]);
        }
    }
}

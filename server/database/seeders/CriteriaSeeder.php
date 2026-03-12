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
            ['title' => 'Faces', 'description' => 'How many faces does this die have? (e.g., 20)'],
            ['title' => 'Size', 'description' => 'Size or diameter in mm'],
        ];

        foreach ($criterias as $criteria) {
            Criteria::updateOrCreate(['title' => $criteria['title']], ['description' => $criteria['description']]);
        }
    }
}

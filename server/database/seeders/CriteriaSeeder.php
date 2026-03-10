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
            ['title' => 'Nombre de face', 'description' => 'Combien de faces possède ce dé ? (ex: 20)'],
            ['title' => 'Taille', 'description' => 'Taille ou diamètre en mm'],
            ['title' => 'Couleur', 'description' => 'Couleur dominante du dé'],
        ];

        foreach ($criterias as $criteria) {
            Criteria::firstOrCreate(['title' => $criteria['title']], ['description' => $criteria['description']]);
        }
    }
}

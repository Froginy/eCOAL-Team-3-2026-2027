<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            'D&D',
            'Warhammer',
            'Metal',
            'Resin',
            'Full Set',
            'Magic',
        ];

        foreach ($categories as $title) {
            Category::firstOrCreate(['title' => $title]);
        }
    }
}

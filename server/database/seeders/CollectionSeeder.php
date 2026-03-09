<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Collection;
use Illuminate\Database\Seeder;

class CollectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::where('email', 'liam@example.com')->first();

        if ($user) {
            Collection::firstOrCreate(
                ['user_id' => $user->id, 'title' => 'My First Collection'],
                [
                    'description' => 'Here are my favorite dice that I use for RPG sessions.',
                    'image_url' => null,
                ]
            );
        }
    }
}

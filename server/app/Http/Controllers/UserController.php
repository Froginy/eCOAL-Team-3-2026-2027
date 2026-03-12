<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Dice;
use Illuminate\Http\Request;
use App\Http\Resources\UserResource;
use App\Http\Resources\DiceResource;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    /**
     * Liste tous les utilisateurs.
     */
    public function index()
    {
        $users = User::withCount(['followers', 'following'])->get();
        return UserResource::collection($users);
    }

    /**
     * Affiche un utilisateur spécifique avec ses collections.
     */
    public function show(int $id)
    {
        $user = User::with(['collections', 'collections.dices'])->withCount(['followers', 'following'])->findOrFail($id);
        return new UserResource($user);
    }

    /**
     * Liste tous les dés appartenant à un utilisateur spécifique.
     */
    public function dices(int $id)
    {
        $user = User::findOrFail($id);
        
        $dices = Dice::whereIn('collection_id', $user->collections()->pluck('id'))
            ->with(['collection', 'primaryCategory', 'secondaryCategory', 'criterias', 'images', 'likedByUsers'])
            ->withCount('likedByUsers')
            ->get();

        return DiceResource::collection($dices);
    }

    /**
     * Met à jour le profil de l'utilisateur connecté.
     */
    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name'                => 'sometimes|string|max:255',
            'email'               => 'sometimes|string|email|max:255|unique:users,email,' . $user->id,
            'description'         => 'nullable|string',
            'profile_picture_url' => 'nullable|string|max:255',
        ]);

        $user->update($validated);

        return new UserResource($user);
    }
}

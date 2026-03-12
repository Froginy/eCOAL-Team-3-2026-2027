<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Resources\UserResource;
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
     * Met à jour le profil de l'utilisateur connecté.
     */
    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name'                => 'sometimes|string|max:255',
            'description'         => 'nullable|string',
            'profile_picture_url' => 'nullable|string|max:255',
        ]);

        $user->update($validated);

        return new UserResource($user);
    }
}

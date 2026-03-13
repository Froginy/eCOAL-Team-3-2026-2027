<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Dice;
use Illuminate\Http\Request;
use App\Http\Resources\UserResource;
use App\Http\Resources\DiceResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

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
     * Liste des abonnés d'un utilisateur.
     */
    public function followers(int $id)
    {
        $user = User::findOrFail($id);
        $followers = $user->followers()->withCount(['followers', 'following'])->get();
        return UserResource::collection($followers);
    }

    /**
     * Liste des personnes suivies par un utilisateur.
     */
    public function following(int $id)
    {
        $user = User::findOrFail($id);
        $following = $user->following()->withCount(['followers', 'following'])->get();
        return UserResource::collection($following);
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
            'profile_picture'     => 'nullable|string', // Supporte le base64
            'profile_picture_url' => 'nullable|string|max:255',
        ]);

        if ($request->filled('profile_picture')) {
            $base64Image = $request->input('profile_picture');
            
            if (preg_match('/^data:image\/(\w+);base64,/', $base64Image, $type)) {
                $image = substr($base64Image, strpos($base64Image, ',') + 1);
                $type = strtolower($type[1]);

                if (!in_array($type, ['jpg', 'jpeg', 'gif', 'png'])) {
                    return response()->json(['message' => 'Invalid image type'], 422);
                }

                $image = base64_decode($image);

                if ($image === false) {
                    return response()->json(['message' => 'Base64 decode failed'], 422);
                }

                $fileName = Str::random(40) . '.' . $type;
                $path = 'profiles/' . $fileName;
                
                Storage::disk('public')->put($path, $image);
                
                $validated['profile_picture_url'] = 'storage/' . $path;
                unset($validated['profile_picture']);
            }
        }

        $user->update($validated);

        return new UserResource($user);
    }
}

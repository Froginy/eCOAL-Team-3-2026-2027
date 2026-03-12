<?php

namespace App\Http\Controllers;

use App\Models\Dice;
use Illuminate\Http\Request;
use App\Http\Resources\DiceResource;

class DiceController extends Controller
{
    /**
     * Liste tous les dés avec leurs relations.
     */
    public function index()
    {
        $dices = Dice::with(['collection', 'primaryCategory', 'secondaryCategory', 'criterias', 'images', 'likedByUsers', 'color'])->withCount('likedByUsers')->get();

        return DiceResource::collection($dices);
    }

    /**
     * Affiche un dé spécifique.
     */
    public function show(int $id)
    {
        $dice = Dice::with(['collection', 'primaryCategory', 'secondaryCategory', 'criterias', 'images', 'likedByUsers', 'color'])->withCount('likedByUsers')->findOrFail($id);

        return new DiceResource($dice);
    }

    /**
     * Crée un nouveau dé.
     */
    public function store(Request $request)
    {
        $user = $request->user();
        
        $validated = $request->validate([
            'collection_id'  => 'required|exists:collections,id',
            'category_1_id'  => 'nullable|exists:categories,id',
            'category_2_id'  => 'nullable|exists:categories,id',
            'name'           => 'nullable|string|max:100',
            'description'    => 'nullable|string',
            'images'         => 'nullable|array|max:3',
            'images.*'       => 'image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'criterias'      => 'nullable|array',
            'criterias.*.criteria_id' => 'required|exists:criterias,id',
            'criterias.*.value'       => 'nullable|integer',
            'color'          => 'nullable|array',
            'color.name'     => 'required_with:color|string|max:50',
            'color.hex'      => 'required_with:color|string|max:7',
        ]);

        // Vérifier que la collection appartient à l'utilisateur
        $collection = \App\Models\Collection::where('id', $validated['collection_id'])
            ->where('user_id', $user->id)
            ->firstOrFail();

        $dice = Dice::create($validated);

        // Attacher la couleur si fournie
        if ($request->has('color')) {
            $dice->color()->create($request->color);
        }

        // Attacher les images si fournies (gestion des fichiers uploadés)
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('dices', 'public');
                $dice->images()->create(['image_url' => 'storage/' . $path]);
            }
        }

        // Attacher les critères si fournis
        if ($request->has('criterias')) {
            $criteriaData = [];
            foreach ($request->criterias as $criteria) {
                $criteriaData[$criteria['criteria_id']] = ['value' => $criteria['value'] ?? null];
            }
            $dice->criterias()->attach($criteriaData);
        }

        $dice->load(['collection', 'primaryCategory', 'secondaryCategory', 'criterias', 'images', 'likedByUsers', 'color']);
        $dice->loadCount('likedByUsers');

        return new DiceResource($dice);
    }

    /**
     * Met à jour un dé existant.
     */
    public function update(Request $request, int $id)
    {
        $dice = Dice::findOrFail($id);

        $validated = $request->validate([
            'collection_id'  => 'sometimes|exists:collections,id',
            'category_1_id'  => 'nullable|exists:categories,id',
            'category_2_id'  => 'nullable|exists:categories,id',
            'name'           => 'nullable|string|max:100',
            'description'    => 'nullable|string',
            'images'         => 'nullable|array|max:3',
            'images.*'       => 'string|max:255',
            'criterias'      => 'nullable|array',
            'criterias.*.criteria_id' => 'required|exists:criterias,id',
            'criterias.*.value'       => 'nullable|integer',
            'color'          => 'nullable|array',
            'color.name'     => 'required_with:color|string|max:50',
            'color.hex'      => 'required_with:color|string|max:7',
        ]);

        $dice->update($validated);

        // Mettre à jour la couleur si fournie
        if ($request->has('color')) {
            $dice->color()->updateOrCreate([], $request->color);
        }

        // Sync les images si fournies
        if ($request->has('images') && is_array($request->images)) {
            $dice->images()->delete(); // Remove old images
            $imagesData = array_map(function ($url) {
                return ['image_url' => $url];
            }, $request->images);
            $dice->images()->createMany($imagesData);
        }

        // Sync les critères si fournis
        if ($request->has('criterias')) {
            $criteriaData = [];
            foreach ($request->criterias as $criteria) {
                $criteriaData[$criteria['criteria_id']] = ['value' => $criteria['value'] ?? null];
            }
            $dice->criterias()->sync($criteriaData);
        }

        $dice->load(['collection', 'primaryCategory', 'secondaryCategory', 'criterias', 'images', 'likedByUsers', 'color']);
        $dice->loadCount('likedByUsers');

        return new DiceResource($dice);
    }

    /**
     * Supprime un dé.
     */
    public function destroy(int $id)
    {
        $dice = Dice::findOrFail($id);
        $dice->delete();

        return response()->json(['message' => 'Dice deleted successfully']);
    }
}

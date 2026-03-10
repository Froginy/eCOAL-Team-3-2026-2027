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
        $dices = Dice::with(['collection', 'primaryCategory', 'secondaryCategory', 'criterias', 'images'])->get();

        return DiceResource::collection($dices);
    }

    /**
     * Affiche un dé spécifique.
     */
    public function show(int $id)
    {
        $dice = Dice::with(['collection', 'primaryCategory', 'secondaryCategory', 'criterias', 'images'])->findOrFail($id);

        return new DiceResource($dice);
    }

    /**
     * Crée un nouveau dé.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'collection_id'  => 'required|exists:collections,id',
            'category_1_id'  => 'nullable|exists:categories,id',
            'category_2_id'  => 'nullable|exists:categories,id',
            'name'           => 'nullable|string|max:100',
            'description'    => 'nullable|string',
            'images'         => 'nullable|array',
            'images.*'       => 'string|max:255',
            'criterias'      => 'nullable|array',
            'criterias.*.criteria_id' => 'required|exists:criterias,id',
            'criterias.*.value'       => 'nullable|integer',
        ]);

        $dice = Dice::create($validated);

        // Attacher les images si fournies
        if ($request->has('images') && is_array($request->images)) {
            $imagesData = array_map(function ($url) {
                return ['image_url' => $url];
            }, $request->images);
            $dice->images()->createMany($imagesData);
        }

        // Attacher les critères si fournis
        if ($request->has('criterias')) {
            $criteriaData = [];
            foreach ($request->criterias as $criteria) {
                $criteriaData[$criteria['criteria_id']] = ['value' => $criteria['value'] ?? null];
            }
            $dice->criterias()->attach($criteriaData);
        }

        $dice->load(['collection', 'primaryCategory', 'secondaryCategory', 'criterias', 'images']);

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
            'images'         => 'nullable|array',
            'images.*'       => 'string|max:255',
            'criterias'      => 'nullable|array',
            'criterias.*.criteria_id' => 'required|exists:criterias,id',
            'criterias.*.value'       => 'nullable|integer',
        ]);

        $dice->update($validated);

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

        $dice->load(['collection', 'primaryCategory', 'secondaryCategory', 'criterias', 'images']);

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

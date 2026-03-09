<?php

namespace App\Http\Controllers;

use App\Models\Dice;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class DiceController extends Controller
{
    /**
     * Liste tous les dés avec leurs relations.
     */
    public function index(): JsonResponse
    {
        $dices = Dice::with(['user', 'primaryCategory', 'secondaryCategory', 'criterias'])->get();

        return response()->json($dices);
    }

    /**
     * Affiche un dé spécifique.
     */
    public function show(int $id): JsonResponse
    {
        $dice = Dice::with(['user', 'primaryCategory', 'secondaryCategory', 'criterias'])->findOrFail($id);

        return response()->json($dice);
    }

    /**
     * Crée un nouveau dé.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id'        => 'required|exists:users,id',
            'category_1_id'  => 'nullable|exists:categories,id',
            'category_2_id'  => 'nullable|exists:categories,id',
            'name'           => 'nullable|string|max:100',
            'description'    => 'nullable|string',
            'image_url'      => 'nullable|string|max:255',
            'criterias'      => 'nullable|array',
            'criterias.*.criteria_id' => 'required|exists:criterias,id',
            'criterias.*.value'       => 'nullable|integer',
        ]);

        $dice = Dice::create($validated);

        // Attacher les critères si fournis
        if ($request->has('criterias')) {
            $criteriaData = [];
            foreach ($request->criterias as $criteria) {
                $criteriaData[$criteria['criteria_id']] = ['value' => $criteria['value'] ?? null];
            }
            $dice->criterias()->attach($criteriaData);
        }

        $dice->load(['user', 'primaryCategory', 'secondaryCategory', 'criterias']);

        return response()->json($dice, 201);
    }

    /**
     * Met à jour un dé existant.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $dice = Dice::findOrFail($id);

        $validated = $request->validate([
            'user_id'        => 'sometimes|exists:users,id',
            'category_1_id'  => 'nullable|exists:categories,id',
            'category_2_id'  => 'nullable|exists:categories,id',
            'name'           => 'nullable|string|max:100',
            'description'    => 'nullable|string',
            'image_url'      => 'nullable|string|max:255',
            'criterias'      => 'nullable|array',
            'criterias.*.criteria_id' => 'required|exists:criterias,id',
            'criterias.*.value'       => 'nullable|integer',
        ]);

        $dice->update($validated);

        // Sync les critères si fournis
        if ($request->has('criterias')) {
            $criteriaData = [];
            foreach ($request->criterias as $criteria) {
                $criteriaData[$criteria['criteria_id']] = ['value' => $criteria['value'] ?? null];
            }
            $dice->criterias()->sync($criteriaData);
        }

        $dice->load(['user', 'primaryCategory', 'secondaryCategory', 'criterias']);

        return response()->json($dice);
    }

    /**
     * Supprime un dé.
     */
    public function destroy(int $id): JsonResponse
    {
        $dice = Dice::findOrFail($id);
        $dice->delete();

        return response()->json(['message' => 'Dice deleted successfully']);
    }
}

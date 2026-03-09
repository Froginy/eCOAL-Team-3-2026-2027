<?php

namespace App\Http\Controllers;

use App\Models\Criteria;
use Illuminate\Http\Request;
use App\Http\Resources\CriteriaResource;

class CriteriaController extends Controller
{
    /**
     * Liste tous les critères.
     */
    public function index()
    {
        $criterias = Criteria::all();
        return CriteriaResource::collection($criterias);
    }

    /**
     * Crée un nouveau critère.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'       => 'required|string|max:50',
            'description' => 'nullable|string|max:255',
        ]);

        $criteria = Criteria::create($validated);

        return new CriteriaResource($criteria);
    }

    /**
     * Affiche un critère spécifique.
     */
    public function show(int $id)
    {
        $criteria = Criteria::findOrFail($id);
        return new CriteriaResource($criteria);
    }

    /**
     * Met à jour un critère existant.
     */
    public function update(Request $request, int $id)
    {
        $criteria = Criteria::findOrFail($id);

        $validated = $request->validate([
            'title'       => 'sometimes|string|max:50',
            'description' => 'nullable|string|max:255',
        ]);

        $criteria->update($validated);

        return new CriteriaResource($criteria);
    }

    /**
     * Supprime un critère.
     */
    public function destroy(int $id)
    {
        $criteria = Criteria::findOrFail($id);
        $criteria->delete();

        return response()->json(['message' => 'Criteria deleted successfully']);
    }
}

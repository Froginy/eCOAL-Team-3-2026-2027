<?php

namespace App\Http\Controllers;

use App\Models\Collection;
use Illuminate\Http\Request;
use App\Http\Resources\CollectionResource;

class CollectionController extends Controller
{
    /**
     * Liste toutes les collections.
     */
    public function index()
    {
        $collections = Collection::with(['user', 'dices'])->get();
        return CollectionResource::collection($collections);
    }

    /**
     * Crée une nouvelle collection.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id'     => 'required|exists:users,id',
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'image_url'   => 'nullable|string|max:255',
        ]);

        $collection = Collection::create($validated);
        $collection->load(['user', 'dices']);

        return new CollectionResource($collection);
    }

    /**
     * Affiche une collection spécifique.
     */
    public function show(int $id)
    {
        // On charge aussi les relations profondes pour les dés de la collection
        $collection = Collection::with([
            'user', 
            'dices', 
            'dices.primaryCategory', 
            'dices.secondaryCategory', 
            'dices.criterias'
        ])->findOrFail($id);

        return new CollectionResource($collection);
    }

    /**
     * Met à jour une collection existante.
     */
    public function update(Request $request, int $id)
    {
        $collection = Collection::findOrFail($id);

        $validated = $request->validate([
            'user_id'     => 'sometimes|exists:users,id',
            'title'       => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'image_url'   => 'nullable|string|max:255',
        ]);

        $collection->update($validated);
        $collection->load(['user', 'dices']);

        return new CollectionResource($collection);
    }

    /**
     * Supprime une collection.
     */
    public function destroy(int $id)
    {
        $collection = Collection::findOrFail($id);
        $collection->delete();

        return response()->json(['message' => 'Collection deleted successfully']);
    }
}

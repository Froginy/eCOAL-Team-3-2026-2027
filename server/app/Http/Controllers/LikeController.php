<?php

namespace App\Http\Controllers;

use App\Models\Collection;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class LikeController extends Controller
{
    /**
     * Like a collection.
     */
    public function like(Request $request, int $id): JsonResponse
    {
        $collection = Collection::findOrFail($id);
        $user = $request->user();

        $user->likedCollections()->syncWithoutDetaching([$collection->id]);

        return response()->json([
            'message' => 'Successfully liked collection ' . $collection->title
        ]);
    }

    /**
     * Unlike a collection.
     */
    public function unlike(Request $request, int $id): JsonResponse
    {
        $collection = Collection::findOrFail($id);
        $user = $request->user();

        $user->likedCollections()->detach($collection->id);

        return response()->json([
            'message' => 'Successfully unliked collection ' . $collection->title
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Dice;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class LikeController extends Controller
{
    /**
     * Like a dice.
     */
    public function like(Request $request, int $id): JsonResponse
    {
        $dice = Dice::with('collection')->findOrFail($id);
        $user = $request->user();

        if ($dice->collection->user_id === $user->id) {
            return response()->json([
                'message' => 'You cannot like your own dice.'
            ], 403);
        }

        $user->likedDices()->syncWithoutDetaching([$dice->id]);

        return response()->json([
            'message' => 'Successfully liked dice ' . $dice->name
        ]);
    }

    /**
     * Unlike a dice.
     */
    public function unlike(Request $request, int $id): JsonResponse
    {
        $dice = Dice::findOrFail($id);
        $user = $request->user();

        $user->likedDices()->detach($dice->id);

        return response()->json([
            'message' => 'Successfully unliked dice ' . $dice->name
        ]);
    }
}

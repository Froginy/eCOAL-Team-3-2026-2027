<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SubscriptionController extends Controller
{
    /**
     * Subscribe to a user.
     */
    public function subscribe(Request $request, int $id): JsonResponse
    {
        $targetUser = User::findOrFail($id);
        $user = $request->user();

        if ($user->id === $targetUser->id) {
            return response()->json(['message' => 'You cannot subscribe to yourself.'], 400);
        }

        $user->following()->syncWithoutDetaching([$targetUser->id]);

        return response()->json([
            'message' => 'Successfully subscribed to ' . $targetUser->name
        ]);
    }

    /**
     * Unsubscribe from a user.
     */
    public function unsubscribe(Request $request, int $id): JsonResponse
    {
        $targetUser = User::findOrFail($id);
        $user = $request->user();

        $user->following()->detach($targetUser->id);

        return response()->json([
            'message' => 'Successfully unsubscribed from ' . $targetUser->name
        ]);
    }
}

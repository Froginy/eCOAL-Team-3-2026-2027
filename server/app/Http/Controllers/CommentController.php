<?php

namespace App\Http\Controllers;

use App\Models\Dice;
use App\Models\Comment;
use App\Http\Resources\CommentResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CommentController extends Controller
{
    /**
     * Get comments for a specific dice.
     */
    public function index(int $dice_id): AnonymousResourceCollection
    {
        $dice = Dice::findOrFail($dice_id);
        $comments = $dice->comments()->with('user')->latest()->get();

        return CommentResource::collection($comments);
    }

    /**
     * Post a new comment on a dice.
     */
    public function store(Request $request, int $dice_id): CommentResource
    {
        $request->validate([
            'content' => 'required|string|max:1000',
        ]);

        $dice = Dice::findOrFail($dice_id);

        $comment = Comment::create([
            'user_id' => $request->user()->id,
            'dice_id' => $dice->id,
            'content' => $request->content,
        ]);

        return new CommentResource($comment->load('user'));
    }
}

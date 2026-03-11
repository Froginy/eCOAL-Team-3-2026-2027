<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DiceResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'collection_id' => $this->collection_id,
            'category_1_id' => $this->category_1_id,
            'category_2_id' => $this->category_2_id,
            'name' => $this->name,
            'description' => $this->description,
            // Inclusions conditionnelles si les relations sont chargées
            'collection' => new CollectionResource($this->whenLoaded('collection')),
            'primary_category' => new CategoryResource($this->whenLoaded('primaryCategory')),
            'secondary_category' => new CategoryResource($this->whenLoaded('secondaryCategory')),
            'criterias' => CriteriaResource::collection($this->whenLoaded('criterias')),
            'images' => DiceImageResource::collection($this->whenLoaded('images')),
            'likes_count' => $this->whenCounted('likedByUsers'),
            'is_liked_by_current_user' => $request->user() && $this->relationLoaded('likedByUsers') ? $this->likedByUsers->contains($request->user()->id) : false,
        ];
    }
}

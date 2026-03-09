<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CollectionResource extends JsonResource
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
            'user_id' => $this->user_id,
            'title' => $this->title,
            'description' => $this->description,
            'image_url' => $this->image_url,
            // Inclusions conditionnelles si les relations sont chargées
            'user' => new UserResource($this->whenLoaded('user')),
            'dices' => DiceResource::collection($this->whenLoaded('dices')),
        ];
    }
}

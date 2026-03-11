<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CriteriaResource extends JsonResource
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
            'title' => $this->title,
            'description' => $this->description,
            // S'il est chargé via la table pivot "criteria_dice" :
            'value' => $this->whenPivotLoaded('criteria_dice', function () {
                return $this->pivot->value;
            }),
        ];
    }
}

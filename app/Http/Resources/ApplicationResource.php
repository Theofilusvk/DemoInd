<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ApplicationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'stack_id' => $this->stack_id,
            'stack' => new StackResource($this->whenLoaded('stack')),
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'subdomain' => $this->subdomain,
            'status' => $this->status,
            'created_at' => $this->created_at,
        ];
    }
}

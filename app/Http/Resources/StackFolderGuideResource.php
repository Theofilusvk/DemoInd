<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StackFolderGuideResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'stack_id' => $this->stack_id,
            'step_order' => $this->step_order,
            'path' => $this->path,
            'description' => $this->description,
            'is_required' => $this->is_required,
        ];
    }
}

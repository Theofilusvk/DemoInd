<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AppVersionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'application_id' => $this->application_id,
            'version' => $this->version,
            'notes' => $this->notes,
            'original_name' => $this->original_name,
            'size_kb' => $this->size_kb,
            'status' => $this->status,
            'is_current' => $this->is_current,
            'created_at' => $this->created_at,
        ];
    }
}

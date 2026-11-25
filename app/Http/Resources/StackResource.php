<?php
// control column yg dikirim ke frontend dlm format json.
namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StackResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'is_active' => $this->is_active,
            'folder_guides_count' => $this->whenCounted('folderGuides'),
            'rules_count' => $this->whenCounted('rules'),
            'created_at' => $this->created_at,
        ];
    }
}

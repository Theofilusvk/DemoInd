<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EnvironmentVariableResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'application_id' => $this->application_id,
            'key' => $this->key,
            // ini biar valuenya gak ikut ke print di console
            'value' => $this->is_secret && $this->value !== null ? '********' : $this->value,
            'is_secret' => $this->is_secret,
        ];
    }
}

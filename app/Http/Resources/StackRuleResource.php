<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StackRuleResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'stack_id' => $this->stack_id,
            'rule_type' => $this->rule_type,
            'value' => $this->value,
            'severity' => $this->severity,
            'message' => $this->message,
        ];
    }
}

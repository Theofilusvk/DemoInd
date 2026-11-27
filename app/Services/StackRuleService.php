<?php

namespace App\Services;

use App\Models\Stack;
use App\Models\StackRule;
use Illuminate\Database\Eloquent\Collection;

class StackRuleService
{
    public function listByStack(Stack $stack): Collection
    {
        return $stack->rules()->get();
    }

    public function create(Stack $stack, array $data): StackRule
    {
        return $stack->rules()->create($data);
    }

    public function update(StackRule $rule, array $data): StackRule
    {
        $rule->update($data);
        return $rule->refresh();
    }

    public function delete(StackRule $rule): void
    {
        $rule->delete();
    }
}

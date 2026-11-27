<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StackRuleRequest;
use App\Http\Resources\StackRuleResource;
use App\Models\Stack;
use App\Models\StackRule;
use App\Services\StackRuleService;
use Illuminate\Http\JsonResponse;

class StackRuleController extends Controller
{
    public function __construct(private StackRuleService $service) {}

    public function index(Stack $stack): JsonResponse
    {
        return $this->ok(StackRuleResource::collection($this->service->listByStack($stack)), 'Aturan stack');
    }

    public function store(StackRuleRequest $request, Stack $stack): JsonResponse
    {
        return $this->ok(new StackRuleResource($this->service->create($stack, $request->validated())), 'Aturan berhasil dibuat', 201);
    }

    public function update(StackRuleRequest $request, StackRule $rule): JsonResponse
    {
        return $this->ok(new StackRuleResource($this->service->update($rule, $request->validated())), 'Aturan berhasil diperbarui');
    }

    public function destroy(StackRule $rule): JsonResponse
    {
        $this->service->delete($rule);
        return $this->ok(null, 'Aturan berhasil dihapus');
    }
}

<?php
// REST disini (Index, store, show, update, destroy)
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StackRequest;
use App\Http\Resources\StackResource;
use App\Models\Stack;
use App\Services\StackService;
use Illuminate\Http\JsonResponse;
use Psy\Util\Json;

class StackController extends Controller
{

    public function __construct(private StackService $service) {}

    // Response berulang di bikin function "ok"
    public function ok(mixed $data, string $message, int $code = 200): JsonResponse
    {
        return response()->json(['success' => true, 'data' => $data, 'message' =>
        $message], $code);
    }

    public function index(): JsonResponse
    {
        return $this->ok(StackResource::collection($this->service->list()), 'Daftar stack');
    }

    public function store(StackRequest $request): JsonResponse
    {
        return $this->ok(
            new StackResource($this->service->create($request->validated())),
            'Stack berhasil dibuat',
            201
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(Stack $stack): JsonResponse
    {
        return $this->ok(
            new StackResource($stack->loadCount(['folderGuides', 'rules'])),
            'Detail stack'
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StackRequest $request, Stack $stack): JsonResponse
    {
        return $this->ok(
            new StackResource($this->service->update($stack, $request->validated())),
            'Stack berhasil diperbarui'
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Stack $stack): JsonResponse
    {
        $this->service->delete($stack);
        return $this->ok(null, 'Stack berhasil dihapus');
    }
}

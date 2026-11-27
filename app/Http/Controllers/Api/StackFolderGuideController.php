<?php
// Endpoint Nested REST buat ke Admin folder controller nanti
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StackFolderGuideRequest;
use App\Http\Resources\StackFolderGuideResource;
use App\Models\Stack;
use App\Models\StackFolderGuide;
use App\Services\StackFolderGuideService;
use Illuminate\Http\JsonResponse;

class StackFolderGuideController extends Controller
{
    public function __construct(private StackFolderGuideService $service) {}

    public function index(Stack $stack): JsonResponse
    {
        return $this->ok(StackFolderGuideResource::collection($this->service->listByStack($stack)), 'Panduan folder stack');
    }

    public function store(StackFolderGuideRequest $request, Stack $stack): JsonResponse
    {
        return $this->ok(new StackFolderGuideResource($this->service->create($stack, $request->validated())), 'Panduan berhasil dibuat', 201);
    }

    public function update(StackFolderGuideRequest $request, StackFolderGuide $folderGuide): JsonResponse
    {
        return $this->ok(new StackFolderGuideResource($this->service->update($folderGuide, $request->validated())), 'Panduan berhasil diperbarui');
    }

    public function destroy(StackFolderGuide $folderGuide): JsonResponse
    {
        $this->service->delete($folderGuide);
        return $this->ok(null, 'Panduan berhasil dihapus');
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ApplicationRequest;
use App\Http\Resources\ApplicationResource;
use App\Models\Application;
use App\Services\ApplicationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ApplicationController extends Controller
{
    public function __construct(private ApplicationService $service) {}

    public function index(Request $request): JsonResponse
    {
        return $this->ok(ApplicationResource::collection($this->service->listByUser($request->user())), 'Daftar aplikasi');
    }

    public function store(ApplicationRequest $request): JsonResponse
    {
        return $this->ok(new ApplicationResource($this->service->create($request->user(), $request->validated())), 'Aplikasi berhasil dibuat', 201);
    }

    public function show(Request $request, Application $application): JsonResponse
    {
        if ($application->user_id !== $request->user()->id) {
            return $this->fail('Akses ditolak', 403);
        }
        return $this->ok(new ApplicationResource($application->load('stack')), 'Detail aplikasi');
    }

    public function update(ApplicationRequest $request, Application $application): JsonResponse
    {
        if ($application->user_id !== $request->user()->id) {
            return $this->fail('Akses ditolak', 403);
        }
        return $this->ok(new ApplicationResource($this->service->update($application, $request->validated())), 'Aplikasi berhasil diperbarui');
    }

    public function destroy(Request $request, Application $application): JsonResponse
    {
        if ($application->user_id !== $request->user()->id) {
            return $this->fail('Akses ditolak', 403);
        }
        $this->service->delete($application);
        return $this->ok(null, 'Aplikasi berhasil dihapus');
    }
}

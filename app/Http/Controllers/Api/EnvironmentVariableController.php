<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\EnvironmentVariableRequest;
use App\Http\Resources\EnvironmentVariableResource;
use App\Models\Application;
use App\Models\EnvironmentVariable;
use App\Services\EnvironmentVariableService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EnvironmentVariableController extends Controller
{
    public function __construct(private EnvironmentVariableService $service) {}

    public function index(Request $request, Application $application): JsonResponse
    {
        if ($application->user_id !== $request->user()->id) {
            return $this->fail('Akses ditolak', 403);
        }
        return $this->ok(EnvironmentVariableResource::collection($this->service->listByApplication($application)), 'Daftar env variable');
    }

    public function store(EnvironmentVariableRequest $request, Application $application): JsonResponse
    {
        if ($application->user_id !== $request->user()->id) {
            return $this->fail('Akses ditolak', 403);
        }
        return $this->ok(new EnvironmentVariableResource($this->service->create($application, $request->validated())), 'Env variable berhasil dibuat', 201);
    }

    public function update(EnvironmentVariableRequest $request, EnvironmentVariable $envVar): JsonResponse
    {
        if ($envVar->application->user_id !== $request->user()->id) {
            return $this->fail('Akses ditolak', 403);
        }
        return $this->ok(new EnvironmentVariableResource($this->service->update($envVar, $request->validated())), 'Env variable berhasil diperbarui');
    }

    public function destroy(Request $request, EnvironmentVariable $envVar): JsonResponse
    {
        if ($envVar->application->user_id !== $request->user()->id) {
            return $this->fail('Akses ditolak', 403);
        }
        $this->service->delete($envVar);
        return $this->ok(null, 'Env variable berhasil dihapus');
    }
}

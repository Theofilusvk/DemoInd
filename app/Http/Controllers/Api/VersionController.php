<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\VersionRequest;
use App\Http\Resources\AppVersionResource;
use App\Models\Application;
use App\Models\AppVersion;
use App\Services\VersionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VersionController extends Controller
{
    public function __construct(private VersionService $service) {}

    public function index(Request $request, Application $application): JsonResponse
    {
        if ($application->user_id !== $request->user()->id) {
            return $this->fail('Akses ditolak', 403);
        }
        return $this->ok(AppVersionResource::collection($this->service->listByApplication($application)), 'Riwayat versi aplikasi');
    }

    public function store(VersionRequest $request, Application $application): JsonResponse
    {
        if ($application->user_id !== $request->user()->id) {
            return $this->fail('Akses ditolak', 403);
        }
        $version = $this->service->upload($application, $request->file('file'), $request->validated());
        return $this->ok(new AppVersionResource($version), 'Versi aplikasi berhasil diupload & diekstrak', 201);
    }

    public function show(Request $request, AppVersion $version): JsonResponse
    {
        if ($version->application->user_id !== $request->user()->id) {
            return $this->fail('Akses ditolak', 403);
        }
        return $this->ok(new AppVersionResource($version), 'Detail versi aplikasi');
    }
}

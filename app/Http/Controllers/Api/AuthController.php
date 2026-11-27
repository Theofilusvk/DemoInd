<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function __construct(private AuthService $service) {}

    public function register(RegisterRequest $request): JsonResponse
    {
        return $this->ok(new UserResource($this->service->register($request->validated())), 'Registrasi berhasil', 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $result = $this->service->login($request->email, $request->password);
        if (! $result) {
            return $this->fail('Email atau password salah', 401);
        }

        return $this->ok(['user' => new UserResource($result['user']), 'token' => $result['token']], 'Login berhasil');
    }

    public function me(Request $request): JsonResponse
    {
        return $this->ok(new UserResource($request->user()), 'Profil user');
    }

    public function logout(Request $request): JsonResponse
    {
        $this->service->logout($request->user());
        return $this->ok(null, 'Logout berhasil');
    }
}

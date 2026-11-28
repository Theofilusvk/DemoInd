<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\StackController;
use App\Http\Controllers\Api\StackFolderGuideController;
use App\Http\Controllers\Api\StackRuleController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ApplicationController;
use App\Http\Controllers\Api\EnvironmentVariableController;
use App\Http\Controllers\Api\VersionController;



Route::apiResource('stacks.rules', StackRuleController::class)
    ->shallow()
    ->except(['show']);

Route::apiResource('stacks.folder-guides', StackFolderGuideController::class)
    //buat nyari pemilik stack nya
    ->shallow()

    ->except(['show']);


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// udh ambil semua get/post/put/delete
Route::apiResource('stacks', StackController::class);


// Auth Controller
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });

    // Route buat Application & Environment Variable
    Route::middleware('auth:sanctum')->group(function () {
        Route::apiResource('applications', ApplicationController::class);
        Route::apiResource('applications.env-vars', EnvironmentVariableController::class)
            ->shallow()
            ->except(['show']);
    });

    // Archiving dan Versionining 
    Route::apiResource('applications.versions', VersionController::class)
        ->shallow()
        ->only(['index', 'store', 'show']);
});

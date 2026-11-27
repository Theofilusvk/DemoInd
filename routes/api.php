<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\StackController;
use App\Http\Controllers\Api\StackFolderGuideController;

Route::apiResource('stacks.folder-guides', StackFolderGuideController::class)
    //buat nyari pemilik stack nya
    ->shallow()

    ->except(['show']);


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// udh ambil semua get/post/put/delete
Route::apiResource('stacks', StackController::class);

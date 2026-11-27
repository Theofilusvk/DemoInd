<?php

namespace App\Services;

use App\Models\Application;
use App\Models\User;
use Illuminate\Database\Eloquent\Collection;

class ApplicationService
{
    public function listByUser(User $user): Collection
    {
        return $user->applications()->with('stack')->latest()->get();
    }

    public function create(User $user, array $data): Application
    {
        return $user->applications()->create($data)->refresh()->load('stack');
    }

    public function update(Application $app, array $data): Application
    {
        $app->update($data);
        return $app->refresh()->load('stack');
    }

    public function delete(Application $app): void
    {
        $app->delete();
    }
}

<?php

namespace App\Services;

use App\Models\Application;
use App\Models\EnvironmentVariable;
use Illuminate\Database\Eloquent\Collection;

class EnvironmentVariableService
{
    public function listByApplication(Application $app): Collection
    {
        return $app->environmentVariables()->orderBy('key')->get();
    }

    public function create(Application $app, array $data): EnvironmentVariable
    {
        return $app->environmentVariables()->create($data)->refresh();
    }

    public function update(EnvironmentVariable $envVar, array $data): EnvironmentVariable
    {
        $envVar->update($data);
        return $envVar->refresh();
    }

    public function delete(EnvironmentVariable $envVar): void
    {
        $envVar->delete();
    }
}

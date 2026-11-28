<?php

namespace App\Services;

use App\Models\Application;
use App\Models\AppVersion;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\UploadedFile;

class VersionService
{
    public function __construct(private ArchiveService $archive) {}

    public function listByApplication(Application $app): Collection
    {
        return $app->versions()->get();
    }

    public function upload(Application $app, UploadedFile $file, array $data): AppVersion
    {
        $timestamp = now()->format('Ymd_His');
        $storedPath = $this->archive->store($file, $app, $timestamp);
        $extractedPath = $this->archive->extract($storedPath);

        $version = $app->versions()->create([
            'version' => $data['version'],
            'notes' => $data['notes'] ?? null,
            'original_name' => $file->getClientOriginalName(),
            'stored_path' => $storedPath,
            'extracted_path' => $extractedPath,
            'size_kb' => (int) ceil($file->getSize() / 1024),
            'status' => 'uploaded',
            'is_current' => false,
        ]);

        $this->setCurrent($version);
        return $version->refresh();
    }

    public function setCurrent(AppVersion $version): void
    {
        $version->application->versions()->update(['is_current' => false]);
        $version->update(['is_current' => true]);
    }
}

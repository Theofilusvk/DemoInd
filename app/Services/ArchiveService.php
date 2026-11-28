<?php

namespace App\Services;

use App\Models\Application;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use RuntimeException;
use ZipArchive;

class ArchiveService
{
    // Akses store di
    public function store(UploadedFile $file, Application $app, string $timestamp): string
    {
        $dir = "uploads/{$app->id}/{$timestamp}";
        $filename = "{$app->slug}-{$timestamp}.zip";

        return $file->storeAs($dir, $filename, 'local');
    }

    public function extract(string $storedPath): string
    {
        $extractRel = dirname($storedPath) . '/extracted';
        $extractFull = Storage::disk('local')->path($extractRel);
        if (! is_dir($extractFull)) {
            mkdir($extractFull, 0755, true);
        }

        $zip = new ZipArchive;
        if ($zip->open(Storage::disk('local')->path($storedPath)) !== true) {
            throw new RuntimeException('File ZIP tidak valid atau rusak.');
        }

        $zip->extractTo($extractFull);
        $zip->close();

        return $extractRel;
    }
}

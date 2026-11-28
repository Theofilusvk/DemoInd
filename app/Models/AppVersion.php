<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AppVersion extends Model
{
    protected $fillable = [
        'application_id',
        'version',
        'notes',
        'original_name',
        'stored_path',
        'extracted_path',
        'size_kb',
        'status',
        'is_current',
    ];

    protected function casts(): array
    {
        return ['size_kb' => 'integer', 'is_current' => 'boolean'];
    }

    public function application(): BelongsTo
    {
        return $this->belongsTo(Application::class);
    }
}

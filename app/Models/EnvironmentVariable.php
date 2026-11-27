<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
// relasi di application
class EnvironmentVariable extends Model
{
    protected $fillable = ['application_id', 'key', 'value', 'is_secret'];

    protected function casts(): array
    {
        return ['is_secret' => 'boolean'];
    }

    public function application(): BelongsTo
    {
        return $this->belongsTo(Application::class);
    }
}

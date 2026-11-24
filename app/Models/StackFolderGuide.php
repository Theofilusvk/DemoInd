<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Override;

class StackFolderGuide extends Model
{
    protected $fillable = [
        'stack_id',
        'step_order',
        'path',
        'description',
        'is_required',
    ];

    #[Override]
    protected function casts(): array
    {
        return
            [
                'step_order' => 'integer',
                'is_required' => 'boolean',
            ];
    }
    public function stack(): BelongsTo
    {
        return $this->belongsTo(Stack::class);
    }
}

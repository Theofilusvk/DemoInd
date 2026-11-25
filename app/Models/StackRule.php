<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StackRule extends Model
{
    protected $fillable = [
        'stack_id',
        'rule_type',
        'value',
        'severity',
        'message',
    ];

    public function stack(): BelongsTo
    {
        return $this->belongsTo(Stack::class);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Application extends Model
{
    protected $fillable = [
        'user_id',
        'stack_id',
        'name',
        'slug',
        'description',
        'subdomain',
        'status',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function stack(): BelongsTo
    {
        return $this->belongsTo(Stack::class);
    }
}

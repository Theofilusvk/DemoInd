<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Stack extends Model
{
    protected $fillable = ['name', 'slug', 'description', 'is_active'];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }
    // gajadi protected krn call dari luar class
    public function folderGuides(): HasMany
    {
        // relation with model stackfolderguides
        return $this->hasMany(StackFolderGuide::class)->orderBy('step_order');
    }
    // relation with model stackrules - gjdi protected jg sama kyk atas
    public function rules(): HasMany
    {
        return $this->hasMany(StackRule::class);
    }
}

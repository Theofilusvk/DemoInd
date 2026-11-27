<?php
// bwt query list, update, create, delete
namespace App\Services;

use App\Models\Stack;
use App\Models\StackFolderGuide;
use Illuminate\Database\Eloquent\Collection;

class StackFolderGuideService
{
    // Query list
    public function listByStack(Stack $stack): Collection
    {
        return $stack->folderGuides()->get();
    }
    // Create
    public function create(Stack $stack, array $data): StackFolderGuide
    {
        return $stack->folderGuides()->create($data);
    }
    // Update
    public function update(StackFolderGuide $guide, array $data): StackFolderGuide
    {
        $guide->update($data);
        return $guide->refresh();
    }

    public function delete(StackFolderGuide $guide): void
    {
        $guide->delete();
    }
}

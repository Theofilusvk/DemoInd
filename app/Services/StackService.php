<?php
// CRUD disini
namespace App\Services;

use App\Models\Stack;
use Illuminate\Database\Eloquent\Collection;

class StackService
{

    public function list(): Collection
    {
        return Stack::withCount(['folderGuides', 'rules'])->latest()->get();
    }

    public function create(array $data): Stack
    {
        return Stack::create($data);
    }

    public function update(Stack $stack, array $data): Stack
    {
        $stack->update($data);
        return $stack->refresh();
    }

    public function delete(Stack $stack): void
    {
        $stack->delete();
    }
}

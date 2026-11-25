<?php
// validasi disini, biar controler bersih
namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class StackRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        // if function klo blm diisi dan ubah format teks jadi slug
        if (! $this->filled('slug') && $this->filled('name')) {
            $this->merge(['slug' => Str::slug($this->name)]);
        }
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:100'],
            'slug' => ['required', 'string', 'max:100', Rule::unique('stacks', 'slug')->ignore($this->route('stack'))],
            'description' => ['nullable', 'string'],
            'is_active' => ['sometimes', 'boolean']
        ];
    }
}

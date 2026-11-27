<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class ApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if (! $this->filled('slug') && $this->filled('name')) {
            $this->merge(['slug' => Str::slug($this->name)]);
        }
    }

    public function rules(): array
    {
        $app = $this->route('application');

        return [
            'stack_id' => ['required', 'integer', 'exists:stacks,id'],
            'name' => ['required', 'string', 'max:150'],
            'slug' => ['required', 'string', 'max:150', Rule::unique('applications', 'slug')->ignore($app)],
            'description' => ['nullable', 'string'],
            // Constraint buat penulisan (ankga,huruf,-,_)
            'subdomain' => ['nullable', 'string', 'max:63', 'alpha_dash', Rule::unique('applications', 'subdomain')->ignore($app)],
        ];
    }
}

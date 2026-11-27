<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StackFolderGuideRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }


    public function rules(): array
    {
        return [
            'step_order' => ['required', 'integer', 'min:1'],
            'path' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'is_required' => ['sometimes', 'boolean']
        ];
    }
}

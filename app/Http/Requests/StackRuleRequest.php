<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StackRuleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'rule_type' => ['required', Rule::in(['required_file', 'required_dir', 'forbidden_path', 'max_size_mb', 'allowed_ext'])],
            'value' => ['required', 'string', 'max:255'],
            'severity' => ['sometimes', Rule::in(['error', 'warning'])],
            'message' => ['nullable', 'string'],
        ];
    }
}

<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class EnvironmentVariableRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }
    // AIMOD - buat ngubah "key" biar jadi huruf besar
    protected function prepareForValidation(): void
    {
        if ($this->filled('key')) {
            $this->merge(['key' => strtoupper($this->key)]);
        }
    }

    public function rules(): array
    {
        $envVar = $this->route('env_var');
        $appId = $this->route('application')?->id ?? $envVar?->application_id;

        return [
            // AIMOD - Di bagian regex, fungsinya biar awalan key diawali dengan huruf. Rule unique mengecek keunikan key khusus di aplikasi tersebut saja
            'key' => ['required', 'string', 'max:100', 'regex:/^[A-Z][A-Z0-9_]*$/', Rule::unique('environment_variables', 'key')->where('application_id', $appId)->ignore($envVar)],
            'value' => ['nullable', 'string'],
            'is_secret' => ['sometimes', 'boolean'],
        ];
    }
}

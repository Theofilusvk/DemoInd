<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class VersionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $appId = $this->route('application')->id;

        return [
            'version' => ['required', 'string', 'max:20', Rule::unique('app_versions', 'version')->where('application_id', $appId)],
            'notes' => ['nullable', 'string'],
            // File wajib zip trs maks 50 mb (nnti ada constraint gsh include nodemodules/vendor package bawaan), extension zip dari php
            'file' => ['required', 'file', 'mimes:zip', 'max:51200'],
        ];
    }
}

export const SUBMISSION_STEPS = [
  { number: 1, title: 'Data aplikasi', subtitle: 'Nama & deskripsi' },
  { number: 2, title: 'Pilih stack', subtitle: 'Runtime proyek' },
  { number: 3, title: 'Susunan folder', subtitle: 'Panduan & aturan' },
  { number: 4, title: 'Upload & validasi', subtitle: 'Cek arsip .zip' },
  { number: 5, title: 'Environment & deploy', subtitle: 'Konfigurasi & rilis' },
];

export const DEPLOY_PIPELINE_STEPS = [
  {
    key: 'extract',
    label: 'Ekstrak arsip proyek',
    detail: 'Membuka arsip .zip ke direktori rilis terisolasi.',
  },
  {
    key: 'build',
    label: 'Build dependensi',
    detail: 'Menjalankan composer install --no-dev --optimize-autoloader.',
  },
  {
    key: 'migrate',
    label: 'Migrate database',
    detail: 'Menjalankan php artisan migrate --force pada database target.',
  },
  {
    key: 'run',
    label: 'Jalankan aplikasi',
    detail: 'Memuat config:cache, route:cache, dan menyalakan worker PHP-FPM.',
  },
  {
    key: 'url',
    label: 'Daftarkan URL subdomain',
    detail: 'Menghubungkan subdomain publik beserta sertifikat HTTPS.',
  },
  {
    key: 'health',
    label: 'Cek kesehatan HTTP',
    detail: 'Memastikan endpoint utama merespons 200 OK sebelum rilis diaktifkan.',
  },
];

/**
 * Mengubah teks nama aplikasi menjadi slug subdomain yang aman.
 * @param {string} raw
 * @returns {string}
 */
export function slugifyAppName(raw) {
  return String(raw ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Validasi langkah 1: Data aplikasi.
 * @param {{ appName?: string, appDescription?: string }} input
 */
export function validateStepOne({ appName = '', appDescription = '' } = {}) {
  const errors = {
    appName: '',
    appDescription: '',
  };

  const trimmedName = String(appName).trim();
  const slug = slugifyAppName(trimmedName);

  if (!trimmedName) {
    errors.appName = 'Nama aplikasi wajib diisi.';
  } else if (slug.length < 3) {
    errors.appName = 'Nama aplikasi minimal 3 karakter huruf atau angka.';
  } else if (slug.length > 40) {
    errors.appName = 'Nama aplikasi maksimal 40 karakter.';
  }

  const trimmedDesc = String(appDescription).trim();
  if (!trimmedDesc) {
    errors.appDescription = 'Deskripsi singkat wajib diisi agar mudah dikenali di daftar deployment.';
  } else if (trimmedDesc.length < 10) {
    errors.appDescription = 'Deskripsi minimal 10 karakter.';
  }

  return {
    valid: !errors.appName && !errors.appDescription,
    slug,
    errors,
  };
}

/**
 * Mengelompokkan daftar aturan validasi berdasarkan rule_type untuk checklist langkah 3.
 * @param {Array<{ id: string, rule_type: string, value: string | number, severity: string, label: string }>} rules
 */
export function groupValidationRules(rules = []) {
  return {
    requiredFiles: rules.filter((r) => r.rule_type === 'required_file'),
    requiredDirs: rules.filter((r) => r.rule_type === 'required_dir'),
    forbiddenPaths: rules.filter((r) => r.rule_type === 'forbidden_path'),
    maxSizeRule: rules.find((r) => r.rule_type === 'max_size_mb') || null,
  };
}

/**
 * Memformat ringkasan hasil validasi sesuai format "X lulus, Y gagal, Z peringatan".
 * @param {{ passed?: number, failed?: number, warnings?: number } | null | undefined} summary
 */
export function formatValidationSummary(summary) {
  const passed = Number(summary?.passed ?? 0);
  const failed = Number(summary?.failed ?? 0);
  const warnings = Number(summary?.warnings ?? 0);
  return `${passed} lulus, ${failed} gagal, ${warnings} peringatan`;
}

/**
 * Validasi input environment pada langkah 5.
 * @param {Array<{ key: string, required?: boolean }>} envKeys
 * @param {Record<string, string>} envValues
 */
export function validateEnvValues(envKeys = [], envValues = {}) {
  /** @type {Record<string, string>} */
  const errors = {};
  for (const item of envKeys) {
    if (item.required && !String(envValues[item.key] ?? '').trim()) {
      errors[item.key] = `Nilai ${item.key} wajib diisi sebelum deploy.`;
    }
  }
  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

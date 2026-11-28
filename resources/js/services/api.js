/**
 * Mock API service untuk DemoInd.
 * Seluruh fungsi bersifat async dengan jeda singkat agar mudah diganti axios ke backend Laravel.
 */

import {
  bumpMinorVersion,
  formatLogTime,
  formatWibTimestamp,
  getPreviousRollbackTarget,
} from '../utils/deploymentHelpers.js';

const delay = (ms = 240) => new Promise((resolve) => setTimeout(resolve, ms));

export const MOCK_STACKS = [
  {
    id: 1,
    name: 'Laravel',
    slug: 'laravel',
    version: 'PHP 8.3 · Composer 2',
    description: 'Framework PHP untuk aplikasi web, API, dan panel admin dengan struktur folder terstandar.',
    is_active: true,
  },
  {
    id: 2,
    name: 'Node.js (Express)',
    slug: 'nodejs-express',
    version: 'Node 20 LTS',
    description: 'Backend JavaScript/TypeScript ringan untuk REST API dan aplikasi realtime.',
    is_active: false,
  },
  {
    id: 3,
    name: 'Python (FastAPI)',
    slug: 'python-fastapi',
    version: 'Python 3.12',
    description: 'Framework API Python modern berbasis type hints untuk layanan data dan web.',
    is_active: false,
  },
  {
    id: 4,
    name: 'Static HTML / Vite',
    slug: 'static-vite',
    version: 'Build statis',
    description: 'Situs frontend statis dan SPA hasil build Vite atau HTML murni.',
    is_active: false,
  },
];

export const MOCK_FOLDER_GUIDES = [
  {
    step_order: 1,
    path: 'app/',
    type: 'dir',
    description: 'Kode utama aplikasi (Controller, Model, Service).',
    is_required: true,
  },
  {
    step_order: 2,
    path: 'bootstrap/',
    type: 'dir',
    description: 'File inisialisasi framework dan cache autoload Laravel.',
    is_required: true,
  },
  {
    step_order: 3,
    path: 'config/',
    type: 'dir',
    description: 'Berkas konfigurasi aplikasi, database, mail, dan session.',
    is_required: true,
  },
  {
    step_order: 4,
    path: 'database/',
    type: 'dir',
    description: 'Migration dan seeder untuk struktur tabel database.',
    is_required: true,
  },
  {
    step_order: 5,
    path: 'public/',
    type: 'dir',
    description: 'Pintu masuk web, wajib berisi index.php dan aset publik.',
    is_required: true,
  },
  {
    step_order: 6,
    path: 'resources/',
    type: 'dir',
    description: 'View Blade, stylesheet CSS, dan kode sumber frontend.',
    is_required: true,
  },
  {
    step_order: 7,
    path: 'routes/',
    type: 'dir',
    description: 'Daftar URL dan pemetaan endpoint aplikasi (web.php, api.php).',
    is_required: true,
  },
  {
    step_order: 8,
    path: 'storage/',
    type: 'dir',
    description: 'Log aplikasi, cache sementara, dan berkas hasil upload.',
    is_required: true,
  },
  {
    step_order: 9,
    path: 'composer.json',
    type: 'file',
    description: 'Daftar dependensi PHP di folder root proyek.',
    is_required: true,
  },
  {
    step_order: 10,
    path: '.env.example',
    type: 'file',
    description: 'Template nama variabel environment di root tanpa nilai rahasia.',
    is_required: true,
  },
];

export const MOCK_VALIDATION_RULES = [
  { id: 'rf-1', rule_type: 'required_file', value: 'artisan', severity: 'error', label: 'File CLI Laravel (artisan) di root' },
  { id: 'rf-2', rule_type: 'required_file', value: 'composer.json', severity: 'error', label: 'Daftar paket PHP (composer.json) di root' },
  { id: 'rf-3', rule_type: 'required_file', value: '.env.example', severity: 'error', label: 'Template environment (.env.example) di root' },
  { id: 'rf-4', rule_type: 'required_file', value: 'public/index.php', severity: 'error', label: 'Entry point web (public/index.php)' },
  { id: 'rd-1', rule_type: 'required_dir', value: 'app', severity: 'error', label: 'Folder app/' },
  { id: 'rd-2', rule_type: 'required_dir', value: 'bootstrap', severity: 'error', label: 'Folder bootstrap/' },
  { id: 'rd-3', rule_type: 'required_dir', value: 'config', severity: 'error', label: 'Folder config/' },
  { id: 'rd-4', rule_type: 'required_dir', value: 'database', severity: 'error', label: 'Folder database/' },
  { id: 'rd-5', rule_type: 'required_dir', value: 'public', severity: 'error', label: 'Folder public/' },
  { id: 'rd-6', rule_type: 'required_dir', value: 'routes', severity: 'error', label: 'Folder routes/' },
  { id: 'rd-7', rule_type: 'required_dir', value: 'storage', severity: 'error', label: 'Folder storage/' },
  { id: 'fp-1', rule_type: 'forbidden_path', value: '.env', severity: 'error', label: 'File rahasia .env tidak boleh ikut di zip' },
  { id: 'fp-2', rule_type: 'forbidden_path', value: 'vendor/', severity: 'warning', label: 'Folder vendor/ sebaiknya tidak disertakan (di-install otomatis)' },
  { id: 'fp-3', rule_type: 'forbidden_path', value: 'node_modules/', severity: 'warning', label: 'Folder node_modules/ sebaiknya tidak disertakan' },
  { id: 'fp-4', rule_type: 'forbidden_path', value: '.git/', severity: 'warning', label: 'Folder .git/ tidak diperlukan saat deploy' },
  { id: 'ms-1', rule_type: 'max_size_mb', value: 50, severity: 'error', label: 'Ukuran arsip .zip maksimal 50 MB' },
];

export const MOCK_SAMPLE_VALIDATION_FAILED = {
  passed: false,
  summary: {
    passed: 11,
    failed: 1,
    warnings: 2,
  },
  items: [
    {
      rule_type: 'required_file',
      target: 'artisan, composer.json, .env.example, public/index.php',
      status: 'passed',
      message: 'Semua file wajib Laravel ditemukan di posisi yang benar.',
      suggestion: null,
    },
    {
      rule_type: 'required_dir',
      target: 'app/, bootstrap/, config/, database/, public/, routes/, storage/',
      status: 'passed',
      message: 'Seluruh 7 folder wajib tersedia di dalam arsip.',
      suggestion: null,
    },
    {
      rule_type: 'forbidden_path',
      target: '.env',
      status: 'error',
      message: 'File .env ditemukan di dalam arsip zip.',
      suggestion: 'Hapus .env dari zip, sertakan .env.example saja. Nilai rahasia akan diisi pada langkah Environment.',
    },
    {
      rule_type: 'forbidden_path',
      target: 'vendor/',
      status: 'warning',
      message: 'Folder vendor/ ikut terkompres (menambah ukuran arsip).',
      suggestion: 'Hapus vendor/ sebelum mengompres; DemoInd akan menjalankan composer install secara otomatis.',
    },
    {
      rule_type: 'forbidden_path',
      target: '.git/',
      status: 'warning',
      message: 'Folder .git/ terdeteksi di dalam arsip.',
      suggestion: 'Kecualikan folder .git/ agar proses upload lebih cepat dan riwayat repositori tetap aman.',
    },
  ],
};

export const MOCK_ENV_EXAMPLE_KEYS = [
  {
    key: 'APP_NAME',
    required: true,
    defaultValue: '',
    placeholder: 'Contoh: Kasir Warung',
    hint: 'Nama aplikasi yang tampil di judul halaman dan email sistem.',
  },
  {
    key: 'APP_KEY',
    required: true,
    defaultValue: 'base64:dGVtcC1kZW1vaW5kLWtleS0zMi1ieXRlcy1yZWFkeQ==',
    placeholder: 'base64:...',
    hint: 'Kunci enkripsi sesi Laravel (hasil perintah php artisan key:generate).',
  },
  {
    key: 'DB_HOST',
    required: true,
    defaultValue: 'db.internal.demoind.id',
    placeholder: '127.0.0.1 atau host database',
    hint: 'Alamat server database MySQL/PostgreSQL aplikasi Anda.',
  },
  {
    key: 'DB_PORT',
    required: true,
    defaultValue: '3306',
    placeholder: '3306',
    hint: 'Port koneksi database (3306 untuk MySQL, 5432 untuk PostgreSQL).',
  },
  {
    key: 'DB_DATABASE',
    required: true,
    defaultValue: '',
    placeholder: 'Contoh: db_kasir_warung',
    hint: 'Nama skema database yang digunakan saat php artisan migrate.',
  },
  {
    key: 'DB_USERNAME',
    required: true,
    defaultValue: '',
    placeholder: 'Contoh: app_user',
    hint: 'Nama pengguna database yang memiliki hak akses migrasi.',
  },
  {
    key: 'DB_PASSWORD',
    required: true,
    defaultValue: '',
    placeholder: 'Masukkan kata sandi database',
    hint: 'Kata sandi database; disimpan terenkripsi dan tidak ditampilkan ulang.',
  },
  {
    key: 'MAIL_FROM_ADDRESS',
    required: false,
    defaultValue: '',
    placeholder: 'Contoh: no-reply@domain.com',
    hint: 'Opsional. Alamat pengirim jika aplikasi mengirim email notifikasi.',
  },
];

export const MOCK_SAMPLE_VALIDATION_PASSED = {
  passed: true,
  summary: {
    passed: 12,
    failed: 0,
    warnings: 1,
  },
  items: [
    {
      rule_type: 'required_file',
      target: 'artisan, composer.json, .env.example, public/index.php',
      status: 'passed',
      message: 'Semua 4 file wajib Laravel ditemukan di lokasi yang benar.',
      suggestion: null,
    },
    {
      rule_type: 'required_dir',
      target: 'app/, bootstrap/, config/, database/, public/, routes/, storage/',
      status: 'passed',
      message: 'Seluruh 7 folder inti Laravel lengkap di dalam arsip.',
      suggestion: null,
    },
    {
      rule_type: 'forbidden_path',
      target: '.env',
      status: 'passed',
      message: 'Tidak ada file rahasia .env yang ikut terkompres.',
      suggestion: null,
    },
    {
      rule_type: 'max_size_mb',
      target: 'Ukuran arsip <= 50 MB',
      status: 'passed',
      message: 'Ukuran arsip berada di bawah batas maksimal 50 MB.',
      suggestion: null,
    },
    {
      rule_type: 'forbidden_path',
      target: '.git/',
      status: 'warning',
      message: 'Folder .git/ terdeteksi (tidak menghalangi deploy, namun memperbesar arsip).',
      suggestion: 'Lain kali kecualikan folder .git/ saat membuat arsip .zip agar proses unggah lebih cepat.',
    },
  ],
};

export const MOCK_DEPLOYMENTS = [
  {
    id: 101,
    name: 'kasir-warung',
    description: 'Aplikasi pencatatan transaksi harian dan stok warung kelontong.',
    stack: 'Laravel',
    active_version: 'v1.4.0',
    status: 'success',
    url: 'https://kasir-warung.domain.com',
    last_deployed_at: '2026-11-22 19:40 WIB',
    versions: [
      { version: 'v1.4.0', deployed_at: '2026-11-22 19:40 WIB', status: 'success', note: 'Tambah laporan kas mingguan' },
      { version: 'v1.3.2', deployed_at: '2026-11-18 14:12 WIB', status: 'stopped', note: 'Perbaikan perhitungan diskon' },
    ],
    logs: [
      '[19:39:11] Mengekstrak arsip kasir-warung-v1.4.0.zip (4.2 MB)...',
      '[19:39:14] Validasi struktur Laravel: 12 lulus, 0 gagal, 0 peringatan.',
      '[19:39:18] Menjalankan composer install --no-dev --optimize-autoloader...',
      '[19:39:34] Menjalankan php artisan migrate --force (2 tabel diperbarui).',
      '[19:39:37] Menjalankan php artisan config:cache dan route:cache...',
      '[19:39:40] Mendaftarkan subdomain kasir-warung.domain.com...',
      '[19:39:44] Cek kesehatan HTTP GET / -> 200 OK (118 ms).',
      '[19:39:45] Deployment v1.4.0 selesai dan aktif.',
    ],
  },
  {
    id: 102,
    name: 'portal-skripsi',
    description: 'Sistem pengajuan judul dan jadwal bimbingan tugas akhir mahasiswa.',
    stack: 'Laravel',
    active_version: 'v0.9.1',
    status: 'running',
    url: 'https://portal-skripsi.domain.com',
    last_deployed_at: '2026-11-23 00:35 WIB',
    versions: [
      { version: 'v0.9.1', deployed_at: '2026-11-23 00:35 WIB', status: 'running', note: 'Sedang migrasi tabel bimbingan' },
    ],
    logs: [
      '[00:35:02] Mengekstrak arsip portal-skripsi-v0.9.1.zip (6.8 MB)...',
      '[00:35:07] Menjalankan composer install --no-dev...',
      '[00:35:25] Menjalankan php artisan migrate --force...',
    ],
  },
  {
    id: 103,
    name: 'katalog-umkm',
    description: 'Katalog produk batik dan kerajinan lokal dengan formulir pesan.',
    stack: 'Laravel',
    active_version: 'v1.0.0',
    status: 'failed',
    url: 'https://katalog-umkm.domain.com',
    last_deployed_at: '2026-11-21 16:08 WIB',
    versions: [
      { version: 'v1.0.0', deployed_at: '2026-11-21 16:08 WIB', status: 'failed', note: 'Gagal saat migrasi database' },
    ],
    logs: [
      '[16:07:41] Mengekstrak arsip katalog-umkm-v1.0.0.zip (3.1 MB)...',
      '[16:07:56] composer install selesai.',
      '[16:08:02] ERROR: SQLSTATE[HY000] [1045] Access denied for user pada DB_USERNAME.',
      '[16:08:02] Saran: Periksa kembali nilai DB_USERNAME dan DB_PASSWORD pada langkah Environment.',
    ],
  },
  {
    id: 104,
    name: 'absensi-kelas',
    description: 'Pencatat kehadiran praktikum berbasis kode sesi harian.',
    stack: 'Laravel',
    active_version: 'v0.4.0',
    status: 'queued',
    url: 'https://absensi-kelas.domain.com',
    last_deployed_at: '2026-11-23 00:41 WIB',
    versions: [
      { version: 'v0.4.0', deployed_at: '2026-11-23 00:41 WIB', status: 'queued', note: 'Menunggu antrean worker build' },
    ],
    logs: [
      '[00:41:05] Paket absensi-kelas-v0.4.0.zip masuk antrean deployment (#2).',
    ],
  },
  {
    id: 105,
    name: 'booking-klinik',
    description: 'Antrean kunjungan pasien dan jadwal praktik dokter umum.',
    stack: 'Laravel',
    active_version: 'v1.1.0',
    status: 'stopped',
    url: 'https://booking-klinik.domain.com',
    last_deployed_at: '2026-11-15 10:20 WIB',
    versions: [
      { version: 'v1.1.0', deployed_at: '2026-11-15 10:20 WIB', status: 'stopped', note: 'Dihentikan sementara oleh pemilik' },
    ],
    logs: [
      '[10:20:01] Layanan booking-klinik.domain.com dihentikan oleh pengguna.',
    ],
  },
];

const mockUsers = [
  {
    id: 1,
    name: 'Raka Pratama',
    email: 'raka@contoh.id',
    password: 'rahasia123',
    email_verified_at: '2026-11-20T09:15:00Z',
  },
  {
    id: 2,
    name: 'Budi Santoso',
    email: 'budi@contoh.id',
    password: 'rahasia123',
    email_verified_at: null,
  },
];

let nextUserId = 3;

function sanitizeUser(record) {
  return {
    id: record.id,
    name: record.name,
    email: record.email,
    email_verified_at: record.email_verified_at,
  };
}

const deploymentsByUserId = new Map([
  [
    1,
    MOCK_DEPLOYMENTS.map((item) => {
      if (item.id === 103) {
        return {
          ...structuredClone(item),
          versions: [
            ...structuredClone(item.versions),
            {
              version: 'v0.9.4',
              deployed_at: '2026-11-19 11:05 WIB',
              status: 'stopped',
              note: 'Rilis stabil sebelum migrasi tabel promo',
            },
          ],
        };
      }
      if (item.id === 105) {
        return {
          ...structuredClone(item),
          versions: [
            ...structuredClone(item.versions),
            {
              version: 'v1.0.2',
              deployed_at: '2026-11-10 08:45 WIB',
              status: 'stopped',
              note: 'Versi awal antrean poli umum',
            },
          ],
        };
      }
      return structuredClone(item);
    }),
  ],
]);

let nextDeploymentId = 200;

function ensureUserDeployments(userId = 1) {
  if (!deploymentsByUserId.has(userId)) {
    deploymentsByUserId.set(userId, []);
  }
  return deploymentsByUserId.get(userId);
}

export const api = {
  async login({ email, password }) {
    await delay(280);
    const normalizedEmail = String(email ?? '').trim().toLowerCase();
    const record = mockUsers.find((u) => u.email.toLowerCase() === normalizedEmail);

    if (!record || record.password !== password) {
      return {
        ok: false,
        code: 'INVALID_CREDENTIALS',
        message: 'Email atau kata sandi tidak cocok. Periksa kembali data masuk Anda.',
      };
    }

    if (!record.email_verified_at) {
      return {
        ok: false,
        code: 'EMAIL_NOT_VERIFIED',
        email: record.email,
        message: 'Email Anda belum diverifikasi. Cek kotak masuk atau kirim ulang tautan verifikasi.',
      };
    }

    return {
      ok: true,
      user: sanitizeUser(record),
    };
  },

  async register({ name, email, password }) {
    await delay(300);
    const normalizedEmail = String(email ?? '').trim().toLowerCase();
    const exists = mockUsers.some((u) => u.email.toLowerCase() === normalizedEmail);

    if (exists) {
      return {
        ok: false,
        code: 'EMAIL_ALREADY_REGISTERED',
        message: 'Alamat email ini sudah terdaftar. Silakan masuk atau gunakan email lain.',
      };
    }

    const created = {
      id: nextUserId++,
      name: String(name ?? '').trim(),
      email: normalizedEmail,
      password,
      email_verified_at: null,
    };
    mockUsers.push(created);
    deploymentsByUserId.set(created.id, []);

    return {
      ok: true,
      user: sanitizeUser(created),
    };
  },

  async resendVerificationEmail(email) {
    await delay(260);
    const normalizedEmail = String(email ?? '').trim().toLowerCase();
    if (!normalizedEmail) {
      return {
        ok: false,
        message: 'Alamat email tidak ditemukan untuk pengiriman ulang.',
      };
    }

    return {
      ok: true,
      email: normalizedEmail,
      message: `Tautan verifikasi baru telah dikirim ke ${normalizedEmail}.`,
    };
  },

  async verifyEmail(email) {
    await delay(220);
    const normalizedEmail = String(email ?? '').trim().toLowerCase();
    const record = mockUsers.find((u) => u.email.toLowerCase() === normalizedEmail);

    if (!record) {
      return {
        ok: false,
        message: 'Akun dengan alamat email tersebut tidak ditemukan.',
      };
    }

    record.email_verified_at = new Date().toISOString();
    return {
      ok: true,
      user: sanitizeUser(record),
    };
  },

  async getStacks() {
    await delay(180);
    return structuredClone(MOCK_STACKS);
  },

  async getFolderGuides(stackSlug = 'laravel') {
    await delay(180);
    if (stackSlug !== 'laravel') return [];
    return structuredClone(MOCK_FOLDER_GUIDES);
  },

  async getValidationRules(stackSlug = 'laravel') {
    await delay(180);
    if (stackSlug !== 'laravel') return [];
    return structuredClone(MOCK_VALIDATION_RULES);
  },

  async getDeployments(userId = 1) {
    await delay(220);
    return structuredClone(ensureUserDeployments(userId));
  },

  async stopDeployment(id, userId = 1) {
    await delay(240);
    const list = ensureUserDeployments(userId);
    const target = list.find((item) => item.id === id);
    if (!target) {
      return { ok: false, message: 'Aplikasi tidak ditemukan.' };
    }

    const nowTime = formatLogTime();
    target.status = 'stopped';
    target.versions = target.versions.map((ver) =>
      ver.version === target.active_version ? { ...ver, status: 'stopped' } : ver,
    );
    target.logs.push(`[${nowTime}] Layanan ${target.name}.domain.com dihentikan oleh pengguna.`);

    return { ok: true, deployment: structuredClone(target) };
  },

  /**
   * @param {number} id
   * @param {string | null} [targetVersion=null]
   * @param {number} [userId=1]
   */
  async rollbackDeployment(id, targetVersion = null, userId = 1) {
    await delay(280);
    const list = ensureUserDeployments(userId);
    const target = list.find((item) => item.id === id);
    if (!target) {
      return { ok: false, message: 'Aplikasi tidak ditemukan.' };
    }

    const chosen = targetVersion
      ? target.versions.find((v) => v.version === targetVersion)
      : getPreviousRollbackTarget(target);

    if (!chosen) {
      return { ok: false, message: 'Tidak ada versi sebelumnya yang tersedia untuk rollback.' };
    }

    const nowWib = formatWibTimestamp();
    const nowTime = formatLogTime();
    const previousActive = target.active_version;

    target.active_version = chosen.version;
    target.status = 'success';
    target.last_deployed_at = nowWib;
    target.versions = target.versions.map((ver) => ({
      ...ver,
      status: ver.version === chosen.version ? 'success' : ver.status === 'success' ? 'stopped' : ver.status,
    }));
    target.logs.push(
      `[${nowTime}] Memulai rollback ${target.name} dari ${previousActive} ke ${chosen.version}...`,
      `[${nowTime}] Mengaktifkan snapshot ${chosen.version} dan memuat ulang konfigurasi cache.`,
      `[${nowTime}] Cek kesehatan HTTP GET / -> 200 OK. Versi ${chosen.version} kini aktif.`,
    );

    return { ok: true, deployment: structuredClone(target) };
  },

  async uploadNewVersion(id, { fileName, note = '' }, userId = 1) {
    await delay(320);
    const list = ensureUserDeployments(userId);
    const target = list.find((item) => item.id === id);
    if (!target) {
      return { ok: false, message: 'Aplikasi tidak ditemukan.' };
    }

    const nextVersion = bumpMinorVersion(target.active_version);
    const nowWib = formatWibTimestamp();
    const nowTime = formatLogTime();
    const cleanNote = String(note ?? '').trim() || `Pembaruan dari arsip ${fileName}`;

    target.versions = [
      {
        version: nextVersion,
        deployed_at: nowWib,
        status: 'success',
        note: cleanNote,
      },
      ...target.versions.map((ver) =>
        ver.status === 'success' ? { ...ver, status: 'stopped' } : ver,
      ),
    ];
    target.active_version = nextVersion;
    target.status = 'success';
    target.last_deployed_at = nowWib;
    target.logs.push(
      `[${nowTime}] Mengekstrak arsip baru ${fileName} untuk rilis ${nextVersion}...`,
      `[${nowTime}] Validasi struktur Laravel lulus (0 gagal).`,
      `[${nowTime}] Menjalankan composer install --no-dev dan php artisan migrate --force...`,
      `[${nowTime}] Cek kesehatan HTTP GET / -> 200 OK. Versi ${nextVersion} aktif di ${target.name}.domain.com.`,
    );

    return { ok: true, deployment: structuredClone(target) };
  },

  async createDeployment({ name, description, stack = 'Laravel', fileName = 'proyek.zip' }, userId = 1) {
    await delay(260);
    const list = ensureUserDeployments(userId);
    const cleanSlug = String(name ?? 'aplikasi-baru')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'aplikasi-baru';
    const nowWib = formatWibTimestamp();
    const nowTime = formatLogTime();

    const created = {
      id: nextDeploymentId++,
      name: cleanSlug,
      description: String(description ?? '').trim() || 'Aplikasi Laravel yang di-deploy melalui DemoInd.',
      stack,
      active_version: 'v1.0.0',
      status: 'success',
      url: `https://${cleanSlug}.domain.com`,
      last_deployed_at: nowWib,
      versions: [
        {
          version: 'v1.0.0',
          deployed_at: nowWib,
          status: 'success',
          note: `Rilis awal dari ${fileName}`,
        },
      ],
      logs: [
        `[${nowTime}] Mengekstrak arsip ${fileName}...`,
        `[${nowTime}] Menjalankan composer install --no-dev --optimize-autoloader...`,
        `[${nowTime}] Menjalankan php artisan migrate --force...`,
        `[${nowTime}] Mendaftarkan subdomain ${cleanSlug}.domain.com...`,
        `[${nowTime}] Cek kesehatan HTTP GET / -> 200 OK. Deployment v1.0.0 aktif.`,
      ],
    };

    list.unshift(created);
    return { ok: true, deployment: structuredClone(created) };
  },

  async getSampleFailedValidation() {
    await delay(220);
    return structuredClone(MOCK_SAMPLE_VALIDATION_FAILED);
  },

  async getEnvExampleKeys(stackSlug = 'laravel') {
    await delay(160);
    if (stackSlug !== 'laravel') return [];
    return structuredClone(MOCK_ENV_EXAMPLE_KEYS);
  },

  /**
   * Memvalidasi arsip .zip proyek Laravel (mode mock).
   * @param {string} fileName
   * @param {{ forceMode?: 'auto' | 'pass' | 'fail', appName?: string }} [options]
   */
  async validateSubmissionArchive(fileName = 'proyek.zip', { forceMode = 'auto', appName = '' } = {}) {
    await delay(320);
    const normalized = String(fileName ?? '').toLowerCase();
    const shouldFail =
      forceMode === 'fail' ||
      (forceMode === 'auto' && (normalized.includes('gagal') || normalized.includes('error') || normalized.includes('env-boc')));

    if (shouldFail) {
      return {
        ...structuredClone(MOCK_SAMPLE_VALIDATION_FAILED),
        fileName,
        envKeys: [],
      };
    }

    const keys = structuredClone(MOCK_ENV_EXAMPLE_KEYS).map((entry) => {
      if (entry.key === 'APP_NAME' && appName) {
        return { ...entry, defaultValue: appName };
      }
      return entry;
    });

    return {
      ...structuredClone(MOCK_SAMPLE_VALIDATION_PASSED),
      fileName,
      envKeys: keys,
    };
  },
};

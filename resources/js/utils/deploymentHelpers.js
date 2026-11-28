export const DEPLOYMENT_STATUS_META = {
  queued: {
    label: 'queued',
    variant: 'warning',
    description: 'Menunggu antrean worker build.',
  },
  running: {
    label: 'running',
    variant: 'info',
    description: 'Sedang membangun dan menjalankan aplikasi.',
  },
  success: {
    label: 'success',
    variant: 'success',
    description: 'Aplikasi aktif dan merespons cek kesehatan.',
  },
  failed: {
    label: 'failed',
    variant: 'error',
    description: 'Deployment gagal. Periksa log untuk langkah perbaikan.',
  },
  stopped: {
    label: 'stopped',
    variant: 'neutral',
    description: 'Layanan dihentikan sementara.',
  },
};

export const DEPLOYMENT_STATUS_ORDER = ['all', 'success', 'running', 'queued', 'failed', 'stopped'];

export function getStatusMeta(status) {
  return DEPLOYMENT_STATUS_META[status] || DEPLOYMENT_STATUS_META.stopped;
}

/**
 * Menyaring daftar deployment berdasarkan kata kunci dan status.
 * @param {Array} items
 * @param {{ query?: string, status?: string }} filters
 */
export function filterDeployments(items, { query = '', status = 'all' } = {}) {
  const normalizedQuery = String(query ?? '').trim().toLowerCase();
  const normalizedStatus = String(status ?? 'all').toLowerCase();

  return (items || []).filter((item) => {
    const matchesStatus = normalizedStatus === 'all' || item.status === normalizedStatus;
    if (!matchesStatus) return false;

    if (!normalizedQuery) return true;

    const haystack = [
      item.name,
      item.description,
      item.stack,
      item.active_version,
      item.url,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });
}

/**
 * Menaikkan nomor versi minor untuk rilis baru (contoh: v1.4.0 -> v1.5.0).
 * @param {string} currentVersion
 * @returns {string}
 */
export function bumpMinorVersion(currentVersion) {
  const match = /^v?(\d+)\.(\d+)\.(\d+)$/.exec(String(currentVersion ?? '').trim());
  if (!match) return 'v1.0.1';
  const major = Number(match[1]);
  const minor = Number(match[2]) + 1;
  return `v${major}.${minor}.0`;
}

/**
 * Mengambil versi sebelumnya yang tersedia untuk rollback.
 * @param {{ active_version?: string, versions?: Array<{ version: string }> } | null | undefined} deployment
 */
export function getPreviousRollbackTarget(deployment) {
  if (!deployment || !Array.isArray(deployment.versions) || deployment.versions.length < 2) {
    return null;
  }
  return deployment.versions.find((ver) => ver.version !== deployment.active_version) || null;
}

/**
 * Apakah aplikasi dalam status yang bisa dihentikan.
 * @param {string} status
 */
export function canStopDeployment(status) {
  return status === 'success' || status === 'running' || status === 'queued';
}

/**
 * Memformat waktu lokal menjadi format ringkas WIB (YYYY-MM-DD HH:mm WIB).
 * @param {Date} [date=new Date()]
 */
export function formatWibTimestamp(date = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  const y = date.getFullYear();
  const m = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  const hh = pad(date.getHours());
  const mm = pad(date.getMinutes());
  return `${y}-${m}-${d} ${hh}:${mm} WIB`;
}

export function formatLogTime(date = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

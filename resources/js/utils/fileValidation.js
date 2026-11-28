export const MAX_ZIP_SIZE_MB = 50;
export const MAX_ZIP_SIZE_BYTES = MAX_ZIP_SIZE_MB * 1024 * 1024;

/**
 * Memformat ukuran byte menjadi string ramah baca (KB / MB).
 * @param {number} bytes
 * @returns {string}
 */
export function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes < 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Memvalidasi file arsip proyek sebelum diunggah ke DemoInd.
 * @param {{ name?: string, size?: number } | null | undefined} file
 * @param {number} [maxSizeMb=50]
 * @returns {{ valid: boolean, error: string | null }}
 */
export function validateZipFile(file, maxSizeMb = MAX_ZIP_SIZE_MB) {
  if (!file || !file.name) {
    return {
      valid: false,
      error: 'Pilih satu file proyek berformat .zip terlebih dahulu.',
    };
  }

  const normalizedName = file.name.trim().toLowerCase();
  if (!normalizedName.endsWith('.zip')) {
    return {
      valid: false,
      error: 'Format file tidak didukung. Unggah arsip proyek berekstensi .zip.',
    };
  }

  if (typeof file.size !== 'number' || file.size <= 0) {
    return {
      valid: false,
      error: 'File .zip kosong (0 byte). Pastikan folder proyek sudah dikompres dengan benar.',
    };
  }

  const maxBytes = maxSizeMb * 1024 * 1024;
  if (file.size > maxBytes) {
    return {
      valid: false,
      error: `Ukuran file ${formatBytes(file.size)} melebihi batas maksimal ${maxSizeMb} MB. Hapus folder vendor/ atau node_modules/ sebelum mengompres.`,
    };
  }

  return { valid: true, error: null };
}

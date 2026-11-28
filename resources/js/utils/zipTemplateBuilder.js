/**
 * Pembentuk file .zip standar (Store / uncompressed, RFC PKZIP) tanpa dependensi eksternal
 * untuk tombol "Unduh template folder (zip)" pada langkah Susunan Folder.
 */

import { slugifyAppName } from './submissionHelpers.js';

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i += 1) {
    let c = i;
    for (let k = 0; k < 8; k += 1) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c >>> 0;
  }
  return table;
})();

function crc32(bytes) {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i += 1) {
    crc = CRC_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function concatUint8Arrays(chunks) {
  const total = chunks.reduce((sum, arr) => sum + arr.length, 0);
  const result = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  return result;
}

/**
 * Membangun arsip ZIP valid dari daftar entri { path, content }.
 * @param {Array<{ path: string, content?: string }>} entries
 * @returns {Uint8Array}
 */
export function buildZipArchive(entries) {
  const encoder = new TextEncoder();
  const localParts = [];
  const centralParts = [];
  let offset = 0;

  for (const entry of entries) {
    const nameBytes = encoder.encode(entry.path);
    const dataBytes = entry.path.endsWith('/') ? new Uint8Array(0) : encoder.encode(entry.content ?? '');
    const checksum = crc32(dataBytes);
    const isDir = entry.path.endsWith('/');

    const localHeader = new Uint8Array(30 + nameBytes.length);
    const lv = new DataView(localHeader.buffer);
    lv.setUint32(0, 0x04034b50, true); // Local file header signature
    lv.setUint16(4, 20, true); // Version needed
    lv.setUint16(6, 0x0800, true); // UTF-8 filename flag
    lv.setUint16(8, 0, true); // Compression method 0 (Store)
    lv.setUint16(10, 0, true); // Mod time
    lv.setUint16(12, 0x5977, true); // Mod date
    lv.setUint32(14, checksum, true);
    lv.setUint32(18, dataBytes.length, true);
    lv.setUint32(22, dataBytes.length, true);
    lv.setUint16(26, nameBytes.length, true);
    lv.setUint16(28, 0, true);
    localHeader.set(nameBytes, 30);

    localParts.push(localHeader, dataBytes);

    const centralHeader = new Uint8Array(46 + nameBytes.length);
    const cv = new DataView(centralHeader.buffer);
    cv.setUint32(0, 0x02014b50, true); // Central directory signature
    cv.setUint16(4, 20, true); // Version made by
    cv.setUint16(6, 20, true); // Version needed
    cv.setUint16(8, 0x0800, true); // UTF-8 flag
    cv.setUint16(10, 0, true); // Compression method 0
    cv.setUint16(12, 0, true);
    cv.setUint16(14, 0x5977, true);
    cv.setUint32(16, checksum, true);
    cv.setUint32(20, dataBytes.length, true);
    cv.setUint32(24, dataBytes.length, true);
    cv.setUint16(28, nameBytes.length, true);
    cv.setUint16(30, 0, true);
    cv.setUint16(32, 0, true);
    cv.setUint16(34, 0, true);
    cv.setUint16(36, 0, true);
    cv.setUint32(38, isDir ? 0x10 : 0, true);
    cv.setUint32(42, offset, true);
    centralHeader.set(nameBytes, 46);

    centralParts.push(centralHeader);
    offset += localHeader.length + dataBytes.length;
  }

  const centralSize = centralParts.reduce((sum, arr) => sum + arr.length, 0);
  const eocd = new Uint8Array(22);
  const ev = new DataView(eocd.buffer);
  ev.setUint32(0, 0x06054b50, true); // End of central directory signature
  ev.setUint16(4, 0, true);
  ev.setUint16(6, 0, true);
  ev.setUint16(8, entries.length, true);
  ev.setUint16(10, entries.length, true);
  ev.setUint32(12, centralSize, true);
  ev.setUint32(16, offset, true);
  ev.setUint16(20, 0, true);

  return concatUint8Arrays([...localParts, ...centralParts, eocd]);
}

/**
 * Menghasilkan template struktur folder Laravel siap pakai dalam format .zip.
 * @param {string} [appName='proyek-laravel']
 * @returns {{ fileName: string, bytes: Uint8Array }}
 */
export function buildLaravelTemplateZip(appName = 'proyek-laravel') {
  const slug = slugifyAppName(appName) || 'proyek-laravel';
  const root = `${slug}/`;

  const entries = [
    { path: `${root}app/` },
    { path: `${root}app/.gitkeep`, content: '' },
    { path: `${root}bootstrap/` },
    { path: `${root}bootstrap/app.php`, content: "<?php\n// Inisialisasi aplikasi Laravel Anda di sini.\n" },
    { path: `${root}config/` },
    { path: `${root}config/app.php`, content: "<?php\nreturn ['name' => env('APP_NAME', 'DemoInd App')];\n" },
    { path: `${root}database/` },
    { path: `${root}database/migrations/.gitkeep`, content: '' },
    { path: `${root}public/` },
    { path: `${root}public/index.php`, content: "<?php\n// Entry point publik Laravel.\n" },
    { path: `${root}resources/` },
    { path: `${root}resources/views/.gitkeep`, content: '' },
    { path: `${root}routes/` },
    { path: `${root}routes/web.php`, content: "<?php\n// Daftarkan rute web aplikasi Anda di sini.\n" },
    { path: `${root}storage/` },
    { path: `${root}storage/logs/.gitkeep`, content: '' },
    { path: `${root}artisan`, content: "#!/usr/bin/env php\n<?php\n// CLI artisan Laravel.\n" },
    {
      path: `${root}composer.json`,
      content: JSON.stringify(
        {
          name: `demoind/${slug}`,
          type: 'project',
          require: { php: '^8.3', 'laravel/framework': '^11.0' },
        },
        null,
        2,
      ),
    },
    {
      path: `${root}.env.example`,
      content: [
        `APP_NAME="${slug}"`,
        'APP_KEY=',
        `APP_URL=https://${slug}.domain.com`,
        'DB_HOST=127.0.0.1',
        'DB_PORT=3306',
        `DB_DATABASE=${slug.replace(/-/g, '_')}`,
        'DB_USERNAME=',
        'DB_PASSWORD=',
      ].join('\n'),
    },
    {
      path: `${root}README-DEMOIN.txt`,
      content: [
        'Template Struktur Folder Laravel — DemoInd',
        '-----------------------------------------',
        '1. Salin kode aplikasi Laravel Anda ke dalam folder yang sesuai.',
        '2. Jangan sertakan file .env maupun folder vendor/, node_modules/, dan .git/.',
        '3. Kompres folder ini menjadi .zip (maksimal 50 MB) lalu unggah pada langkah 4.',
      ].join('\n'),
    },
  ];

  return {
    fileName: `template-laravel-${slug}.zip`,
    bytes: buildZipArchive(entries),
  };
}

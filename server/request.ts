export const MAX_BODY_BYTES = 4 * 1024 * 1024;
export const MAX_EVIDENCE_CHARS = 8_000;
const MAX_IMAGE_BASE64_CHARS = 3_800_000;
const MAX_IMAGE_DIMENSION = 1_600;

type RequestResult =
  | { ok: true; evidence: string; image?: string }
  | { ok: false; status: 400 | 413; error: "invalid_request" | "too_large" };

// Checks a prepared JPEG's marker structure, frame dimensions, scan and end
// marker. This is a bounded structural check, not an image decoder.
export function isPreparedJpeg(bytes: Uint8Array): boolean {
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) return false;
  let at = 2, frame = false, scan = false, data = false, inScan = false;
  let quantization = false, huffman = false;
  const componentIds = new Set<number>();
  while (at < bytes.length) {
    if (inScan) {
      if (bytes[at++] !== 0xff) { data = true; continue; }
      const markerAt = at - 1;
      while (bytes[at] === 0xff) at++;
      if (at >= bytes.length) return false;
      const marker = bytes[at++];
      if (marker === 0x00) { data = true; continue; } // Escaped entropy byte.
      if (marker >= 0xd0 && marker <= 0xd7) continue; // Restart marker.
      at = markerAt;
      inScan = false;
      continue;
    }
    if (bytes[at++] !== 0xff) return false;
    while (bytes[at] === 0xff) at++;
    if (at >= bytes.length) return false;
    const marker = bytes[at++];
    if (marker === 0xd9) return frame && scan && data && at === bytes.length;
    if (marker === 0x00 || marker === 0xd8 || (marker >= 0xd0 && marker <= 0xd7)) return false;
    if (marker === 0x01) continue;
    if (at + 2 > bytes.length) return false;
    const length = bytes[at] * 256 + bytes[at + 1];
    if (length < 2 || at + length > bytes.length) return false;
    const start = at + 2, end = at + length;
    if (marker === 0xdb) {
      let table = start;
      while (table < end) {
        const info = bytes[table++], precision = info >> 4;
        if (precision > 1 || (info & 15) > 3) return false;
        table += precision === 0 ? 64 : 128;
      }
      if (table !== end || start === end) return false;
      quantization = true;
    } else if (marker === 0xc4) {
      let table = start;
      while (table < end) {
        if (table + 17 > end) return false;
        const info = bytes[table++];
        if ((info >> 4) > 1 || (info & 15) > 3) return false;
        let symbols = 0;
        for (let i = 0; i < 16; i++) symbols += bytes[table++];
        if (!symbols || symbols > 256) return false;
        table += symbols;
      }
      if (table !== end || start === end) return false;
      huffman = true;
    } else if (marker === 0xc0 || marker === 0xc1 || marker === 0xc2) {
      if (frame || length < 8) return false;
      const height = bytes[start + 1] * 256 + bytes[start + 2];
      const width = bytes[start + 3] * 256 + bytes[start + 4];
      const components = bytes[start + 5];
      if (bytes[start] !== 8 || !width || !height || width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION ||
          (components !== 1 && components !== 3) || length !== 8 + 3 * components) return false;
      for (let i = 0; i < components; i++) componentIds.add(bytes[start + 6 + i * 3]);
      if (componentIds.size !== components) return false;
      frame = true;
    } else if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc8 && marker !== 0xcc) {
      return false; // Other frame encodings are not produced by browser canvases.
    } else if (marker === 0xda) {
      const components = bytes[start];
      if (!frame || !quantization || !huffman || !components || components > componentIds.size || length !== 6 + 2 * components) return false;
      for (let i = 0; i < components; i++) if (!componentIds.has(bytes[start + 1 + i * 2])) return false;
      scan = true;
      inScan = true;
    }
    at = end;
  }
  return false;
}

// The middleware and its boundary tests share these exact payload rules.
export function validateExtractRequest(body: unknown): RequestResult {
  const invalid = { ok: false, status: 400, error: "invalid_request" } as const;
  const tooLarge = { ok: false, status: 413, error: "too_large" } as const;
  if (!body || typeof body !== "object" || Array.isArray(body)) return invalid;
  const { evidence = "", image } = body as { evidence?: unknown; image?: unknown };
  if (typeof evidence !== "string" || (image !== undefined && typeof image !== "string")) return invalid;
  if (evidence.length > MAX_EVIDENCE_CHARS) return tooLarge;
  if (typeof image === "string") {
    if (image.length > MAX_IMAGE_BASE64_CHARS) return tooLarge;
    if (!image.length || image.length % 4 !== 0 || !/^[A-Za-z0-9+/]+={0,2}$/.test(image)) return invalid;
    if (!isPreparedJpeg(Buffer.from(image, "base64"))) return invalid;
  }
  return { ok: true, evidence, image };
}

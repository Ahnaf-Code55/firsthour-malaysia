export type ImageResult = { ok: true; base64: string } | { ok: false; reason: "type" | "size" | "unreadable" };

const MAX_BYTES = 5 * 1024 * 1024;
const MAX_DIMENSION = 1_600;
const MAX_PIXELS = 40_000_000; // decoding allocates about 4 bytes per pixel, so cap it before decoding

// Reads width and height from the PNG or JPEG header without decoding the image.
function dimensions(b: Uint8Array): { w: number; h: number } | null {
  const v = new DataView(b.buffer, b.byteOffset, b.byteLength);
  if (b.length > 24 && b[0] === 0x89 && b[1] === 0x50) return { w: v.getUint32(16), h: v.getUint32(20) };
  if (b[0] === 0xff && b[1] === 0xd8) {
    for (let i = 2; i + 9 < b.length; ) {
      if (b[i] !== 0xff) { i++; continue; }
      const m = b[i + 1];
      if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) return { h: v.getUint16(i + 5), w: v.getUint16(i + 7) };
      i += 2 + v.getUint16(i + 2);
    }
  }
  return null;
}

function toBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("image read failed"));
    reader.onload = () => {
      if (typeof reader.result !== "string") return reject(new Error("image read failed"));
      const comma = reader.result.indexOf(",");
      if (comma < 0) return reject(new Error("image encoding failed"));
      resolve(reader.result.slice(comma + 1));
    };
    reader.readAsDataURL(blob);
  });
}

export async function prepareImage(file: File): Promise<ImageResult> {
  if (file.type !== "image/png" && file.type !== "image/jpeg") return { ok: false, reason: "type" };
  if (file.size > MAX_BYTES) return { ok: false, reason: "size" };
  if (typeof createImageBitmap !== "function") return { ok: false, reason: "unreadable" };

  let bitmap: ImageBitmap | undefined;
  try {
    const dim = dimensions(new Uint8Array(await file.arrayBuffer()));
    if (!dim || !dim.w || !dim.h) return { ok: false, reason: "unreadable" };
    if (dim.w * dim.h > MAX_PIXELS) return { ok: false, reason: "size" };
    bitmap = await createImageBitmap(file);
    if (!bitmap.width || !bitmap.height) return { ok: false, reason: "unreadable" };
    const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    let jpeg: Blob;

    if (typeof OffscreenCanvas !== "undefined") {
      const canvas = new OffscreenCanvas(width, height);
      const context = canvas.getContext("2d");
      if (!context) return { ok: false, reason: "unreadable" };
      context.fillStyle = "#fff"; context.fillRect(0, 0, width, height); // JPEG has no transparency
      context.drawImage(bitmap, 0, 0, width, height);
      jpeg = await canvas.convertToBlob({ type: "image/jpeg", quality: 0.86 });
    } else if (typeof document !== "undefined") {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      if (!context) return { ok: false, reason: "unreadable" };
      context.fillStyle = "#fff"; context.fillRect(0, 0, width, height);
      context.drawImage(bitmap, 0, 0, width, height);
      jpeg = await new Promise((resolve, reject) => canvas.toBlob(
        (blob) => blob ? resolve(blob) : reject(new Error("image encoding failed")),
        "image/jpeg",
        0.86,
      ));
    } else {
      return { ok: false, reason: "unreadable" };
    }

    const base64 = await toBase64(jpeg);
    return base64 ? { ok: true, base64 } : { ok: false, reason: "unreadable" };
  } catch {
    return { ok: false, reason: "unreadable" };
  } finally {
    bitmap?.close();
  }
}

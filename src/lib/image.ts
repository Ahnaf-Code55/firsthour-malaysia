export type ImageResult = { ok: true; base64: string } | { ok: false; reason: "type" | "size" | "unreadable" };

const MAX_BYTES = 5 * 1024 * 1024;
const MAX_DIMENSION = 1_600;

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
      context.drawImage(bitmap, 0, 0, width, height);
      jpeg = await canvas.convertToBlob({ type: "image/jpeg", quality: 0.86 });
    } else if (typeof document !== "undefined") {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      if (!context) return { ok: false, reason: "unreadable" };
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

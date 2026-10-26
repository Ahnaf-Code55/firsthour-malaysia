// Owner: Turjo (see handoff/turjo.md). Stub so the screens compile; the real version re-encodes the image
// on a canvas (strips EXIF), limits type and size, and keeps everything in memory.
export type ImageResult = { ok: true; base64: string } | { ok: false; reason: "type" | "size" | "unreadable" };

export async function prepareImage(_file: File): Promise<ImageResult> {
  return { ok: false, reason: "unreadable" };
}

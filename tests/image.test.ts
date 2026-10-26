import { describe, expect, it } from "vitest";
import { prepareImage } from "../src/lib/image";

describe("prepareImage input checks", () => {
  it("rejects unsupported MIME types before attempting to decode", async () => {
    const file = new File(["not an image"], "evidence.svg", { type: "image/svg+xml" });
    await expect(prepareImage(file)).resolves.toEqual({ ok: false, reason: "type" });
  });

  it("rejects files larger than five mebibytes before attempting to decode", async () => {
    const file = new File([new Uint8Array(5 * 1024 * 1024 + 1)], "evidence.png", { type: "image/png" });
    await expect(prepareImage(file)).resolves.toEqual({ ok: false, reason: "size" });
  });
});

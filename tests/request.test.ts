import { describe, expect, it } from "vitest";
import { MAX_EVIDENCE_CHARS, isPreparedJpeg, validateExtractRequest } from "../server/request";

// Actual 2x2 JPEGs encoded locally from a white RGB image, with no private data.
const jpeg = "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAACAAIDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAj/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AKpAB//Z";
const progressive = "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wgARCAACAAIDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAf/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIQAxAAAAGqA//EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAQUCf//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQMBAT8Bf//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQIBAT8Bf//EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEABj8Cf//EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAT8hf//aAAwDAQACAAMAAAAQ8//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQMBAT8Qf//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQIBAT8Qf//EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAT8Qf//Z";

describe("the request validation used by /api/extract", () => {
  it("accepts exactly 8,000 evidence code units and rejects 8,001", () => {
    expect(MAX_EVIDENCE_CHARS).toBe(8_000);
    expect(validateExtractRequest({ evidence: "x".repeat(8_000) }).ok).toBe(true);
    expect(validateExtractRequest({ evidence: "x".repeat(8_001) })).toEqual({ ok: false, status: 413, error: "too_large" });
    expect(validateExtractRequest({ evidence: "x".repeat(9_000) }).ok).toBe(false);
  });
  it("rejects malformed payload shapes and image encodings", () => {
    for (const body of [null, [], { evidence: 1 }, { image: 1 }, { image: "" }, { image: "not-base64" }, { image: "/9j/" }, { image: "AA=A" }, { image: "A===" }]) {
      expect(validateExtractRequest(body)).toEqual({ ok: false, status: 400, error: "invalid_request" });
    }
  });
  it("bounds the encoded image and safely rejects a large non-image payload", () => {
    expect(validateExtractRequest({ image: "A".repeat(3_800_004) })).toEqual({ ok: false, status: 413, error: "too_large" });
    expect(validateExtractRequest({ image: "A".repeat(3_800_000) })).toEqual({ ok: false, status: 400, error: "invalid_request" });
  });
  it.each([jpeg, progressive])("accepts a complete baseline or progressive prepared JPEG", (image) => {
    expect(validateExtractRequest({ evidence: "", image })).toEqual({ ok: true, evidence: "", image });
  });
  it("rejects truncated JPEGs and a forged prefix/end-marker pair", () => {
    const bytes = Buffer.from(jpeg, "base64");
    expect(isPreparedJpeg(bytes.subarray(0, bytes.length - 2))).toBe(false);
    expect(isPreparedJpeg(Uint8Array.from([0xff, 0xd8, 0xff, 0xd9]))).toBe(false);
    const malformed = Buffer.from(bytes);
    malformed[4] = 0xff; malformed[5] = 0xff; // APP0 length runs beyond the file.
    expect(isPreparedJpeg(malformed)).toBe(false);
  });
  it("rejects a JPEG frame over the prepared image dimension limit", () => {
    const bytes = Buffer.from(jpeg, "base64");
    const frame = bytes.indexOf(Buffer.from([0xff, 0xc0]));
    expect(frame).toBeGreaterThan(0);
    bytes[frame + 7] = 0x06; bytes[frame + 8] = 0x41; // Width 1601.
    expect(isPreparedJpeg(bytes)).toBe(false);
  });
});

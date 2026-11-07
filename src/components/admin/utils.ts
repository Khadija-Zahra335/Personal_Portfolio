export type Path = (string | number)[];

/** Immutable set at a nested path */
export function setIn(obj: unknown, path: Path, value: unknown): unknown {
  if (path.length === 0) return value;
  const [head, ...rest] = path;
  if (Array.isArray(obj)) {
    const copy = [...obj];
    copy[head as number] = setIn(copy[head as number], rest, value);
    return copy;
  }
  const o = (obj ?? {}) as Record<string, unknown>;
  return { ...o, [head]: setIn(o[head as string], rest, value) };
}

/** Empty copy with the same shape (used for "Add item") */
export function blankLike(v: unknown): unknown {
  if (typeof v === "string") return "";
  if (typeof v === "number") return 0;
  if (typeof v === "boolean") return false;
  if (Array.isArray(v)) return v.length && typeof v[0] !== "object" ? v.map(blankLike) : [];
  if (v && typeof v === "object") {
    return Object.fromEntries(Object.entries(v).map(([k, val]) => [k, blankLike(val)]));
  }
  return null;
}

export function humanize(key: string): string {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .replace(/^./, (c) => c.toUpperCase());
}

/** Resize + compress an image file to a WebP data URL under maxBytes */
export async function compressImage(file: File, maxWidth = 1200, maxBytes = 160_000): Promise<string> {
  const bitmap = await createImageBitmap(file);
  let scale = Math.min(1, maxWidth / bitmap.width);
  let quality = 0.85;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  for (let i = 0; i < 8; i++) {
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const url = canvas.toDataURL("image/webp", quality);
    if (url.length * 0.75 <= maxBytes || i === 7) return url;
    quality -= 0.1;
    if (quality < 0.5) {
      quality = 0.75;
      scale *= 0.8;
    }
  }
  return canvas.toDataURL("image/webp", 0.6);
}
/** UTF-8 Blob 다운로드 — BOM 없음 [G1][Plan 3-5] */
export function downloadTextFile(
  content: string,
  filename: string,
  mimeType: string,
): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export const MIME_MARKDOWN = "text/markdown;charset=utf-8";
export const MIME_PLAIN = "text/plain;charset=utf-8";

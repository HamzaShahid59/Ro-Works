/**
 * Rules for files attached to the quote form.
 * Used by both the form (instant feedback) and the server (final check).
 */

/** Maximum number of files per request. */
export const MAX_FILES = 10;

/**
 * Maximum total size of all files, in MB.
 * Keep 4 if you host on Vercel (it rejects requests above 4.5 MB).
 * On your own server you can raise this to 18 (Gmail's limit is 25 MB including encoding).
 */
export const MAX_TOTAL_MB = 4;
export const MAX_TOTAL_BYTES = MAX_TOTAL_MB * 1024 * 1024;

/** File types Gmail refuses to send. Blocking them early gives the visitor a clear message. */
export const BLOCKED_EXTENSIONS = [
  "ade", "adp", "apk", "appx", "appxbundle", "bat", "cab", "chm", "cmd", "com", "cpl",
  "diagcab", "diagcfg", "diagpack", "dll", "dmg", "ex", "ex_", "exe", "hta", "img", "ins",
  "iso", "isp", "jar", "jnlp", "js", "jse", "lib", "lnk", "mde", "msc", "msi", "msix",
  "msixbundle", "msp", "mst", "nsh", "pif", "ps1", "scr", "sct", "shb", "sys", "vb", "vbe",
  "vbs", "vhd", "vxd", "wsc", "wsf", "wsh", "xll",
];

export function isBlockedFile(fileName: string): boolean {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  return fileName.includes(".") && BLOCKED_EXTENSIONS.includes(ext);
}

export function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

"use client";

import { useId, useRef, useState, type ChangeEvent, type DragEvent, type FormEvent } from "react";
import type { Locale } from "@/i18n/config";
import { formatSize, isBlockedFile, MAX_FILES, MAX_TOTAL_BYTES, MAX_TOTAL_MB } from "@/content/attachments";

type FormText = {
  name: string;
  phone: string;
  email: string;
  projectType: string;
  projectTypeHint: string;
  other: string;
  message: string;
  messagePlaceholder: string;
  attachments: string;
  attachmentsHint: string;
  chooseFiles: string;
  noFileChosen: string;
  filesSelected: string;
  removeFile: string;
  tooManyFiles: string;
  filesTooLarge: string;
  fileTypeBlocked: string;
  submit: string;
  sending: string;
  success: string;
  error: string;
  required: string;
};

type Props = {
  locale: Locale;
  text: FormText;
  services: { key: string; title: string }[];
};

type Status = "idle" | "sending" | "success" | "error" | "invalid";

const fill = (s: string, values: Record<string, string | number>) =>
  s.replace(/\{(\w+)\}/g, (_, k) => String(values[k] ?? `{${k}}`));

export default function QuoteForm({ locale, text, services }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hintId = useId();

  const totalSize = files.reduce((sum, f) => sum + f.size, 0);

  function onPickFiles(e: ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    e.target.value = ""; // allows picking the same file again after removing it
    addFiles(picked);
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    addFiles(Array.from(e.dataTransfer.files ?? []));
  }

  /** Adds newly picked or dropped files to the list and checks the limits. */
  function addFiles(picked: File[]) {
    if (picked.length === 0) return;

    const blocked = picked.find((f) => isBlockedFile(f.name));
    if (blocked) {
      setFileError(fill(text.fileTypeBlocked, { name: blocked.name }));
      return;
    }

    // Skip files that are already in the list
    const next = [...files];
    for (const f of picked) {
      if (!next.some((x) => x.name === f.name && x.size === f.size)) next.push(f);
    }

    if (next.length > MAX_FILES) {
      setFileError(fill(text.tooManyFiles, { count: MAX_FILES }));
      return;
    }
    if (next.reduce((s, f) => s + f.size, 0) > MAX_TOTAL_BYTES) {
      setFileError(fill(text.filesTooLarge, { max: MAX_TOTAL_MB }));
      return;
    }

    setFileError(null);
    setFiles(next);
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setFileError(null);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    if (!name || !phone) {
      setStatus("invalid");
      return;
    }

    // Send the files from our list (not from the input, which is emptied after each pick)
    data.delete("attachments");
    files.forEach((f) => data.append("attachments", f, f.name));
    data.set("locale", locale);

    setStatus("sending");
    try {
      // No Content-Type header: the browser sets it, including the file boundary
      const res = await fetch("/api/quote", { method: "POST", body: data });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setFiles([]);
      setFileError(null);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  const message =
    status === "success" ? text.success : status === "error" ? text.error : status === "invalid" ? text.required : null;

  return (
    <form className="quote-form" onSubmit={onSubmit} noValidate>
      <div className="field-row">
        <label className="field">
          {text.name}
          <input type="text" name="name" autoComplete="name" required maxLength={120} />
        </label>
        <label className="field">
          {text.phone}
          <input type="tel" name="phone" autoComplete="tel" required maxLength={40} />
        </label>
      </div>

      <label className="field">
        {text.email}
        <input type="email" name="email" autoComplete="email" maxLength={160} />
      </label>

      <fieldset className="field chip-group">
        <legend>
          {text.projectType} <span className="legend-hint">({text.projectTypeHint})</span>
        </legend>
        <div className="chips">
          {[...services, { key: "other", title: text.other }].map((s) => (
            <label key={s.key} className="chip">
              <input type="checkbox" name="projectType" value={s.key} />
              <span>{s.title}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <label className="field">
        {text.message}
        <textarea name="message" rows={4} maxLength={3000} placeholder={text.messagePlaceholder} />
      </label>

      {/* Attachments (optional) */}
      <div className="field">
        <span>{text.attachments}</span>
        <div
          className={`file-box${dragging ? " is-dragging" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
        >
          <button
            type="button"
            className="file-button"
            onClick={() => fileInputRef.current?.click()}
            aria-describedby={hintId}
          >
            {text.chooseFiles}
          </button>
          <span className="file-status">
            {files.length === 0 ? text.noFileChosen : fill(text.filesSelected, { count: files.length })}
          </span>
        </div>
        <span className="file-hint" id={hintId}>
          {fill(text.attachmentsHint, { count: MAX_FILES, max: MAX_TOTAL_MB })}
        </span>
        {/* The real file input stays hidden; the button above opens it */}
        <input ref={fileInputRef} type="file" multiple onChange={onPickFiles} hidden />

        {files.length > 0 && (
          <ul className="file-list">
            {files.map((f, i) => (
              <li key={f.name + f.size}>
                <span className="file-name">{f.name}</span>
                <span className="file-size">{formatSize(f.size)}</span>
                <button
                  type="button"
                  className="file-remove"
                  onClick={() => removeFile(i)}
                  aria-label={`${text.removeFile}: ${f.name}`}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                    <path d="M6 6l12 12M18 6 6 18" />
                  </svg>
                </button>
              </li>
            ))}
            <li className="file-total" aria-hidden="true">
              {formatSize(totalSize)} / {MAX_TOTAL_MB} MB
            </li>
          </ul>
        )}

        <div aria-live="polite">{fileError && <p className="form-status err">{fileError}</p>}</div>
      </div>

      {/* Spam trap: real visitors never see or fill this */}
      <div className="hp" aria-hidden="true">
        <label>
          Leave this field empty
          <input type="text" name="rw_trap" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div aria-live="polite">
        {message && <p className={`form-status ${status === "success" ? "ok" : "err"}`}>{message}</p>}
      </div>

      <button type="submit" className="btn btn-accent" disabled={status === "sending"}>
        {status === "sending" ? text.sending : text.submit}
      </button>
    </form>
  );
}

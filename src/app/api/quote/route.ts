import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { formatSize, isBlockedFile, MAX_FILES, MAX_TOTAL_BYTES } from "@/content/attachments";

// Nodemailer needs the Node.js runtime (not Edge)
export const runtime = "nodejs";

const PROJECT_TYPES: Record<string, string> = {
  kitchens: "Kitchens",
  bathrooms: "Bathrooms",
  basements: "Basements",
  flooring: "Flooring",
  wholeHome: "Whole home",
  other: "Other",
};

const LANGUAGES: Record<string, string> = {
  en: "English",
  nl: "Dutch",
  de: "German",
  fr: "French",
  ar: "Arabic",
  tr: "Turkish",
};

const clean = (v: FormDataEntryValue | null, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

// Created once and reused between requests
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  // Spam trap filled in: pretend it worked, send nothing
  if (clean(form.get("rw_trap"), 200)) {
    console.warn("Quote request blocked by spam trap");
    return NextResponse.json({ ok: true });
  }

  const name = clean(form.get("name"), 120);
  const phone = clean(form.get("phone"), 40);
  const email = clean(form.get("email"), 160);
  // Several project types can be ticked; keep only known ones, no duplicates
  const projectKeys = [...new Set(form.getAll("projectType").map((v) => clean(v, 40)))].filter(
    (k) => k in PROJECT_TYPES,
  );
  const message = clean(form.get("message"), 3000);
  const locale = clean(form.get("locale"), 5);

  if (!name || !phone) {
    return NextResponse.json({ ok: false, error: "Name and phone are required" }, { status: 422 });
  }

  // ----- Attachments (optional) -----
  const files = form.getAll("attachments").filter((f): f is File => f instanceof File && f.size > 0);

  if (files.length > MAX_FILES) {
    return NextResponse.json({ ok: false, error: "Too many files" }, { status: 413 });
  }
  const totalBytes = files.reduce((sum, f) => sum + f.size, 0);
  if (totalBytes > MAX_TOTAL_BYTES) {
    return NextResponse.json({ ok: false, error: "Files too large" }, { status: 413 });
  }
  const blocked = files.find((f) => isBlockedFile(f.name));
  if (blocked) {
    return NextResponse.json({ ok: false, error: `File type not allowed: ${blocked.name}` }, { status: 415 });
  }

  const attachments = await Promise.all(
    files.map(async (f) => ({
      filename: f.name.replace(/[\r\n"]/g, "").slice(0, 200) || "attachment",
      content: Buffer.from(await f.arrayBuffer()),
      contentType: f.type || "application/octet-stream",
    })),
  );

  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.error("Quote email not sent: GMAIL_USER or GMAIL_APP_PASSWORD is missing in .env.local");
    return NextResponse.json({ ok: false, error: "Email is not configured" }, { status: 500 });
  }

  // ----- Email content -----
  const projectType = projectKeys.length ? projectKeys.map((k) => PROJECT_TYPES[k]).join(", ") : "Not specified";
  const language = LANGUAGES[locale] ?? locale;
  const validEmail = email && isEmail(email) ? email : "";

  const rows: [string, string][] = [
    ["Name", name],
    ["Phone", phone],
    ["Email", validEmail || "(not given)"],
    [projectKeys.length > 1 ? "Project types" : "Project type", projectType],
    ["Website language", language],
    ["Attachments", attachments.length ? `${attachments.length} file(s), ${formatSize(totalBytes)}` : "None"],
  ];

  const fileLines = attachments.map((a, i) => `${i + 1}. ${a.filename} (${formatSize(a.content.length)})`);

  const text = [
    "New quote request from the RoWorks website",
    "",
    ...rows.map(([k, v]) => `${k}: ${v}`),
    "",
    "Tell us about your project:",
    message || "(empty)",
    ...(fileLines.length ? ["", "Attached files:", ...fileLines] : []),
  ].join("\n");

  const phoneLink = `tel:${phone.replace(/[^\d+]/g, "")}`;
  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#0e0f10;max-width:560px">
    <h2 style="margin:0 0 16px">New quote request</h2>
    <table style="border-collapse:collapse;width:100%">
      ${rows
        .map(
          ([k, v]) => `
        <tr>
          <td style="padding:8px 12px 8px 0;color:#4c5054;white-space:nowrap;vertical-align:top">${k}</td>
          <td style="padding:8px 0;font-weight:bold">${
            k === "Phone" ? `<a href="${escapeHtml(phoneLink)}">${escapeHtml(v)}</a>` : escapeHtml(v)
          }</td>
        </tr>`,
        )
        .join("")}
    </table>
    <h3 style="margin:20px 0 8px">Tell us about your project</h3>
    <p style="margin:0;white-space:pre-wrap;background:#f2f1ee;padding:12px;border-radius:8px">${
      escapeHtml(message) || "(empty)"
    }</p>
    ${
      fileLines.length
        ? `<h3 style="margin:20px 0 8px">Attached files</h3><ol style="margin:0;padding-left:20px">${fileLines
            .map((l) => `<li>${escapeHtml(l.replace(/^\d+\.\s/, ""))}</li>`)
            .join("")}</ol>`
        : ""
    }
  </div>`;

  try {
    await transporter.sendMail({
      from: `"RoWorks Website" <${process.env.GMAIL_USER}>`,
      to: process.env.QUOTE_TO_EMAIL || process.env.GMAIL_USER,
      // Press "Reply" in Gmail to answer the customer directly
      ...(validEmail ? { replyTo: `"${name.replace(/"/g, "")}" <${validEmail}>` } : {}),
      subject: `New quote request: ${projectType} – ${name}${attachments.length ? ` (${attachments.length} file${attachments.length > 1 ? "s" : ""})` : ""}`,
      text,
      html,
      attachments,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Quote email failed:", err);
    return NextResponse.json({ ok: false, error: "Email could not be sent" }, { status: 502 });
  }
}

# RoWorks website

Next.js (App Router) + TypeScript. Six languages: English (default), Dutch, German, French, Arabic (right-to-left) and Turkish.

## 1. Install

You need **Node.js 20.9 or newer** (download the LTS version from https://nodejs.org).

```bash
cd roworks-website
npm install
```

## 2. Run on your computer

```bash
npm run dev
```

Open http://localhost:3000. You are sent to `/en` automatically.

## 3. Build for production

```bash
npm run build
npm start
```

## How languages work

- Every language has its own address: `/en`, `/nl`, `/de`, `/fr`, `/ar`, `/tr`.
- Visiting `/` opens English, unless the visitor chose another language before (remembered in a cookie).
- Arabic switches the whole page to right-to-left automatically.
- All text lives in `src/i18n/dictionaries/*.json`. Edit the text there; each file has the same keys.
- To add a language: add its code in `src/i18n/config.ts`, copy `en.json` to the new code, translate it, and add it to `src/i18n/get-dictionary.ts`.

## Where to change things

| What | File |
|---|---|
| Phone number, site address | `src/content/site.ts` |
| Projects and photos | `src/content/site.ts` (`projects`), images in `public/images/` |
| Customer reviews | `src/content/site.ts` (`reviews`) |
| Hero photo | `src/content/site.ts` (`heroImage`) |
| Texts in each language | `src/i18n/dictionaries/` |
| Colours and styling | `src/app/globals.css` (top of the file) |
| Quote form handling / email | `src/app/api/quote/route.ts` |

The Projects and Reviews sections (and their menu links) appear automatically once you add items.

## Connecting your mailing system

Quote requests are posted to `/api/quote`. Right now they are only printed in the server log.
Open `src/app/api/quote/route.ts` and send the email at the `TODO` comment (for example with Resend, Brevo, SendGrid or SMTP). Put any API keys in a `.env.local` file.

## Publishing online

The easiest option is Vercel (made by the Next.js team):
1. Put this folder in a GitHub repository.
2. Go to https://vercel.com, choose "Add New Project" and import the repository.
3. Add your domain (for example roworks.be) under Project Settings, then Domains.
4. Set `NEXT_PUBLIC_SITE_URL` to your real domain in the Vercel environment variables.

Any host that runs Node.js also works (`npm run build` then `npm start`).

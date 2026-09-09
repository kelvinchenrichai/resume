# CK Personal Portfolio

A local-first personal website, project portfolio, project CMS and inquiry / quote CRM for CK. The public website and admin workspace use separate URL-based layouts.

## Bilingual mode

The public website and admin CMS support English and Traditional Chinese. The language switch is available in both layouts and the preference is persisted in `localStorage`. Projects and site configuration have dedicated English and Chinese content fields, with English used as a safe fallback when a translation is empty.

## Tech stack

- React 19 + TypeScript
- Vite and React Router
- Tailwind CSS plus a project-specific CSS layer
- Browser `localStorage` through repository interfaces

## Run locally

```bash
npm install
npm run dev
npm run lint
npm run build
```

No API key or backend is required.

## Routes

- `/`, `/projects`, `/projects/:slug`, `/contact`
- `/aadmin-ck`, `/aadmin-ck/projects`, `/aadmin-ck/inquiries`, `/aadmin-ck/settings`

## Local Storage Demo Mode

Projects, inquiries and editable site configuration are stored locally through repository interfaces. Admin Settings can export/import a combined JSON backup or restore demo data. Demo datasets are explicitly marked in `src/data`.

## Current features

Project create, edit, delete, duplicate, bilingual content management, public/draft state, featured state, display order, multilingual search, category/tag filters, public case studies, conditional external links, inquiry creation, source-project tracking, six-stage inquiry status, internal notes, email shortcut, JSON import/export and reset.

## Next step: Firebase V2.2

Add Firebase Auth and a `ProtectedRoute`, then implement Firestore repositories behind the existing interfaces and a Firebase Storage implementation behind `ImageService`. UI components should not need to be rewritten.

# Photo Reveal App

A personalized photo reveal web app with an admin panel and public reveal page.

## Features

- **Admin Panel** (`/admin`): Upload photos, add notes, generate AI captions, arrange order, configure settings
- **Public Reveal Page** (`/`): PIN-gated cinematic photo reveal with blur-to-sharp "developing" effect

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Supabase (Postgres + Storage)
- Anthropic API for AI captions
- Framer Motion for animations

## Setup

### 1. Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your values:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
ANTHROPIC_API_KEY=your_anthropic_api_key
ADMIN_PASSWORD=your_admin_password
REVEAL_PIN=1201
```

### 2. Supabase Setup

1. Create a new Supabase project
2. Run the schema in Supabase SQL Editor:
   - Copy contents of `schema.sql` and execute
3. Create a storage bucket named `photos`:
   - Make it publicly readable
   - Service role key should have write access

### 3. Install & Run

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` for the public page, `http://localhost:3000/admin` for the admin panel.

## Admin Panel

Access `/admin` and enter the `ADMIN_PASSWORD` to access the admin panel where you can:

- Upload photos with drag-and-drop
- Add context notes for each photo
- Generate AI captions using Anthropic
- Edit captions before saving
- Reorder photos via drag-and-drop
- Configure intro/closing messages and recipient label

## Public Reveal Page

Enter the 4-digit PIN to unlock and view the photo sequence. Photos reveal with a cinematic blur-to-sharp effect as you scroll.

## AI Caption Generation

The app uses Anthropic's vision model to generate captions. The tone is warm and genuine—think how you'd caption a photo of someone you respect and care about. No romantic language.

## Deployment

Deploy to Vercel:

```bash
vercel
```

Make sure to set all environment variables in Vercel project settings.

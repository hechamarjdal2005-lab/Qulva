# SQL Setup for Qulva (Supabase)

## Quick Start

1. Create a new Supabase project at https://supabase.com
2. Go to **SQL Editor** in the Supabase dashboard
3. Run `001_schema.sql` (creates all tables, RLS policies, and seed data)
4. Copy your project URL and anon key into `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
   ```
5. Run `npm run dev`

## Files

| File | Purpose |
|------|---------|
| `001_schema.sql` | Creates all tables, indexes, RLS policies, and inserts seed data |
| `002_queries.sql` | Example queries for reading/writing data |

## Tables

| Table | Description |
|-------|-------------|
| `journal_articles` | Blog articles (title, content, category, etc.) |
| `protocol_steps` | Protocol steps per article (one-to-many) |
| `page_sections` | All page content (hero, manifesto, pillars, etc.) - JSONB flexible |
| `site_settings` | Global settings (logo, brand name, social links, etc.) |
| `blog_categories` | Blog filter categories |
| `waitlist_entries` | Waitlist form submissions |
| `contact_submissions` | Contact form submissions |

## Content Structure

All page content is stored in `page_sections` table using JSONB for flexibility:

- **`page`** - Which page (`home`, `about`, `blog`, `contact`, `footer`, `metadata`, `waitlist`)
- **`section_key`** - Section identifier (`hero`, `manifesto`, `pillars`, etc.)
- **`body`** - Text content (pipe-separated for multi-part: `"Title|Description"`)
- **`label`** - Small label text
- **`meta`** - JSONB for complex data (arrays, nested objects)

## Editing Content

All content can be edited directly in Supabase SQL Editor or via the Supabase dashboard table editor. No code changes needed.
# Qulva

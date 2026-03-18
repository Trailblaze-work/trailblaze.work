# Bilingual Website with Client Section

**Date:** 2026-03-18
**Status:** Approved

## Overview

Make the Trailblaze website bilingual (English/French) with browser language detection, a discreet language switcher, and a new client showcase section. The French copy is adapted for a French corporate audience, not literally translated. No emdashes or other AI writing tells anywhere in the copy.

## 1. Translation Architecture

### Approach: JSON translation files + JS DOM hydration

All hardcoded text in `index.html` is replaced with `data-i18n` attributes referencing keys in two JSON files:

- `/i18n/en.json` - English copy (source of truth)
- `/i18n/fr.json` - French copy (adapted, not translated)

A small inline JS module handles language resolution and DOM hydration.

### Language Resolution Order

1. Check `localStorage` for a saved user preference (`trailblaze-lang`)
2. Fall back to `navigator.language` (matches `fr`, `fr-FR`, `fr-CA`, etc.)
3. Default to `en` for all other languages

### Performance Strategy

**Goal:** No flash of untranslated content (FOUT). The user sees the correct language on first paint.

1. **Preload both JSON files** in `<head>`, immediately after font preloads:
   ```html
   <link rel="preload" href="/i18n/en.json" as="fetch" crossorigin>
   <link rel="preload" href="/i18n/fr.json" as="fetch" crossorigin>
   ```

2. **Inline blocking script** in `<head>` (before CSS) that resolves the language and sets `<html lang="">` + a `data-lang` attribute. This runs synchronously so the browser knows the language before painting.

3. **Hydration script** at end of `<body>` (or deferred) fetches the resolved language's JSON (already preloaded, so it's instant from cache) and injects text into all `data-i18n` elements.

4. **Fallback content in HTML:** The `data-i18n` elements contain the English text as their default `textContent`. If JS fails or is slow, the page still shows English. The hydration replaces this text.

5. **`localStorage` caching** of language preference so repeat visits skip detection entirely.

### HTML Markup Pattern

```html
<!-- Simple text -->
<h1 data-i18n="hero.headline">Your team, ten times faster</h1>

<!-- Text with inline markup (em spans) -->
<p data-i18n="hero.subtext" data-i18n-html="true">
  We help companies deploy <span class="em">AI-assisted work</span>...
</p>

<!-- Attributes (title, meta, alt) -->
<meta name="description" data-i18n-attr="content:meta.description" content="...">
```

For elements containing HTML markup (like `<span class="em">`), the JSON values include the markup and are injected via `innerHTML` with the `data-i18n-html` flag. For plain text, `textContent` is used.

### JSON Structure

Keys are organized by section:

```json
{
  "meta": {
    "title": "Trailblaze - AI Consulting for the Modern Workforce",
    "description": "..."
  },
  "nav": {
    "about": "About",
    "services": "Services",
    "approach": "Approach",
    "caseStudy": "Case Study",
    "whyUs": "Why Us",
    "cta": "Get in Touch"
  },
  "hero": {
    "tag": "AI-Powered Workforce Transformation",
    "headline": "Your team, ten times faster",
    "subtext": "..."
  },
  "about": { ... },
  "services": { ... },
  "approach": { ... },
  "caseStudy": { ... },
  "clients": { ... },
  "principles": { ... },
  "contact": { ... },
  "footer": { ... }
}
```

### Dynamic `<html>` Attributes

The `lang` attribute on `<html>` updates to match the active language. This is important for:
- Screen readers and accessibility tools
- Browser spell-check language
- Search engine language detection

## 2. French Copy Guidelines

The French version is **not a translation**. It is rewritten copy for a French corporate audience:

- Formal "vous" throughout (not "tu")
- French business register and idioms
- No literal calques from English
- The fire/blaze brand metaphors carry over but are expressed naturally in French
- No emdashes anywhere
- No AI writing tells (no "naviguer dans le paysage", no "il est important de noter", no filler)
- `<title>` and `<meta description>` are also French for SEO
- Numbers, currency, and date formats follow French conventions where applicable

## 3. Language Switcher

### Design: Floating pill, bottom-right corner

- **Position:** `position: fixed; bottom: 1.5rem; right: 1.5rem;`
- **Shape:** Capsule / pill (`border-radius: 20px`)
- **Background:** Semi-transparent dark (`rgba(26, 26, 30, 0.9)`) with subtle border (`var(--border-subtle)`)
- **Content:** Two labels: `EN` and `FR`
- **Active state:** Active language gets a subtle amber background highlight (`rgba(232, 154, 46, 0.15)`) with primary text color
- **Inactive state:** Muted text color, clickable
- **z-index:** Above content and noise overlay, below nav (e.g., `z-index: 500`)
- **Backdrop filter:** Slight blur to match nav bar treatment
- **Mobile:** Same position, slightly larger padding for touch targets (min 44px tap area)
- **Animation:** Text content swaps with a quick fade transition (150ms opacity)

### Behavior

- Clicking the inactive language:
  1. Saves preference to `localStorage`
  2. Updates `<html lang="">`
  3. Re-hydrates all `data-i18n` elements with new language content
  4. Updates active/inactive styling on the pill
  5. No page reload
- The pill is always visible on scroll
- On first load, the pill reflects the auto-detected language

## 4. Clients Section

### Placement

Between the "Why Us" (principles) section and the Contact CTA section.

### Layout: Featured Client Card

- **Section tag:** "Trusted by" (en) / "Ils nous font confiance" (fr)
- **Card structure:**
  - Backupta logo (saved locally as an image asset, sourced from backupta.com)
  - One-liner describing the engagement or what Backupta does
  - Styled consistently with the site's card aesthetic:
    - `background: var(--bg-card)`
    - Subtle border (`var(--border-subtle)`)
    - Scroll reveal animation (matches existing sections)
- **Future-proofing:** The section uses a grid/flex container that can hold multiple cards. Adding a second client means adding another card element.

### Backupta Logo

- Download the logo from backupta.com and save it locally in the project (e.g., `/assets/clients/backupta-logo.svg` or `.png`)
- Do not hotlink to their domain
- If their logo is dark-on-light, it may need a light treatment or container background to be visible on the dark site background

## 5. Files Changed

| File | Change |
|------|--------|
| `index.html` | Replace hardcoded text with `data-i18n` attributes; add preload tags for JSON files; add inline language detection script; add language switcher markup; add clients section HTML; add hydration script |
| `/i18n/en.json` | New file: all English copy extracted from current HTML |
| `/i18n/fr.json` | New file: French copy adapted for corporate audience |
| `/assets/clients/backupta-logo.*` | New file: Backupta logo saved locally |
| `.gitignore` | Already updated (`.superpowers/` added) |

## 6. Constraints

- No build tools, no frameworks, no npm. Stays a vanilla static site.
- No external i18n libraries. The hydration logic is custom and small.
- GitHub Pages deployment (no server-side logic).
- The page must render correctly even if JS is disabled (English fallback).
- Both language versions must be fully functional and visually identical in layout.

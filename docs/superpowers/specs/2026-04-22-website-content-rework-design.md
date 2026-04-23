# Website Content Rework — Alma Proposal Alignment

**Date:** 2026-04-22
**Source of truth:** `2026-04-07 Trailblaze - Proposition Alma.pdf`
**Goal:** Realign the public site (`trailblaze.work`) so the offer, language, and structure reflect what Trailblaze actually sells, as captured in the most recent client proposal.

## Decisions captured during brainstorming

- **Engineering as productized core**, with a brief acknowledgement that Trailblaze also covers design, marketing/sales, and product through dedicated experts.
- **No pricing on the public site** (the PDF lists €250/h; this stays in proposals only).
- **Anonymous team framing** — no individual bios or photos. Surface seniority instead: "CTOs, CPOs, very senior ICs."
- **Keep the chart-based case study and the client cards.** Add Alma as a third client card.
- **Keep the 4-step process arc** as the "engagement" narrative, with workshops & reviews shown as the activities inside.
- **Rework the 3 "Why us" principles** rather than dropping the section.
- **Hero stays broad** ("AI for the whole workforce") but **drops the explicit 10× promise**. 10× language is removed from the hero only — the past case-study numbers (5.5×, 80/mo) are factually defensible and stay.

## Workflow constraint

Preview every change locally in a browser, share the URL with the user, **wait for explicit approval** before any `git add`/`commit`/`push`.

## Section map

| # | Section ID | Section | Source content |
|---|---|---|---|
| 1 | `#hero` | Hero | Reframed broad tagline, no 10×, engineering body line |
| 2 | `#about` | About / problem | PDF intro paragraph |
| 3 | `#approach` (renamed from `#services`) | What we do — 2 pillars | PDF "Notre approche" |
| 4 | `#tools` (new) | Our tools | PDF "Nos outils" |
| 5 | `#process` (renamed from `#approach`) | Engagement process — 4 steps | Reworked, points to pillars |
| 6 | `#case-study` | Case study | Existing, copy lightly retuned |
| 7 | `#clients` | Trusted by | Backupta + Lyvoc + Alma |
| 8 | `#principles` | Why us | 3 reworked principles |
| 9 | `#contact` | Contact | Existing, copy lightly retuned |

Nav becomes: About · Approach · Tools · Process · Case · Why Us · CTA.

## Content (English; FR mirrors literal meaning)

### Hero
- Tag: `AI consulting for modern teams`
- Headline: **`Make AI part of how your teams actually work.`**
- Sub: `From engineering to design, product and sales — we help your teams turn AI from novelty into the way work gets done. Hands-on, on your real workflows, with the people who actually do the job.`
- CTA primary: `Start the conversation` (unchanged)
- CTA secondary: `See how we work` (unchanged, scrolls to `#approach`)

### About
- Tag: `Who we are`
- Heading: `AI expertise is built on real work.`
- p1: `AI tools change every week. Every person on your team deserves to get the most out of them — and that expertise only comes from practice on real work, with the right guidance alongside.`
- p2: `Trailblaze helps teams adopt the best AI practices and maximise the return on their AI investment. Engineering is where we go deepest, and we bring dedicated experts for design, product, and marketing/sales when the work calls for it.`

### Approach (2 pillars — replaces the old 4-card Services)
- Tag: `Our approach`
- Heading: `Two things, done well.`
- Desc: `We work directly with your team, on real code and real workflows. No artificial exercises.`
- Card 1 — `Hands-on workshops`: `Small groups of 2 to 4 people, working on your actual codebase. Reproducible best practices, calibrated to each participant's level of AI experience. People leave with habits, not slides.`
- Card 2 — `Code & prompt reviews`: `We analyse how AI is actually being used in your team's day-to-day work, hand back targeted recommendations they can apply immediately, and track how the practice evolves week after week.`

### Tools (new section)
- Tag: `Our tools`
- Heading: `The instruments we bring with us.`
- Desc: `Software we've built — and continue to build — to make adoption measurable and the workflow specifically yours.`
- Tool 1 — `Adoption & velocity dashboard`: `Tracks AI adoption across the team and the impact on delivery velocity, so progress is visible and decisions can be made on data.`
- Tool 2 — `Prompt logging & reporting`: `Captures what people are actually prompting and producing, so reviews and recommendations are grounded in real practice — not anecdotes.`
- Tool 3 — `Custom-built tools`: `When a workflow needs its own tooling, we design and build it for you — fitted to how your business actually operates.`

### Process (4 steps — was the old Approach section)
- Tag: `How we work`
- Heading: `How an engagement<br>usually goes.`
- Desc: `Every company is different, but the shape of the work tends to follow these four steps.`
- Step 1 — `Assess`: `We sit with your team to understand how AI is being used today, where the gaps are, and what's actually slowing people down.`
- Step 2 — `Practice`: `Hands-on workshops on your real code, in small groups, with content tuned to each person's level.`
- Step 3 — `Iterate`: `Weekly code and prompt reviews, with targeted recommendations and visible progress tracking.`
- Step 4 — `Scale`: `Once it works, we help you spread the practice and grow internal champions, so you don't need us forever.`

### Case study (kept; minor copy retune)
- Heading + chart copy unchanged.
- Desc: `An engineering team we worked with over 16 months. Headcount stayed flat. The way they shipped changed completely.` (very small edit from "software company" → "engineering team")

### Clients (add Alma)
- Tag: `Trusted by`
- Order: Backupta · Lyvoc · Alma
- Alma copy (EN): `Alma is a leading European payments company, providing instalment and pay-later solutions across the continent. We work with their engineering teams to embed AI deeply into how they design, build, and ship.`
- Alma copy (FR): `Alma est un acteur européen majeur du paiement, proposant des solutions de paiement en plusieurs fois et de paiement différé à travers le continent. Nous accompagnons leurs équipes d'ingénierie pour intégrer l'IA en profondeur dans la conception, le développement et la livraison.`
- Alma logo: extracted SVG from `almapay.com`, saved to `assets/clients/alma-logo.svg`, used as `<img>` (no `.invert` — it's brand-orange and works on dark bg).

### Principles (reworked)
- Tag: `Why Trailblaze`
- Heading: `Why us.`
- Desc: `A lot of firms talk about AI. Here's what's actually different about working with us.`
- p1 — `We use what we teach`: `We've been running 100% AI-driven development since early 2025. Every recommendation we give is something we use ourselves, every day, on real production work.`
- p2 — `Senior practitioners only`: `Engagements are led by people who've been CTOs, CPOs, and very senior ICs. You get the people who've actually done the job — never juniors learning on your time.`
- p3 — `Engineering core, full-stack ready`: `Engineering is where we go deepest, and we bring dedicated experts for design, product, and marketing/sales when your work calls for them.`

### Contact
- Tag: `Let's talk`
- Heading: `Ready to <span class="em">blaze<br>the trail</span>?` (unchanged)
- Sub: `If you're thinking about how AI fits into how your teams work, let's talk.` (very small edit)
- CTA: `hello@trailblaze.work` (unchanged)

## HTML/CSS changes

- Nav: rename links and IDs to match the section map; add `Tools` link.
- `#services` → `#approach`: drop service-cards 03 and 04, keep 2 cards. (CSS already handles 2-col grid.)
- New `<section id="tools">` with 3 cards using `.principle-card` style (cheapest reuse) — small icon, title, short body.
- `#approach` (4 steps) → `#process` (HTML id rename only; existing JS observers select by class `.approach-steps` so they keep working).
- `#clients`: switch grid to 3 columns on desktop (`repeat(3, 1fr)`), 1 column on mobile. Add Alma `<a>` card.
- Drop the 10× headline; remove the `.em` span construction in the headline since the new copy doesn't need a coloured fragment.
- All text strings driven by `i18n/{en,fr}.json`. Add new keys for `tools.*`, rename `services.*` → `approach.*` and `approach.*` → `process.*`. Add `clients.alma.desc`. Update `nav.*`.

## Out of scope

- No new visual design or animations beyond reusing existing card styles.
- No pricing.
- No team photos/bios.
- No other languages (FR + EN only).

## Verification

- Local dev server (`python3 -m http.server` from project root); user previews in browser before any commit.
- Switch to FR; confirm hydration replaces every visible string and there are no missing-key console warnings.
- Resize to ≤768 px and confirm mobile layout (single-column grids, nav collapses).

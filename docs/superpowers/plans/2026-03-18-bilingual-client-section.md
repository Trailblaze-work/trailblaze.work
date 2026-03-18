# Bilingual Website + Client Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make trailblaze.work bilingual (EN/FR) with browser language detection, a floating language switcher, and a new "Trusted by" client section featuring Backupta.

**Architecture:** JSON translation files (`i18n/en.json`, `i18n/fr.json`) hydrated into `data-i18n` DOM elements by a small vanilla JS script. A blocking `<head>` script resolves language before paint. A floating EN/FR pill in the bottom-right corner lets users switch. A new clients section with a featured card sits between Principles and the Contact CTA.

**Tech Stack:** Vanilla HTML/CSS/JS. No build tools, no frameworks, no npm. Static site on GitHub Pages + Cloudflare.

**Spec:** `docs/superpowers/specs/2026-03-18-bilingual-client-section-design.md`

**Note on line numbers:** All line references are based on the original `index.html`. Tasks 4-7 each modify `index.html`, so line numbers will drift as earlier tasks add content. Use the contextual anchors (element names, text content, CSS selector names) to find the right location, not the line numbers alone.

**Note on JS style:** The existing codebase uses ES6+ (arrow functions, `const`/`let`, template literals, `class`). All new JS in this plan should match that style. The code samples below use ES5 for readability; the implementer should convert to ES6+ to match the codebase.

---

## File Map

| File | Role |
|------|------|
| `index.html` | Single-page site. Gets `data-i18n` attributes on all text elements, preload tags, blocking lang-detect script, hydration script, language switcher markup, clients section HTML, and new CSS for switcher + clients section. |
| `i18n/en.json` | English copy extracted from current HTML. Source of truth. |
| `i18n/fr.json` | French copy adapted for corporate audience. Not a literal translation. |
| `assets/clients/backupta-logo.svg` | Backupta logo saved locally (do not hotlink). |

---

### Task 1: Fetch and save the Backupta logo

**Files:**
- Create: `assets/clients/backupta-logo.svg` (or `.png` depending on what's available)

- [ ] **Step 1: Fetch the Backupta website and find their logo**

Visit `https://www.backupta.com/` and identify the logo image URL. Look for an SVG or high-quality PNG in their `<header>`, `<nav>`, or as a favicon/og-image.

- [ ] **Step 2: Download the logo locally**

Save it to `assets/clients/backupta-logo.svg` (prefer SVG; fall back to PNG).

```bash
mkdir -p assets/clients
curl -o assets/clients/backupta-logo.svg "<logo-url>"
```

- [ ] **Step 3: Verify the logo renders on a dark background**

Open the file and check if it's visible against `#08080a`. If it's a dark logo on transparent background, it should work. If it's dark-on-white or has a white background baked in, note that for Task 5 (the clients section CSS may need a light container or filter).

- [ ] **Step 4: Commit**

```bash
git add assets/clients/
git commit -m "Add Backupta logo asset for clients section"
```

---

### Task 2: Create the English translation JSON

**Files:**
- Create: `i18n/en.json`

- [ ] **Step 1: Create the directory and file**

```bash
mkdir -p i18n
```

- [ ] **Step 2: Write `i18n/en.json`**

Extract every piece of visible text from `index.html` into a structured JSON file. Keys are organized by section. Values that contain HTML markup (like `<span class="em">` or `<br>`) include that markup in the string.

```json
{
  "meta": {
    "title": "Trailblaze - AI Consulting for the Modern Workforce",
    "description": "Trailblaze helps companies deploy AI-assisted work across their workforce. Bleeding-edge best practices. 10x productivity gains."
  },
  "nav": {
    "about": "About",
    "services": "Services",
    "approach": "Approach",
    "caseStudy": "Case Study",
    "whyUs": "Why Us",
    "cta": "Get in Touch",
    "toggleMenu": "Toggle menu"
  },
  "hero": {
    "tag": "AI Workforce Consulting",
    "headline": "Your team,<br><span class=\"em\">ten times faster.</span>",
    "sub": "We help companies bring AI into their day-to-day work. Not as a gimmick, but as the way things actually get done. Safely, and ahead of the curve.",
    "ctaPrimary": "Start the conversation",
    "ctaSecondary": "See how we work"
  },
  "about": {
    "tag": "Who We Are",
    "heading": "We know how AI actually gets adopted.",
    "p1": "Everyone agrees AI matters. But most rollouts stall because they're led by people who understand the tech and not the work, or the work and not the tech.",
    "p2": "We do both. We sit with your teams, figure out where AI genuinely helps, rebuild those workflows from scratch, and stick around until your people are comfortable running things on their own."
  },
  "services": {
    "tag": "What We Do",
    "heading": "What we<br>actually do.",
    "desc": "Four things, and we do them well.",
    "s1": {
      "title": "Workforce AI Strategy",
      "desc": "We look at how your teams actually work and figure out where AI makes a real difference. You get a plan you can act on, not a half-baked deck full of buzzwords."
    },
    "s2": {
      "title": "Implementation & Deployment",
      "desc": "We test every new tool that hits the market, pick the ones that fit your setup, and wire them into the systems your team already uses. No rip-and-replace."
    },
    "s3": {
      "title": "Training & Adoption",
      "desc": "Tools don't matter if nobody uses them. We train your people hands-on until they're genuinely faster, not just \"AI-enabled\" on paper."
    },
    "s4": {
      "title": "Safety & Governance",
      "desc": "Moving fast with AI is pointless if it lands you in trouble. We set up the policies, review processes, and monitoring so you can move quickly without the risk."
    }
  },
  "approach": {
    "tag": "How We Work",
    "heading": "How an engagement<br>usually goes.",
    "desc": "Every company is different, but the shape of the work tends to follow these four steps.",
    "step1": {
      "title": "Assess",
      "desc": "We spend time with your teams to understand how work actually happens, not how the org chart says it should."
    },
    "step2": {
      "title": "Design",
      "desc": "We redesign the workflows that matter most, so AI fits into how your people already think and operate."
    },
    "step3": {
      "title": "Deploy",
      "desc": "We roll things out alongside your team. Not a handoff, but a working partnership until everything runs smoothly."
    },
    "step4": {
      "title": "Scale",
      "desc": "Once it works, we help you spread it. We build internal champions so you don't need us forever."
    }
  },
  "caseStudy": {
    "tag": "Case Study",
    "heading": "Same team.<br>Different output.",
    "desc": "A software company we worked with over 16 months. Headcount stayed flat. The way they worked changed completely.",
    "chart1": {
      "title": "Cumulative code output",
      "subtitle": "Functional code only. Team size held constant.",
      "engaged": "TRAILBLAZE ENGAGED",
      "projected": "Projected",
      "rateBefore": "+6k / month",
      "rateAfter": "+35k / month"
    },
    "callout1": {
      "number": "5.5x",
      "label": "Acceleration in delivery rate"
    },
    "chart2": {
      "title": "Features shipped per month",
      "subtitle": "Same team throughout.",
      "peak": "110"
    },
    "callout2": {
      "beforeNumber": "5/mo",
      "beforeLabel": "Before engagement",
      "afterNumber": "80/mo",
      "afterLabel": "After engagement"
    }
  },
  "principles": {
    "tag": "Why Trailblaze",
    "heading": "Why us.",
    "desc": "There are a lot of firms talking about AI. Here's why our clients chose us.",
    "p1": {
      "title": "We keep up so you don't have to",
      "desc": "AI moves every week. New models, new tools, new launches. We track all of it and put every tool to the test, so your team gets what actually works, not last quarter's thinking."
    },
    "p2": {
      "title": "We care about your people",
      "desc": "The best tools in the world don't help if your team doesn't use them. We spend as much time on training and buy-in as we do on the technology itself."
    },
    "p3": {
      "title": "Safety is not an afterthought",
      "desc": "Governance, data privacy, and security are built in from day one. We've seen what happens when they're not, and we won't let that happen to you."
    }
  },
  "clients": {
    "tag": "Trusted by",
    "backupta": {
      "desc": "Backupta builds secure, automated backup solutions for businesses. We helped them accelerate their product development with AI-assisted engineering workflows."
    }
  },
  "contact": {
    "tag": "Let's Talk",
    "heading": "Ready to <span class=\"em\">blaze<br>the trail</span>?",
    "sub": "If you're thinking about how AI fits into your company's future, we should talk.",
    "cta": "hello@trailblaze.work"
  },
  "footer": {
    "copy": "\u00a9 2026 Trailblaze. All rights reserved.",
    "contact": "Contact"
  }
}
```

**Note:** The `\u00a9` is the `©` character. Values containing `<br>`, `<span class="em">`, or `<strong>` tags are intentional and will be injected via `innerHTML` using the `data-i18n-html` flag.

- [ ] **Step 3: Validate JSON**

```bash
python3 -c "import json; json.load(open('i18n/en.json'))" && echo "Valid JSON"
```

Expected: `Valid JSON`

- [ ] **Step 4: Commit**

```bash
git add i18n/en.json
git commit -m "Extract English copy into i18n/en.json"
```

---

### Task 3: Create the French translation JSON

**Files:**
- Create: `i18n/fr.json`

- [ ] **Step 1: Write `i18n/fr.json`**

This is **not** a literal translation. It must read like copy written by a native French speaker for a corporate audience. Guidelines:
- Formal "vous" throughout
- French business register and natural idioms
- No calques from English
- No emdashes (use commas, periods, or restructure)
- No AI writing tells ("il est important de noter", "naviguer dans le paysage", "dans un monde ou", filler phrases)
- The Trailblaze fire/blaze brand voice carries over naturally
- Numbers use French conventions where relevant

```json
{
  "meta": {
    "title": "Trailblaze - Conseil en IA pour les entreprises",
    "description": "Trailblaze accompagne les entreprises dans le deploiement de l'IA au quotidien. Les meilleures pratiques du marche. Des gains de productivite multiplies par 10."
  },
  "nav": {
    "about": "A propos",
    "services": "Services",
    "approach": "Methode",
    "caseStudy": "Etude de cas",
    "whyUs": "Pourquoi nous",
    "cta": "Nous contacter",
    "toggleMenu": "Ouvrir le menu"
  },
  "hero": {
    "tag": "Conseil IA en entreprise",
    "headline": "Votre equipe,<br><span class=\"em\">dix fois plus rapide.</span>",
    "sub": "Nous aidons les entreprises a integrer l'IA dans leur travail quotidien. Pas comme un gadget, mais comme un vrai levier de performance. En toute securite, avec un temps d'avance.",
    "ctaPrimary": "Parlons-en",
    "ctaSecondary": "Decouvrir notre methode"
  },
  "about": {
    "tag": "Qui sommes-nous",
    "heading": "On sait comment l'IA s'adopte vraiment.",
    "p1": "Tout le monde s'accorde a dire que l'IA compte. Mais la plupart des deploiements echouent parce qu'ils sont menes par des profils qui maitrisent la technologie sans connaitre les metiers, ou l'inverse.",
    "p2": "Nous faisons les deux. Nous travaillons au contact de vos equipes pour identifier ou l'IA apporte une vraie valeur, nous repensons les workflows concernes, et nous restons jusqu'a ce que vos collaborateurs soient autonomes."
  },
  "services": {
    "tag": "Nos services",
    "heading": "Ce que nous<br>faisons concretement.",
    "desc": "Quatre expertises. Toutes maitrisees.",
    "s1": {
      "title": "Strategie IA pour les equipes",
      "desc": "Nous analysons le fonctionnement reel de vos equipes pour identifier ou l'IA fait une vraie difference. Vous repartez avec un plan actionnable, pas un document creux rempli de mots a la mode."
    },
    "s2": {
      "title": "Mise en oeuvre et deploiement",
      "desc": "Nous testons chaque nouvel outil qui arrive sur le marche, selectionnons ceux qui correspondent a votre environnement, et les integrons dans les systemes que vos equipes utilisent deja. Aucune rupture."
    },
    "s3": {
      "title": "Formation et adoption",
      "desc": "Les outils ne servent a rien si personne ne s'en sert. Nous formons vos equipes sur le terrain jusqu'a ce qu'elles soient reellement plus performantes, pas juste \"dotees d'IA\" sur le papier."
    },
    "s4": {
      "title": "Securite et gouvernance",
      "desc": "Aller vite avec l'IA n'a aucun sens si cela vous expose a des risques. Nous mettons en place les politiques, les processus de validation et le suivi necessaires pour avancer rapidement en toute confiance."
    }
  },
  "approach": {
    "tag": "Notre methode",
    "heading": "Comment se deroule<br>une mission type.",
    "desc": "Chaque entreprise est differente, mais nos interventions suivent generalement ces quatre etapes.",
    "step1": {
      "title": "Diagnostic",
      "desc": "Nous passons du temps avec vos equipes pour comprendre comment le travail se fait reellement, pas ce que l'organigramme predit."
    },
    "step2": {
      "title": "Conception",
      "desc": "Nous repensons les workflows prioritaires pour que l'IA s'insere naturellement dans les habitudes de vos collaborateurs."
    },
    "step3": {
      "title": "Deploiement",
      "desc": "Nous deployons les solutions avec vos equipes. Pas de transfert sec : un vrai partenariat operationnel jusqu'a la stabilisation."
    },
    "step4": {
      "title": "Passage a l'echelle",
      "desc": "Une fois les resultats prouves, nous vous aidons a generaliser. Nous formons des relais internes pour que vous n'ayez plus besoin de nous."
    }
  },
  "caseStudy": {
    "tag": "Etude de cas",
    "heading": "Meme equipe.<br>Resultats transformes.",
    "desc": "Un editeur logiciel que nous avons accompagne pendant 16 mois. Les effectifs n'ont pas bouge. La facon de travailler, si.",
    "chart1": {
      "title": "Production de code cumulee",
      "subtitle": "Code fonctionnel uniquement. Taille de l'equipe constante.",
      "engaged": "DEBUT DE MISSION TRAILBLAZE",
      "projected": "Projection",
      "rateBefore": "+6k / mois",
      "rateAfter": "+35k / mois"
    },
    "callout1": {
      "number": "5,5x",
      "label": "Acceleration du rythme de livraison"
    },
    "chart2": {
      "title": "Fonctionnalites livrees par mois",
      "subtitle": "Equipe identique sur toute la periode.",
      "peak": "110"
    },
    "callout2": {
      "beforeNumber": "5/mois",
      "beforeLabel": "Avant la mission",
      "afterNumber": "80/mois",
      "afterLabel": "Apres la mission"
    }
  },
  "principles": {
    "tag": "Pourquoi Trailblaze",
    "heading": "Pourquoi nous.",
    "desc": "Beaucoup de cabinets parlent d'IA. Voici pourquoi nos clients nous ont choisis.",
    "p1": {
      "title": "Nous suivons le rythme pour vous",
      "desc": "L'IA evolue chaque semaine. Nouveaux modeles, nouveaux outils, nouvelles annonces. Nous testons tout et ne retenons que ce qui fonctionne, pour que vos equipes ne travaillent jamais avec les idees du trimestre dernier."
    },
    "p2": {
      "title": "Vos collaborateurs sont au centre",
      "desc": "Les meilleurs outils du monde sont inutiles si vos equipes ne les utilisent pas. Nous consacrons autant d'energie a la formation et a l'adhesion qu'a la technologie elle-meme."
    },
    "p3": {
      "title": "La securite n'est pas une option",
      "desc": "Gouvernance, confidentialite des donnees et securite sont integrees des le premier jour. Nous savons ce qui se passe quand ce n'est pas le cas, et nous ne laisserons pas cela vous arriver."
    }
  },
  "clients": {
    "tag": "Ils nous font confiance",
    "backupta": {
      "desc": "Backupta developpe des solutions de sauvegarde automatisees et securisees pour les entreprises. Nous les avons aides a accelerer leur cycle de developpement produit grace a des workflows d'ingenierie assistes par l'IA."
    }
  },
  "contact": {
    "tag": "Echangeons",
    "heading": "Prets a <span class=\"em\">ouvrir<br>la voie</span> ?",
    "sub": "Si vous reflechissez a la place de l'IA dans l'avenir de votre entreprise, parlons-en.",
    "cta": "hello@trailblaze.work"
  },
  "footer": {
    "copy": "\u00a9 2026 Trailblaze. Tous droits reserves.",
    "contact": "Contact"
  }
}
```

**Important notes on the French copy:**
- The CTA heading uses "ouvrir la voie" (blaze the trail adapted to French) instead of a literal translation
- "5,5x" uses a comma as the decimal separator (French convention)
- "5/mois" and "80/mois" instead of "5/mo" and "80/mo"
- Approach steps have French equivalents: Assess=Diagnostic, Design=Conception, Deploy=Deploiement, Scale=Passage a l'echelle
- "DEBUT DE MISSION TRAILBLAZE" instead of "TRAILBLAZE ENGAGED"
- No emdashes anywhere. Sentences use colons, commas, or periods.
- Accented characters: use proper French accents (e with accent aigu, etc.) in the actual file. The plan shows ASCII for readability but the **actual JSON must use UTF-8 accented characters** (e.g., `equipe` -> `équipe`, `methode` -> `méthode`, etc.).

- [ ] **Step 2: Add proper UTF-8 accented characters**

Go through every French string and ensure proper accents: é, è, ê, ë, à, â, ç, î, ô, ù, etc. Common words to check:
- equipe -> équipe
- methode -> méthode
- deploiement -> déploiement
- securite -> sécurité
- maitrisees -> maîtrisées
- concretement -> concrètement
- integrer -> intégrer
- decouvrir -> découvrir
- etude -> étude
- reellement -> réellement
- differente -> différente
- generalement -> généralement
- stabilisation stays as-is
- resultats -> résultats
- etc.

- [ ] **Step 3: Validate JSON**

```bash
python3 -c "import json; json.load(open('i18n/fr.json'))" && echo "Valid JSON"
```

Expected: `Valid JSON`

- [ ] **Step 4: Commit**

```bash
git add i18n/fr.json
git commit -m "Add French translation adapted for corporate audience"
```

---

### Task 4: Add clients section HTML and CSS to index.html

**Files:**
- Modify: `index.html:669-719` (CSS, add after principles styles)
- Modify: `index.html:909-916` (responsive CSS, add clients grid rule)
- Modify: `index.html:950-953` (mobile CSS, add clients grid rule)
- Modify: `index.html:1238-1240` (HTML, insert new section between principles `</section>` and the divider before CTA)

- [ ] **Step 1: Add CSS for the clients section**

Insert after the `.principle-card p` rule (around line 718) in the `<style>` block:

```css
/* ── Clients ── */
.clients-grid {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.client-card {
  background: var(--bg-card);
  border: 1px solid var(--border-subtle);
  border-radius: 16px;
  padding: 2.5rem;
  display: flex;
  align-items: center;
  gap: 2.5rem;
  transition: all 0.3s ease;
  max-width: 600px;
}

.client-card:hover {
  border-color: var(--border-glow);
}

.client-logo {
  flex-shrink: 0;
  width: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.client-logo img {
  max-width: 100%;
  max-height: 48px;
  width: auto;
  height: auto;
}

.client-info h4 {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.15rem;
  letter-spacing: -0.01em;
  margin-bottom: 0.5rem;
}

.client-info p {
  font-weight: 300;
  font-size: 0.9rem;
  line-height: 1.65;
  color: var(--text-secondary);
}
```

- [ ] **Step 2: Add responsive rules for the clients section**

Insert inside the existing `@media (max-width: 768px)` block (around line 953, after `.principles-grid { grid-template-columns: 1fr; }`):

```css
.client-card {
  flex-direction: column;
  align-items: flex-start;
  gap: 1.5rem;
}
```

- [ ] **Step 3: Add the clients section HTML**

Insert between the closing `</section>` of the Principles section and the `<div class="divider"></div>` before the CTA section (after line 1238):

```html
  <div class="divider"></div>

  <!-- Clients -->
  <section id="clients">
    <div class="section-inner">
      <div class="section-tag" data-i18n="clients.tag">Trusted by</div>

      <div class="clients-grid">
        <div class="client-card reveal">
          <div class="client-logo">
            <img src="assets/clients/backupta-logo.svg" alt="Backupta">
          </div>
          <div class="client-info">
            <h4>Backupta</h4>
            <p data-i18n="clients.backupta.desc">Backupta builds secure, automated backup solutions for businesses. We helped them accelerate their product development with AI-assisted engineering workflows.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
```

**Note:** The `data-i18n` attributes are added now even though hydration isn't wired up yet. They're inert until the script runs.

- [ ] **Step 4: Verify in browser**

Open `index.html` directly in a browser. Check:
- The clients section appears between Principles and the Contact CTA
- The Backupta logo renders correctly on the dark background
- The card layout looks right on desktop and mobile (resize the window)
- Scroll reveal animation works on the card

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "Add clients section with Backupta featured card"
```

---

### Task 5: Add data-i18n attributes to all existing HTML elements

**Files:**
- Modify: `index.html` (throughout the HTML body, lines 965-1268)

This is the largest task. Every visible text element gets a `data-i18n` attribute. Elements with HTML markup inside (like `<span class="em">`) additionally get `data-i18n-html="true"`. The English text stays as the default content.

- [ ] **Step 1: Add data-i18n to nav elements**

```html
<!-- line ~971-977 -->
<li><a href="#about" data-i18n="nav.about">About</a></li>
<li><a href="#services" data-i18n="nav.services">Services</a></li>
<li><a href="#approach" data-i18n="nav.approach">Approach</a></li>
<li><a href="#case-study" data-i18n="nav.caseStudy">Case Study</a></li>
<li><a href="#principles" data-i18n="nav.whyUs">Why Us</a></li>
<!-- -->
<a href="#contact" class="nav-cta" data-i18n="nav.cta">Get in Touch</a>
<button class="nav-toggle" id="nav-toggle" aria-label="Toggle menu" data-i18n-attr="aria-label:nav.toggleMenu">
```

- [ ] **Step 2: Add data-i18n to hero elements**

```html
<div class="hero-tag" data-i18n="hero.tag">AI Workforce Consulting</div>
<h1 class="hero-headline" data-i18n="hero.headline" data-i18n-html="true">Your team,<br><span class="em">ten times faster.</span></h1>
<p class="hero-sub" data-i18n="hero.sub">We help companies bring AI into their day-to-day work. Not as a gimmick, but as the way things actually get done. Safely, and ahead of the curve.</p>
<!-- Inside .hero-actions, on the <a> elements (text only, not the SVG): -->
<!-- The btn-primary contains text + SVG. Use a <span> wrapper for the text: -->
<a href="#contact" class="btn-primary">
  <span data-i18n="hero.ctaPrimary">Start the conversation</span>
  <svg ...></svg>
</a>
<a href="#services" class="btn-ghost" data-i18n="hero.ctaSecondary">See how we work</a>
```

**Note for buttons with SVG icons:** Wrap the text portion in a `<span data-i18n="...">` so the SVG icon is not overwritten by the hydration script. The `btn-primary` link on line 992-995 contains both text and an SVG arrow. If we put `data-i18n` on the `<a>` with `data-i18n-html="true"`, the JSON value must include the SVG. That's fragile. Instead, wrap just the text in a `<span>`.

- [ ] **Step 3: Add data-i18n to about section**

```html
<div class="section-tag" data-i18n="about.tag">Who We Are</div>
<h3 data-i18n="about.heading">We know how AI actually gets adopted.</h3>
<p data-i18n="about.p1">Everyone agrees AI matters. But most rollouts stall because they're led by people who understand the tech and not the work, or the work and not the tech.</p>
<p data-i18n="about.p2">We do both. We sit with your teams, figure out where AI genuinely helps, rebuild those workflows from scratch, and stick around until your people are comfortable running things on their own.</p>
```

- [ ] **Step 4: Add data-i18n to services section**

```html
<div class="section-tag" data-i18n="services.tag">What We Do</div>
<h2 class="section-heading" data-i18n="services.heading" data-i18n-html="true">What we<br>actually do.</h2>
<p class="section-desc" data-i18n="services.desc">Four things, and we do them well.</p>

<!-- Each service card: -->
<h3 data-i18n="services.s1.title">Workforce AI Strategy</h3>
<p data-i18n="services.s1.desc">We look at how your teams actually work...</p>
<!-- Repeat for s2, s3, s4 -->
```

The `<div class="service-number">01</div>` elements do NOT get translated (numbers are universal).

- [ ] **Step 5: Add data-i18n to approach section**

```html
<div class="section-tag" data-i18n="approach.tag">How We Work</div>
<h2 class="section-heading" data-i18n="approach.heading" data-i18n-html="true">How an engagement<br>usually goes.</h2>
<p class="section-desc" data-i18n="approach.desc">Every company is different, but the shape of the work tends to follow these four steps.</p>

<!-- Each approach step: -->
<h4 data-i18n="approach.step1.title">Assess</h4>
<p data-i18n="approach.step1.desc">We spend time with your teams...</p>
<!-- Repeat for step2, step3, step4 -->
```

- [ ] **Step 6: Add data-i18n to case study section**

```html
<div class="section-tag" data-i18n="caseStudy.tag">Case Study</div>
<h2 class="section-heading" data-i18n="caseStudy.heading" data-i18n-html="true">Same team.<br>Different output.</h2>
<p class="section-desc" data-i18n="caseStudy.desc">A software company we worked with over 16 months...</p>

<!-- Chart titles and subtitles: -->
<h4 class="chart-title" data-i18n="caseStudy.chart1.title">Cumulative code output</h4>
<p class="chart-subtitle" data-i18n="caseStudy.chart1.subtitle">Functional code only. Team size held constant.</p>

<!-- SVG text elements inside the charts need data-i18n too: -->
<text ... data-i18n="caseStudy.chart1.engaged">TRAILBLAZE ENGAGED</text>
<text ... data-i18n="caseStudy.chart1.projected">Projected</text>
<text ... data-i18n="caseStudy.chart1.rateBefore">+6k / month</text>
<text ... data-i18n="caseStudy.chart1.rateAfter">+35k / month</text>

<!-- Y-axis labels (0, 200k, 400k) stay the same in both languages. -->

<!-- Callouts: -->
<div class="callout-number" data-i18n="caseStudy.callout1.number">5.5x</div>
<div class="callout-label" data-i18n="caseStudy.callout1.label">Acceleration in delivery rate</div>

<!-- Chart 2: -->
<h4 class="chart-title" data-i18n="caseStudy.chart2.title">Features shipped per month</h4>
<p class="chart-subtitle" data-i18n="caseStudy.chart2.subtitle">Same team throughout.</p>
<text ... data-i18n="caseStudy.chart2.peak">110</text>

<div class="callout-number" data-i18n="caseStudy.callout2.beforeNumber">5/mo</div>
<div class="callout-label" data-i18n="caseStudy.callout2.beforeLabel">Before engagement</div>
<div class="callout-number" data-i18n="caseStudy.callout2.afterNumber">80/mo</div>
<div class="callout-label" data-i18n="caseStudy.callout2.afterLabel">After engagement</div>
```

- [ ] **Step 7: Add data-i18n to principles section**

```html
<div class="section-tag" data-i18n="principles.tag">Why Trailblaze</div>
<h2 class="section-heading" data-i18n="principles.heading">Why us.</h2>
<p class="section-desc" data-i18n="principles.desc">There are a lot of firms talking about AI. Here's why our clients chose us.</p>

<h4 data-i18n="principles.p1.title">We keep up so you don't have to</h4>
<p data-i18n="principles.p1.desc">AI moves every week...</p>
<!-- Repeat for p2, p3 -->
```

- [ ] **Step 8: Add data-i18n to CTA section**

```html
<div class="section-tag" ... data-i18n="contact.tag">Let's Talk</div>
<h2 class="cta-heading reveal" data-i18n="contact.heading" data-i18n-html="true">Ready to <span class="em">blaze<br>the trail</span>?</h2>
<p class="cta-sub reveal" data-i18n="contact.sub">If you're thinking about how AI fits into your company's future, we should talk.</p>
<!-- The email CTA button contains text + SVG. Wrap text in <span>: -->
<a href="mailto:hello@trailblaze.work" class="btn-primary" ...>
  <span data-i18n="contact.cta">hello@trailblaze.work</span>
  <svg ...></svg>
</a>
```

- [ ] **Step 9: Add data-i18n to footer**

```html
<span class="footer-copy" data-i18n="footer.copy">&copy; 2026 Trailblaze. All rights reserved.</span>
<!-- -->
<li><a href="mailto:hello@trailblaze.work" data-i18n="footer.contact">Contact</a></li>
```

- [ ] **Step 10: Add data-i18n-attr to meta tags**

```html
<meta name="description" data-i18n-attr="content:meta.description" content="Trailblaze helps companies deploy AI-assisted work across their workforce. Bleeding-edge best practices. 10x productivity gains.">
```

- [ ] **Step 11: Verify the page still renders correctly**

Open `index.html` in a browser. Since no hydration script exists yet, the page should look exactly the same as before (English text from the HTML content). The `data-i18n` attributes are inert. Check that no text was accidentally removed or broken by the attribute additions.

- [ ] **Step 12: Commit**

```bash
git add index.html
git commit -m "Add data-i18n attributes to all translatable elements"
```

---

### Task 6: Add language detection, preload tags, and hydration script

**Files:**
- Modify: `index.html:1-13` (head, add preloads and blocking script)
- Modify: `index.html:1270-1273` (script block, add hydration logic)

- [ ] **Step 1: Add preload tags in `<head>`**

Insert after the font preload tags (after line 12, before the Google Fonts stylesheet link):

```html
  <link rel="preload" href="i18n/en.json" as="fetch" crossorigin>
  <link rel="preload" href="i18n/fr.json" as="fetch" crossorigin>
```

- [ ] **Step 2: Add blocking language detection script in `<head>`**

Insert right after the `<meta name="description">` tag (after line 7), before the favicon link:

```html
  <script>
    // Resolve language before paint. Blocking on purpose.
    (function() {
      var stored = null;
      try { stored = localStorage.getItem('trailblaze-lang'); } catch(e) {}
      var lang = stored || (navigator.language && navigator.language.slice(0,2) === 'fr' ? 'fr' : 'en');
      document.documentElement.lang = lang;
      document.documentElement.setAttribute('data-lang', lang);
    })();
  </script>
```

This sets `<html lang="fr" data-lang="fr">` (or `en`) synchronously before the browser paints.

- [ ] **Step 3: Add the hydration script**

Replace the existing font-loading code at the top of the `<script>` block (lines 1271-1273) with:

```javascript
    /* ── i18n hydration ── */
    (function() {
      var lang = document.documentElement.getAttribute('data-lang') || 'en';
      var cache = {};

      function resolve(obj, path) {
        return path.split('.').reduce(function(o, k) { return o && o[k]; }, obj);
      }

      function hydrate(translations) {
        cache[lang] = translations;
        document.title = resolve(translations, 'meta.title') || document.title;

        document.querySelectorAll('[data-i18n]').forEach(function(el) {
          var val = resolve(translations, el.getAttribute('data-i18n'));
          if (val == null) return;
          if (el.hasAttribute('data-i18n-html')) {
            el.innerHTML = val;
          } else {
            el.textContent = val;
          }
        });

        document.querySelectorAll('[data-i18n-attr]').forEach(function(el) {
          el.getAttribute('data-i18n-attr').split(',').forEach(function(pair) {
            var parts = pair.trim().split(':');
            var attr = parts[0];
            var key = parts[1];
            var val = resolve(translations, key);
            if (val != null) el.setAttribute(attr, val);
          });
        });
      }

      function loadLang(newLang) {
        lang = newLang;
        document.documentElement.lang = lang;
        document.documentElement.setAttribute('data-lang', lang);
        try { localStorage.setItem('trailblaze-lang', lang); } catch(e) {}

        // 150ms fade transition for language switch (not initial load)
        document.body.style.transition = 'opacity 0.15s ease';
        document.body.style.opacity = '0';

        function applyAndFadeIn(translations) {
          hydrate(translations);
          requestAnimationFrame(function() {
            document.body.style.opacity = '1';
          });
        }

        if (cache[lang]) {
          applyAndFadeIn(cache[lang]);
          return;
        }

        fetch('i18n/' + lang + '.json')
          .then(function(r) { return r.json(); })
          .then(applyAndFadeIn);
      }

      // Expose for the language switcher
      window.__setLang = loadLang;

      // Initial hydration
      fetch('i18n/' + lang + '.json')
        .then(function(r) { return r.json(); })
        .then(hydrate);
    })();

    /* ── Wait for fonts before showing page ── */
    document.fonts.ready.then(function() { document.body.style.opacity = '1'; });
    setTimeout(function() { document.body.style.opacity = '1'; }, 2000);
```

**Key details:**
- `cache` object stores loaded translations so switching back doesn't re-fetch
- `resolve()` traverses nested keys like `"services.s1.title"`
- `hydrate()` handles `textContent`, `innerHTML`, and attribute injection
- `window.__setLang` is the public API for the language switcher
- The font-loading code stays but is moved below the i18n setup
- SVG `<text>` elements work with `textContent` just like HTML elements

- [ ] **Step 4: Test language detection**

1. Open `index.html` in a browser. If your browser language is English, the English text should display.
2. Open DevTools console, run `window.__setLang('fr')`. All text should switch to French.
3. Run `window.__setLang('en')`. All text should switch back.
4. Refresh the page. It should remember the last language from `localStorage`.
5. Clear `localStorage` (`localStorage.removeItem('trailblaze-lang')`), refresh, and verify it falls back to browser language detection.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "Add i18n hydration with language detection and preloads"
```

---

### Task 7: Add the language switcher UI

**Files:**
- Modify: `index.html` (CSS: add after CTA styles ~line 831; HTML: add before `</body>` ~line 1267; JS: wire up click handlers in the script block)

- [ ] **Step 1: Add CSS for the language switcher**

Insert in the `<style>` block (after the footer styles, before the scroll animations section):

```css
/* ── Language switcher ── */
.lang-switcher {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 500;
  display: flex;
  gap: 2px;
  background: rgba(26, 26, 30, 0.9);
  border: 1px solid var(--border-subtle);
  border-radius: 20px;
  padding: 3px 4px;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.lang-switcher button {
  font-family: var(--font-body);
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  padding: 4px 10px;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  background: transparent;
  color: var(--text-muted);
  transition: all 0.15s ease;
  min-width: 36px;
  min-height: 28px;
}

.lang-switcher button.active {
  background: rgba(232, 154, 46, 0.15);
  color: var(--text-primary);
}

.lang-switcher button:not(.active):hover {
  color: var(--text-secondary);
}

@media (max-width: 768px) {
  .lang-switcher {
    bottom: 1rem;
    right: 1rem;
  }

  .lang-switcher button {
    padding: 6px 12px;
    min-height: 32px;
  }
}
```

- [ ] **Step 2: Add the switcher HTML**

Insert just before the `<!-- Footer -->` comment (or just before `</body>`):

```html
  <!-- Language switcher -->
  <div class="lang-switcher" id="lang-switcher">
    <button data-lang="en" aria-label="English">EN</button>
    <button data-lang="fr" aria-label="Fran\u00e7ais">FR</button>
  </div>
```

In the actual HTML, use the literal character: `aria-label="Français"`.

- [ ] **Step 3: Add JS to wire up the switcher**

Add this in the `<script>` block, after the mobile nav toggle code:

```javascript
    /* ── Language switcher ── */
    (function() {
      var switcher = document.getElementById('lang-switcher');
      var buttons = switcher.querySelectorAll('button');

      function updateActive() {
        var current = document.documentElement.getAttribute('data-lang') || 'en';
        buttons.forEach(function(btn) {
          btn.classList.toggle('active', btn.getAttribute('data-lang') === current);
        });
      }

      buttons.forEach(function(btn) {
        btn.addEventListener('click', function() {
          var newLang = btn.getAttribute('data-lang');
          if (newLang !== document.documentElement.getAttribute('data-lang')) {
            window.__setLang(newLang);
            updateActive();
          }
        });
      });

      updateActive();
    })();
```

- [ ] **Step 4: Test the switcher**

1. Open the page. The floating pill should appear in the bottom-right corner.
2. The active language should be highlighted based on detection.
3. Click `FR`. All text should switch to French. The `FR` button should become active.
4. Click `EN`. All text should switch back. The `EN` button should become active.
5. Refresh the page. The language preference should persist.
6. Test on mobile viewport (resize to < 768px). The pill should have larger touch targets.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "Add floating language switcher pill"
```

---

### Task 8: Final verification and cleanup

**Files:**
- All files (read-only verification)

- [ ] **Step 1: Full English walkthrough**

Set language to English. Scroll through every section and verify:
- All text displays correctly
- No missing translations (no blank spots)
- All animations still work (scroll reveals, ember particles, shimmer)
- Nav links still work (anchor scrolling)
- Email links still work
- Mobile menu still works

- [ ] **Step 2: Full French walkthrough**

Switch to French. Scroll through every section and verify:
- All text is in French with proper accents
- No English text leaking through
- The CTA heading reads "Prêts à ouvrir la voie ?" with the gradient on "ouvrir la voie"
- The case study charts show French labels
- The callout numbers use French conventions (5,5x, 5/mois, 80/mois)
- SVG chart text elements updated correctly

- [ ] **Step 3: Test language detection**

1. Clear `localStorage`
2. Set browser language to French (or use DevTools override)
3. Refresh. The page should load in French.
4. Set browser language to English, clear localStorage, refresh. Should load in English.
5. Set browser language to German (or any non-French), clear localStorage, refresh. Should default to English.

- [ ] **Step 4: Test the no-JS fallback**

Disable JavaScript in the browser. Reload the page. It should display the English content from the HTML (the `data-i18n` default text). The language switcher will be non-functional but that's expected.

- [ ] **Step 5: Check performance**

Open DevTools Network tab. Verify:
- Both JSON files are preloaded (check the waterfall; they should start loading early)
- No flash of untranslated content on a hard refresh
- The JSON files are small (< 5KB each)

- [ ] **Step 6: Validate HTML**

```bash
# Quick check: no unclosed tags or obvious issues
python3 -c "
from html.parser import HTMLParser
import sys
parser = HTMLParser()
with open('index.html') as f:
    parser.feed(f.read())
print('HTML parsed OK')
"
```

- [ ] **Step 7: Final commit (if any cleanup was needed)**

```bash
git add -A
git commit -m "Final cleanup for bilingual implementation"
```

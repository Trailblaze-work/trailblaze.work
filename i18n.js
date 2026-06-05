/* ============================================================
   TRAILBLAZE — browser-language i18n (FR / EN)
   Detects navigator.language on load; if French, swaps all
   data-i18n / data-i18n-html / data-i18n-aria elements and
   meta tags. English is the HTML default — no work needed.
   ============================================================ */
(function () {
  'use strict';

  // Active language: a saved user choice wins; otherwise detect from the
  // browser's "Preferred languages" list. navigator.languages[0] is more
  // reliable than navigator.language (which can reflect the UI locale).
  function detectLang() {
    try {
      var stored = localStorage.getItem('tb-lang');
      if (stored === 'fr' || stored === 'en') return stored;
    } catch (e) {}
    var langs = (navigator.languages && navigator.languages.length)
      ? navigator.languages
      : [navigator.language || navigator.userLanguage || 'en'];
    return String(langs[0] || 'en').toLowerCase().indexOf('fr') === 0 ? 'fr' : 'en';
  }

  var t = {
    meta: {
      title: 'Trailblaze · L\'adoption de l\'IA pour toutes vos équipes',
      description: 'Trailblaze aide vos équipes à tirer une vraie valeur des outils IA que vous payez déjà. Ateliers, accompagnement et workflows pour les équipes tech, produit, design et sales.',
      og_title: 'Vous payez pour l\'IA. On s\'assure qu\'elle rapporte.',
      og_description: 'L\'adoption de l\'IA en pratique, pour chaque équipe. On rend vos équipes tech, produit, design et sales vraiment efficaces avec les outils IA que vous payez déjà.',
      og_image_alt: 'Trailblaze. Vous payez pour l\'IA. On s\'assure qu\'elle rapporte.',
      twitter_image_alt: 'Trailblaze. L\'adoption de l\'IA pour toutes vos équipes.'
    },
    nav: {
      how: 'Comment ça marche',
      case: 'Étude de cas',
      why: 'Pourquoi nous',
      team: 'L\'équipe',
      pricing: 'Tarifs',
      faq: 'FAQ',
      email: 'Nous écrire',
      email_aria: 'Nous écrire',
      cta_long: 'Réserver un appel diagnostic',
      cta_short: 'Réserver un appel'
    },
    hero: {
      h1: 'Vous payez pour l\'IA. On s\'assure qu\'elle rapporte.',
      subhead: 'On construit de vrais produits avec l\'IA depuis son arrivée, on connaît les patterns et les pièges. On fait progresser chaque équipe rapidement, pour que l\'investissement soit rentable.'
    },
    cta: {
      book: 'Réserver un appel diagnostic',
      h2: 'Identifiez là où l\'IA va vraiment faire bouger les choses pour vos équipes.',
      lede: 'Réservez un appel diagnostic. Sans engagement.'
    },
    manifesto: {
      quote: 'L\'IA ne rend pas vos équipes plus rapides. Ce sont les habitudes et les workflows autour d\'elle qui le font, et ceux-là se <span class="hl">construisent, ils ne s\'achètent pas</span>. C\'est ça, le travail.'
    },
    problem: {
      h2: 'La plupart des équipes butent sur les mêmes obstacles.',
      lede: 'Mettre en place les outils prend une semaine. En tirer un vrai usage prend beaucoup plus longtemps, parce que l\'IA est un terrain nouveau, sans carte. La plupart des équipes se retrouvent bloquées aux mêmes quatre endroits.',
      c1_h3: 'Difficile à maîtriser',
      c1_p: 'Utiliser l\'IA sur des travaux complexes est dur à apprendre, et les bons conseils se noient dans le bruit.',
      c2_h3: 'Savoir quoi en faire',
      c2_p: 'Identifier les bons cas d\'usage est difficile, encore plus dans le produit, les ventes et le design. Les vraies opportunités sont faciles à rater.',
      c3_h3: 'Les gens décrochent',
      c3_p: 'Quelques-uns y arrivent seuls. Les autres ont besoin d\'accompagnement, et sans lui, l\'écart se creuse.',
      c4_h3: 'Des progrès invisibles',
      c4_p: 'L\'adoption est difficile à mesurer. Sans moyen de la suivre, impossible de savoir ce qui fonctionne ou qui a besoin d\'aide.'
    },
    tools: {
      h2: 'Les instruments qu\'on apporte avec nous',
      lede: 'On développe des logiciels pour que l\'adoption soit mesurable et que le workflow s\'intègre dans la façon dont votre équipe travaille déjà.',
      c1_h3: 'Dashboard d\'adoption & de vélocité',
      c1_p: 'Suit l\'adoption de l\'IA dans l\'équipe et son impact sur la livraison, pour que les progrès soient visibles et les décisions fondées sur des données, pas des intuitions.',
      c2_h3: 'Journalisation & reporting des prompts',
      c2_p: 'Capture ce que les gens promptent et produisent réellement, pour que nos analyses et recommandations partent de la pratique réelle, pas d\'anecdotes.',
      c3_h3: 'Outils sur mesure',
      c3_p: 'Quand un workflow nécessite ses propres outils, on les conçoit et les développe, adaptés à la façon dont votre entreprise fonctionne vraiment.'
    },
    how: {
      h2: 'Comment se passe une collaboration avec nous',
      lede: 'Pas de longues propositions, pas d\'engagement lourd. On se parle d\'abord, puis on travaille aux côtés de votre équipe, puis on reste disponibles aussi longtemps que vous en avez besoin.',
      s1_h3: 'On se parle',
      s1_p: 'Un échange gratuit pour comprendre votre équipe : où vous en êtes, vos points de douleur, et là où l\'IA vous aiderait le plus.',
      s2_h3: 'On travaille avec votre équipe',
      s2_p: 'On travaille aux côtés de votre équipe : ateliers, supports, et présence dans vos réunions. On suit les progrès et met en place les outils au fur et à mesure.',
      s3_h3: 'Accompagnement continu',
      s3_p: 'On vous remet les outils, on suit vos progrès à distance, et on reste disponibles pour vous aider quand vous en avez besoin.',
      close: 'Même méthode, quelle que soit l\'équipe avec laquelle vous commencez.'
    },
    case: {
      h2: 'La même équipe.<br />Un output différent.',
      lede: 'Voici notre propre équipe d\'ingénierie sur seize mois. On pratique ce qu\'on enseigne. L\'effectif est resté stable. La façon dont on livrait a complètement changé.',
      c1_h3: 'Production de code cumulée',
      c1_sub: 'Code fonctionnel uniquement. Taille d\'équipe constante.',
      c1_svgtitle: 'Production de code cumulée : ~6k lignes/mois avant Trailblaze, ~35k/mois après, 5,5x plus rapide.',
      c1_marker: 'TRAILBLAZE ENGAGÉ',
      c1_projected: 'Projeté',
      c1_caption: 'Production de code fonctionnel cumulée par mois. Trailblaze engagé au mois 8 (48k lignes). Taille d\'équipe constante.',
      c1_callout: 'Accélération du rythme de livraison',
      c2_h3: 'Fonctionnalités livrées par mois',
      c2_sub: 'Même équipe tout au long.',
      c2_svgtitle: 'Fonctionnalités livrées par mois : ~5 avant, ~80 après l\'engagement.',
      c2_sr: 'Les fonctionnalités livrées par mois sont passées d\'environ 5 par mois avant l\'engagement à environ 80 par mois après, avec un pic à 110.',
      c2_before: 'Avant l\'engagement',
      c2_after: 'Après l\'engagement'
    },
    why: {
      h2: 'Pourquoi nous.',
      lede: 'Beaucoup de cabinets parlent d\'IA. Voilà ce qui est vraiment différent quand on travaille avec nous.',
      c1_h3: 'On utilise ce qu\'on enseigne',
      c1_p: 'On fait tourner 100 % de notre développement à l\'IA depuis début 2025. Chaque recommandation qu\'on fait, on l\'utilise nous-mêmes, chaque jour, sur de vrais projets en production.',
      c2_h3: 'Des praticiens IA-first chevronnés',
      c2_p: 'Nos gens sont des CTOs, CPOs et ICs très seniors. Chacun d\'eux livre du code en production IA-first, chaque jour, depuis plus d\'un an.',
      c3_h3: 'Socle ingénierie, prêts full-stack',
      c3_p: 'L\'ingénierie est là où on va le plus loin, et on apporte des experts dédiés pour le design, le produit, le marketing et les ventes quand votre travail le demande.'
    },
    team: {
      h2: 'L\'équipe est la preuve.',
      lede: 'Chacun de nous est un expert senior dans son domaine. Ensemble on couvre l\'ingénierie, le produit, le design et les ventes, et vous travaillez directement avec nous. Pas de juniors.',
      maxime_disc: 'Product',
      maxime_short: 'Chief Product Officer chez PMU, ex-responsable produit à la Digital Factory d\'Intermarché (140 personnes). Il intègre l\'IA générative dans la façon dont les grandes entreprises construisent leurs produits.',
      maxime_long: 'Chief Product Officer chez PMU, et avant cela responsable produit chez Intermarché, où il siégeait au comité exécutif digital et pilotait une Digital Factory de 140 personnes. Il a dirigé la transformation produit et digitale de grands groupes français pendant plus d\'une décennie, de La Poste à Rue du Commerce. Son focus aujourd\'hui : intégrer l\'IA générative dans la façon dont les grandes équipes construisent leurs produits et servent leurs clients.',
      maxime_linkedin: 'Maxime sur LinkedIn',
      gilles_disc: 'Engineering Backend',
      gilles_short: 'CTO de Layer. Il a construit l\'infrastructure qui alimente plus d\'un milliard de visiteurs mensuels sur Wikipédia, et pilote aujourd\'hui une codebase de 450k lignes presque entièrement avec l\'IA.',
      gilles_long: 'CTO de Layer, avec plus de vingt ans à la tête d\'équipes d\'ingénierie distribuées. Chez Wikipédia, il a construit l\'infrastructure core servant plus d\'un milliard de visiteurs par mois, et représenté la Fondation Wikimédia au W3C, l\'organisme qui fixe les standards du web, aux côtés des grands éditeurs de navigateurs. Son équipe fait tourner aujourd\'hui une codebase de 450 000 lignes presque entièrement avec l\'IA.',
      gilles_linkedin: 'Gilles sur LinkedIn',
      guillaume_disc: 'Sales',
      guillaume_short: 'Spécialiste B2B sales et go-to-market. Il ouvre de nouveaux marchés, s\'intègre dans une équipe pour identifier ce qui freine le moteur commercial, et le corrige, de plus en plus avec l\'IA.',
      guillaume_long: 'Spécialiste B2B sales et go-to-market, formé à l\'EDHEC et à Centrale Lille. Il a ouvert de nouveaux marchés en Europe, contribué à faire passer un startup de 40k€ à 70k€ MRR en 90 jours, et lancé une ligne B2B qui a signé 150+ clients en dix mois. Il s\'intègre dans une équipe commerciale, voit où elle va, et retire ce qui la freine — de plus en plus avec l\'IA.',
      guillaume_linkedin: 'Guillaume sur LinkedIn',
      glauber_disc: 'Design',
      glauber_short: 'Head of Design chez Layer, où il co-pilote aussi le produit. Il a cofondé Aprender Design, une école de design très appréciée, et conçoit avec l\'IA.',
      glauber_long: 'Head of Design chez Layer, où il co-pilote aussi le produit, et Principal Product Designer chez Expa, aux côtés d\'investisseurs de premier plan. Il a cofondé Aprender Design, une école de design très appréciée avec des milliers d\'alumni dans le monde. Il croit que si vous savez designer une chose, vous savez tout designer, et il applique ça aujourd\'hui au design avec l\'IA.',
      glauber_linkedin: 'Glauber sur LinkedIn',
      daria_disc: '3D & Tech Art',
      daria_short: 'Artiste 3D et technique qui a livré des jeux et des expériences VR, d\'un life sim co-op sur Steam à de la formation VR temps réel. Elle développe ses propres outils IA pour Blender et Unreal, et couvre la 3D, le QA et le vibe engineering.',
      daria_long: 'Artiste 3D et technique formée entre le Royaume-Uni et la France, du design graphique et de l\'illustration à Hertfordshire à l\'art jeux à ArtFX et Objectif 3D. Elle a modélisé, texturé et animé dans l\'industrie du jeu vidéo, du life sim co-op Vivaland chez HiveFive Interactive aux expériences de formation VR temps réel. Elle développe et publie ses propres outils assistés par IA pour Blender, Houdini et Unreal, et chez Trailblaze elle couvre la 3D, le QA et le vibe engineering.',
      daria_linkedin: 'Daria sur LinkedIn',
      mathias_disc: 'Engineering Frontend',
      mathias_short: 'Fondateur en série d\'applications primées par Apple. Il a développé seul les apps iOS de Hyper et Mighty, et construit avec Claude Code depuis ses premières versions.',
      mathias_long: 'Fondateur en série avec plus d\'une décennie à livrer des apps iOS. Il a développé seul les apps iOS de Hyper, nommée parmi les Best of Apple 2015 et 2016, #1 Best New App dans plus de 100 pays et Red Dot Winner, acquise en moins d\'un an, et Mighty, Apple Editor\'s Choice. Il construit avec Claude Code depuis ses premières versions, et l\'utilise aujourd\'hui en production chez Layer.',
      mathias_linkedin: 'Mathias sur LinkedIn'
    },
    clients: {
      h2: 'Ils nous font confiance',
      lede: 'Des équipes qui nous ont rejoints pour rendre l\'IA réelle dans leur façon de construire et de livrer.',
      backupta_desc: 'Backupta développe des solutions de sauvegarde automatisées et sécurisées pour les entreprises. On a aidé chaque équipe à passer à des workflows IA-first et développé des outils personnalisés alimentés par l\'IA qui tournent aujourd\'hui dans toute leur organisation.',
      lyvoc_desc: 'Lyvoc est un intégrateur en cybersécurité qui déploie Okta, Drata et Vanta en Europe. On a formé leurs équipes à travailler avec l\'IA à tous les niveaux et développé des outils sur mesure qui accélèrent leur façon de livrer pour leurs clients.',
      alma_desc: 'Alma est un acteur majeur des paiements en Europe, proposant des solutions de paiement en plusieurs fois et différé à travers le continent. On travaille avec leurs équipes ingénierie pour intégrer l\'IA en profondeur dans la façon dont elles conçoivent, développent et livrent.',
      visit: 'Visiter le site →'
    },
    pricing: {
      h2: '<span class="em">Un tarif journalier fixe par expert.</span> Sans mystère, sans devis gonflé.',
      lede: 'Le premier échange est gratuit. Ensuite vous ne payez que pour les jours où on travaille. Si le périmètre grandit, vous approuvez plus de jours. Sans engagement.'
    },
    faq: {
      h2: 'Les questions qu\'un acheteur sceptique pose.',
      q1: 'En quoi êtes-vous différents d\'un intégrateur (ESN) ?',
      a1: 'Un intégrateur construit ce qu\'on lui demande, puis part. Nous, on rend votre propre équipe capable de construire avec l\'IA, pour que la compétence reste en interne.',
      q2: 'Pourquoi ne pas recruter en interne ?',
      a2: 'Recruter des talents IA seniors est lent et coûteux. On apporte ce niveau maintenant, on transfère la compétence, et on laisse votre équipe autonome. Pas de CDI supplémentaire.',
      q3: 'En quoi est-ce différent d\'un grand cabinet de conseil ?',
      a3: 'Un grand cabinet envoie un junior avec un deck PowerPoint. Vous avez des experts seniors qui s\'assoient avec votre équipe et font le vrai travail. Plus petit, plus rapide, les mains dans le cambouis.',
      q4: 'Et si on est de vrais débutants avec l\'IA ?',
      a4: 'C\'est le point de départ idéal. Les équipes qu\'on aide le plus ont déjà les outils, mais personne pour leur montrer comment bien s\'en servir.',
      q5: 'Notre code et nos données sont-ils en sécurité ?',
      a5: 'On travaille dans votre propre environnement et on signe un NDA. Rien n\'en sort sans votre accord, et on vous aide à choisir des outils compatibles avec vos règles de sécurité.',
      q6: 'Dans combien de temps peut-on démarrer ?',
      a6: 'On peut avoir un premier appel dans la semaine, et démarrer quelques jours après notre accord, juste le temps de préparer vos supports.'
    }
  };

  var current = detectLang();
  var textEls, htmlEls, ariaEls, enTitle, toggleBtn;
  var metaSpecs = [
    { attr: 'name', key: 'description', fr: t.meta.description },
    { attr: 'property', key: 'og:title', fr: t.meta.og_title },
    { attr: 'property', key: 'og:description', fr: t.meta.og_description },
    { attr: 'property', key: 'og:locale', fr: 'fr_FR' },
    { attr: 'property', key: 'og:image:alt', fr: t.meta.og_image_alt },
    { attr: 'name', key: 'twitter:title', fr: t.meta.og_title },
    { attr: 'name', key: 'twitter:description', fr: t.meta.og_description },
    { attr: 'name', key: 'twitter:image:alt', fr: t.meta.twitter_image_alt }
  ];

  // Snapshot the English defaults from the DOM so we can switch back to them.
  function capture() {
    var i;
    textEls = document.querySelectorAll('[data-i18n]');
    for (i = 0; i < textEls.length; i++) textEls[i].__en = textEls[i].textContent;
    htmlEls = document.querySelectorAll('[data-i18n-html]');
    for (i = 0; i < htmlEls.length; i++) htmlEls[i].__en = htmlEls[i].innerHTML;
    ariaEls = document.querySelectorAll('[data-i18n-aria]');
    for (i = 0; i < ariaEls.length; i++) ariaEls[i].__en = ariaEls[i].getAttribute('aria-label');
    enTitle = document.title;
    for (i = 0; i < metaSpecs.length; i++) {
      var m = document.querySelector('meta[' + metaSpecs[i].attr + '="' + metaSpecs[i].key + '"]');
      metaSpecs[i].el = m;
      metaSpecs[i].en = m ? m.getAttribute('content') : null;
    }
  }

  function applyLang(lang) {
    var i, el, val, fr = lang === 'fr';
    document.documentElement.lang = lang;

    for (i = 0; i < textEls.length; i++) {
      el = textEls[i];
      val = fr ? get(el.getAttribute('data-i18n')) : el.__en;
      if (val != null) el.textContent = val;
    }
    for (i = 0; i < htmlEls.length; i++) {
      el = htmlEls[i];
      val = fr ? get(el.getAttribute('data-i18n-html')) : el.__en;
      if (val != null) el.innerHTML = val;
    }
    for (i = 0; i < ariaEls.length; i++) {
      el = ariaEls[i];
      val = fr ? get(el.getAttribute('data-i18n-aria')) : el.__en;
      if (val != null) el.setAttribute('aria-label', val);
    }

    document.title = fr ? t.meta.title : enTitle;
    for (i = 0; i < metaSpecs.length; i++) {
      if (metaSpecs[i].el) metaSpecs[i].el.setAttribute('content', fr ? metaSpecs[i].fr : metaSpecs[i].en);
    }

    current = lang;
    renderToggle();
  }

  // Show the current language only; clicking switches to the other.
  function renderToggle() {
    if (!toggleBtn) return;
    toggleBtn.textContent = current.toUpperCase();
    var other = current === 'fr' ? 'English' : 'Français';
    toggleBtn.setAttribute('aria-label', 'Change language to ' + other);
    toggleBtn.setAttribute('title', other);
  }

  function setLang(lang) {
    try { localStorage.setItem('tb-lang', lang); } catch (e) {}
    applyLang(lang);
  }

  function initToggle() {
    toggleBtn = document.querySelector('.lang-toggle');
    if (!toggleBtn) return;
    toggleBtn.addEventListener('click', function (ev) {
      ev.preventDefault();
      setLang(current === 'fr' ? 'en' : 'fr');
    });
  }

  function get(key) {
    var parts = key.split('.');
    var obj = t;
    for (var i = 0; i < parts.length; i++) {
      if (obj == null) return undefined;
      obj = obj[parts[i]];
    }
    return obj;
  }

  function init() {
    capture();
    initToggle();
    // English is the HTML default — only rewrite the DOM when French is active.
    if (current === 'fr') applyLang('fr');
    else renderToggle();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

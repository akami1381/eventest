## Plan: Hero clasic split (text stanga / mockup dreapta)

### Ce schimbam
In `src/pages/Landing.tsx`, sectiunea hero existenta (cu floating cards / confetti / compozitie animata) e inlocuita cu un layout clasic SaaS pe 2 coloane.

### Layout (desktop ≥ lg)
```
┌─ container max-w-7xl, padding generos sus/jos ─────────────┐
│  ┌── stanga (col-span 6) ──┐   ┌── dreapta (col-span 6) ─┐ │
│  │ Eyebrow badge (pill)    │   │                         │ │
│  │ H1 mare (Bricolage)     │   │   Mockup telefon        │ │
│  │ Subtitlu (DM Sans)      │   │   (phone-mockup-v2.png) │ │
│  │ [CTA primar] [CTA sec.] │   │   cu glow subtil rose   │ │
│  │ trust line mica         │   │                         │ │
│  └─────────────────────────┘   └─────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```
Mobile: stack vertical — text sus, mockup dedesubt, totul aliniat la stanga (nu centrat), conform regulii mobile-first.

### Continut (pastram tonul actual)
- Eyebrow: „Gratuit pentru totdeauna” (mic pill cu primary/10)
- H1: headline-ul existent din hero (re-folosit, fara rescriere)
- Subtitlu: copy-ul existent
- CTA primar: „Creaza invitatie” → `/auth?mode=signup`
- CTA secundar (ghost / outline pill): „Vezi modele” → `#models`
- Trust line: „Fara card. Fara limite. Configurare in 2 minute.”

### Stil
- Fara borduri, conform regulii borderless.
- CTA-uri pill (`rounded-full`), primar pe `bg-foreground` (dark) cum e in design system.
- Mockup: `object-contain`, drop-shadow soft + un blur radial `bg-primary/20` in spate pentru accent rose.
- Pastram fontul: H1 cu `font-display tracking-[-0.02em]`, dimensiune `text-5xl lg:text-7xl`.
- Animatie discreta la mount: fade+slide-up pe text (Framer Motion), fade pe mockup. Fara confetti/floating cards.

### Ce dispare
- Compozitia veche cu floating cards, confetti si elemente animate complexe din hero.
- Restul paginii (features, models, pricing, footer) ramane neatins.

### Memory
Actualizez `mem://style/landing-page` ca sa reflecte noul hero clasic split (fara floating cards / confetti) si scot referintele invechite.

### Fisiere atinse
- `src/pages/Landing.tsx` (doar blocul hero)
- `mem://style/landing-page` + `mem://index.md` (descriere actualizata)

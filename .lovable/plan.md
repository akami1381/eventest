# Etapa 1.5 + Etapa 2 — Preview live + Wizard multi-step

## Partea A — Preview cu câmpuri editabile (toate modelele)

Înlocuiesc dialog-ul actual din `/templates` (care arată doar o poză) cu un **preview interactiv**: în stânga formular cu câmpuri editabile, în dreapta randarea live a invitației.

**Componentă nouă `InvitationRenderer`** care primește `{ template, category, data }` și randează:
- `minimal` — centrat, tipografic
- `split` — imagine stânga / detalii dreapta
- `landing` — hero cu overlay
- (extensibil pentru viitoarele layout-uri florale, pastel etc.)

**Câmpuri editabile** (subset comun, restul ascuns sub "Mai multe"):
- Titlu, Subtitlu, Data + Ora, Locație, Mesaj/Descriere, Nume sărbătoriți (pentru wedding/baptize), Culoare accent.

Folosit în 3 locuri:
1. Modal preview din `/templates` (read-only feel, dar editabil ca demo)
2. Wizard (etapa 2) — preview live lângă fiecare pas
3. Pagina publică a invitației (viitor)

## Partea B — Wizard multi-step pe categorii

**Rută nouă**: `/dashboard/invitations/new?template=:id` (înlocuiește `events/create` pentru fluxul nou; cel vechi rămâne pentru evenimente "registration").

**Pași Wedding & Wedding+Baptize** (7):
1. Informații generale (titlu, mesaj de bun-venit, dată)
2. Detalii sărbătoriți (nume miri / nași / părinți / nou-născut)
3. Locații (ceremonie religioasă + petrecere — fiecare cu adresă, oră, hartă)
4. Personalizare avansată (culoare accent, font, imagine fundal, secțiuni on/off: program, dress code, cadouri, galerie)
5. Tip invitație (Basic / Standard / Premium — descrise mai jos)
6. Setări invitați (RSVP da/nu, +1, meniu, deadline confirmare, mesaj custom)
7. Plată (sumar + checkout; deocamdată buton "Continuă" inactiv → vine în Etapa 3)

**Pași Baptize** (6): 1-Info, 2-Detalii copil & nași, 3-Locații, 4-Personalizare, 5-Tip, 6-Setări invitați, 7-Plată.

**Pași Birthday / Celebration / Holiday / Business** (5):
1. Informații generale
2. Locație
3. Personalizare
4. Tip invitație + setări invitați (combinat)
5. Plată

**Layout wizard**:
- Stânga (lg:1/2): header cu progres pill + numele pasului, formular, butoane "Înapoi"/"Continuă".
- Dreapta (lg:1/2, sticky): `InvitationRenderer` live cu datele introduse.
- Mobil: preview deasupra într-un accordion "Vezi previzualizare".

**State**: `useReducer` local + `localStorage` (`invitation-draft-${templateId}`) ca să nu piardă datele. Salvarea finală în DB vine în Etapa 2.5 (după ce extindem schema `events`).

## Partea C — DB (Etapa 2.5, separat — DOAR dacă spui ok)

Nu fac migrație în acest loop. Voi propune separat:
```
ALTER TABLE events ADD COLUMN category text,
  ADD COLUMN celebrants jsonb DEFAULT '[]',
  ADD COLUMN locations jsonb DEFAULT '[]',
  ADD COLUMN invitation_tier text,
  ADD COLUMN guest_settings jsonb DEFAULT '{}',
  ADD COLUMN payment_status text DEFAULT 'unpaid';
```

## Fișiere

**Noi**:
- `src/components/invitation/InvitationRenderer.tsx` — randare pe layout
- `src/components/invitation/InvitationPreviewEditor.tsx` — split form+preview pentru modal
- `src/components/invitation/types.ts` — `InvitationData`, defaults pe categorie
- `src/components/wizard/WizardShell.tsx` — layout + progres + nav
- `src/components/wizard/steps/*` — un fișier per pas (GeneralInfoStep, CelebrantsStep, LocationsStep, CustomizationStep, InvitationTierStep, GuestSettingsStep, PaymentStep)
- `src/pages/dashboard/InvitationWizard.tsx` — alege configurarea de pași în funcție de `category`
- `src/data/wizardConfigs.ts` — mapare `category → steps[]`

**Modificate**:
- `src/pages/Templates.tsx` — modalul folosește `InvitationPreviewEditor`
- `src/App.tsx` — rută nouă `/dashboard/invitations/new`
- `src/data/templates.ts` — adaug `defaultData` pe template (titluri demo realiste)
- `mem://features/template-catalog` — actualizez să menționez preview interactiv
- `mem://features/event-wizard` → înlocuit cu `mem://features/invitation-wizard`

## Ce NU fac în acest loop
- Plata Stripe (Etapa 3)
- Migrația DB (Etapa 2.5)
- Layout-uri vizuale noi (floral, pastel) — folosim cele 3 existente, dar cu mai multe variante de culoare
- Pagina publică a invitației (vine după ce salvăm în DB)

## Confirmare necesară
1. Ok cu cele 7/6/5 pași pe categorii? Vrei să unific totul la un singur set de pași?
2. Pentru Tip invitație — Basic / Standard / Premium ca în pricing-ul de pe landing, ok? Sau alte denumiri?
3. Salvăm draft-ul doar în localStorage acum (rapid) sau aștepți migrația DB și salvăm direct în Supabase (mai sigur, dar mai mult de muncă)?

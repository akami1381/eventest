
# Pivot: eventspark → platformă de invitații

Schimbare majoră de scope. Recomand să livrăm în **3 etape separate** (fiecare în câte un loop), ca să putem testa pe parcurs și să nu spargem ce funcționează.

---

## Etapa 1 — Landing + Catalog de modele (UI only)

Scop: aspect "Paperless Post" pentru landing și pagina de modele. Fără logică nouă de DB.

1. **Landing hero**
   - Elimin eyebrow "Gratuit pentru totdeauna".
   - Înlocuiesc textul subliniei cu unul orientat pe invitații (nuntă, botez, aniversare, corporate).
   - CTA principal: "Răsfoiește modele" → `/templates`. CTA secundar: "Creează cont".

2. **Pagină nouă `/templates`** (catalog public)
   - Tabs categorii orizontale, pill-shape: **All, Birthday, Wedding, Business, Celebration, Holiday, Baptize, Wedding + Baptize**.
   - Grid de carduri model (imagine flyer + titlu + categorie).
   - Două butoane pe card: **"Previzualizează"** (deschide modal/route `/templates/:id/preview` cu invitația randată full-screen) și **"Folosește acest model"** (→ `/auth?mode=signup&template=:id` dacă neautentificat, altfel → wizard).
   - Secțiunea "Modele populare" de pe landing devine un teaser scurt (3-4 carduri) cu link "Vezi toate modelele".

3. **Update memorie**
   - Elimin constraint-ul `mem://business/pricing-model` "strictly free".
   - Actualizez `mem://index.md` (Core + lista templates extinsă).
   - Adaug `mem://features/template-catalog`.

**Notă:** modelele rămân deocamdată cele 3 existente (Minimal, Split, Landing), dar le **etichetez pe categorii** și pregătesc structura. Adăugarea de design-uri noi (wedding floral, baptize pastel etc.) o facem în Etapa 2 sau separat — fiecare design costă timp.

---

## Etapa 2 — Wizard multi-step pe categorie

Scop: înlocuiesc wizardul actual de 3 pași cu unul pe categorii. Încep cu **Wedding** (cel mai cerut), apoi clonăm pentru restul.

Pași Wedding (conform cererii):
1. Informații generale
2. Detalii sărbătoriți
3. Locații (ceremonie + petrecere)
4. Personalizare avansată
5. Tip invitație + plată (alegere variantă)
6. Setări invitați (RSVP, +1, meniu, etc.)
7. Plată finală

**DB**: extind `events` cu coloane noi (`category`, `celebrants jsonb`, `locations jsonb`, `invitation_tier`, `guest_settings jsonb`, `payment_status`). Migrație separată.

Pași minimali pentru celelalte categorii (Birthday/Business/Celebration/Holiday/Baptize) — schemă similară redusă.

---

## Etapa 3 — Plată

Scop: monetizare. Recomand **Stripe seamless** (`enable_stripe_payments`) — produs digital, fără cont propriu necesar, suportă tax handling. Paddle e și el ok dar are review mai strict.

- 2-3 tier-uri (ex: Basic gratuit cu watermark / Standard / Premium fără watermark + mai mulți invitați).
- Logica: la pasul 7 din wizard → checkout session Stripe → webhook actualizează `payment_status` → publicare invitație.
- Necesită upgrade la **Pro plan** Lovable și activare Lovable Cloud (deja activ).

Vom decide tier-urile concret în Etapa 3.

---

## Recomandare

Începem cu **Etapa 1** (cea mai vizibilă, fără risc DB). După ce o validezi, trec la Etapa 2.

**Confirmă** dacă ești ok cu planul și începem cu Etapa 1, sau spune-mi dacă vrei să schimb ordinea / scope-ul.

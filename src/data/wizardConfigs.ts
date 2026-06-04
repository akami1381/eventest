import type { TemplateCategory } from "@/data/templates";

export type StepId =
  | "general"
  | "celebrants"
  | "locations"
  | "customization"
  | "tier"
  | "guests"
  | "payment";

export type StepDef = { id: StepId; label: string; description: string };

type Category = Exclude<TemplateCategory, "All">;

/**
 * Per-category step configuration. Labels and descriptions are tuned to
 * match the language of each event type (wedding, baptism, birthday...).
 */
const CONFIG: Record<Category, StepDef[]> = {
  Wedding: [
    { id: "general", label: "Informații generale", description: "Detalii esențiale despre invitație" },
    { id: "celebrants", label: "Detalii miri", description: "Numele mirilor și povestea voastră" },
    { id: "locations", label: "Locații", description: "Cununie civilă, religioasă și petrecere" },
    { id: "customization", label: "Personalizare avansată", description: "Secțiuni, culori și atmosferă" },
    { id: "tier", label: "Tip invitație", description: "Alege pachetul potrivit pentru nuntă" },
    { id: "guests", label: "Setări invitați", description: "RSVP, +1, meniu și restricții" },
    { id: "payment", label: "Plată", description: "Logare / cont și finalizare" },
  ],
  "Wedding + Baptize": [
    { id: "general", label: "Informații generale", description: "Detalii esențiale despre invitație" },
    { id: "celebrants", label: "Miri & prunc", description: "Numele mirilor și ale pruncului" },
    { id: "locations", label: "Locații", description: "Cununie, botez și petrecere comună" },
    { id: "customization", label: "Personalizare avansată", description: "Secțiuni, culori și atmosferă" },
    { id: "tier", label: "Tip invitație", description: "Alege pachetul potrivit" },
    { id: "guests", label: "Setări invitați", description: "RSVP, +1, meniu" },
    { id: "payment", label: "Plată", description: "Logare / cont și finalizare" },
  ],
  Baptize: [
    { id: "general", label: "Informații generale", description: "Detalii esențiale despre botez" },
    { id: "celebrants", label: "Detalii prunc & nași", description: "Numele pruncului și ale nașilor" },
    { id: "locations", label: "Locații", description: "Slujbă religioasă și petrecere" },
    { id: "customization", label: "Personalizare avansată", description: "Secțiuni, culori și atmosferă" },
    { id: "tier", label: "Tip invitație", description: "Alege pachetul potrivit" },
    { id: "guests", label: "Setări invitați", description: "RSVP și preferințe meniu" },
    { id: "payment", label: "Plată", description: "Logare / cont și finalizare" },
  ],
  Birthday: [
    { id: "general", label: "Informații generale", description: "Detalii esențiale despre petrecere" },
    { id: "celebrants", label: "Detalii sărbătorit", description: "Cine împlinește ani și câți" },
    { id: "locations", label: "Locație", description: "Unde are loc petrecerea" },
    { id: "customization", label: "Personalizare", description: "Temă, culori și secțiuni" },
    { id: "tier", label: "Tip invitație", description: "Alege pachetul potrivit" },
    { id: "guests", label: "Setări invitați", description: "RSVP, +1, alergii" },
    { id: "payment", label: "Plată", description: "Logare / cont și finalizare" },
  ],
  Business: [
    { id: "general", label: "Informații generale", description: "Detalii esențiale despre eveniment" },
    { id: "locations", label: "Locație", description: "Sală, adresă și logistică" },
    { id: "customization", label: "Personalizare", description: "Branding, agendă și secțiuni" },
    { id: "tier", label: "Tip invitație", description: "Alege pachetul potrivit" },
    { id: "guests", label: "Setări participanți", description: "Înregistrare, bilete, restricții" },
    { id: "payment", label: "Plată", description: "Logare / cont și finalizare" },
  ],
  Celebration: [
    { id: "general", label: "Informații generale", description: "Detalii esențiale despre eveniment" },
    { id: "celebrants", label: "Detalii sărbătoriți", description: "Pentru cine este celebrarea" },
    { id: "locations", label: "Locație", description: "Unde se desfășoară" },
    { id: "customization", label: "Personalizare", description: "Temă, culori și secțiuni" },
    { id: "tier", label: "Tip invitație", description: "Alege pachetul potrivit" },
    { id: "guests", label: "Setări invitați", description: "RSVP și preferințe" },
    { id: "payment", label: "Plată", description: "Logare / cont și finalizare" },
  ],
  Holiday: [
    { id: "general", label: "Informații generale", description: "Detalii esențiale despre sărbătoare" },
    { id: "locations", label: "Locație", description: "Unde sărbătoriți" },
    { id: "customization", label: "Personalizare", description: "Temă festivă și secțiuni" },
    { id: "tier", label: "Tip invitație", description: "Alege pachetul potrivit" },
    { id: "guests", label: "Setări invitați", description: "RSVP și preferințe" },
    { id: "payment", label: "Plată", description: "Logare / cont și finalizare" },
  ],
};

export function getStepsForCategory(category: Category): StepDef[] {
  return CONFIG[category] ?? CONFIG.Celebration;
}

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

const STEP: Record<StepId, StepDef> = {
  general: { id: "general", label: "Informații generale", description: "Detalii esențiale despre invitație" },
  celebrants: { id: "celebrants", label: "Detalii sărbătoriți", description: "Cine este sărbătorit" },
  locations: { id: "locations", label: "Locații", description: "Ceremonie și petrecere" },
  customization: { id: "customization", label: "Personalizare avansată", description: "Secțiuni, culori, atmosferă" },
  tier: { id: "tier", label: "Tip invitație", description: "Alege pachetul potrivit" },
  guests: { id: "guests", label: "Setări invitați", description: "RSVP, +1, meniu" },
  payment: { id: "payment", label: "Plată", description: "Sumar și finalizare" },
};

const FULL: StepId[] = ["general", "celebrants", "locations", "customization", "tier", "guests", "payment"];
const BAPTIZE: StepId[] = ["general", "celebrants", "locations", "customization", "tier", "guests", "payment"];
const SHORT: StepId[] = ["general", "locations", "customization", "tier", "guests", "payment"];

export function getStepsForCategory(
  category: Exclude<TemplateCategory, "All">,
): StepDef[] {
  const ids =
    category === "Wedding" || category === "Wedding + Baptize"
      ? FULL
      : category === "Baptize"
        ? BAPTIZE
        : SHORT;
  return ids.map((id) => STEP[id]);
}

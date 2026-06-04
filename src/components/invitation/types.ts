import type { TemplateCategory } from "@/data/templates";

export type Celebrant = { role: string; name: string };
export type InvitationLocation = {
  label: string;
  venue: string;
  address: string;
  time: string;
  mapsUrl?: string;
};

export type InvitationData = {
  category: Exclude<TemplateCategory, "All">;
  title: string;
  subtitle: string;
  message: string;
  date: string; // ISO date
  time: string; // HH:mm
  accent: string;
  coverImage?: string;
  celebrants: Celebrant[];
  locations: InvitationLocation[];
  sections: {
    program: boolean;
    dressCode: boolean;
    gifts: boolean;
    gallery: boolean;
  };
  guestSettings: {
    rsvp: boolean;
    allowPlusOne: boolean;
    askMenu: boolean;
    rsvpDeadline: string;
    customMessage: string;
  };
  tier: "basic" | "standard" | "premium";
};

const baseDefaults: InvitationData = {
  title: "Te invităm la sărbătoarea noastră",
  subtitle: "Un moment special, alături de cei dragi",
  message: "Cu drag, vă așteptăm să fim împreună într-o zi de neuitat.",
  date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60).toISOString().slice(0, 10),
  time: "17:00",
  accent: "hsl(340 75% 58%)",
  celebrants: [],
  locations: [
    { label: "Locație", venue: "", address: "", time: "17:00" },
  ],
  sections: { program: true, dressCode: false, gifts: false, gallery: false },
  guestSettings: {
    rsvp: true,
    allowPlusOne: true,
    askMenu: false,
    rsvpDeadline: "",
    customMessage: "",
  },
  tier: "standard",
};

export function defaultDataFor(
  category: Exclude<TemplateCategory, "All">,
  accent?: string,
): InvitationData {
  const accentColor = accent ?? baseDefaults.accent;
  switch (category) {
    case "Wedding":
      return {
        ...baseDefaults,
        accent: accentColor,
        title: "Ne căsătorim!",
        subtitle: "Maria & Andrei",
        message: "Dacă dragostea e cea care alege, vă invităm să sărbătoriți alături de noi.",
        celebrants: [
          { role: "Mireasă", name: "Maria Popescu" },
          { role: "Mire", name: "Andrei Ionescu" },
        ],
        locations: [
          { label: "Cununia religioasă", venue: "Biserica Sf. Nicolae", address: "Str. Bisericii 12", time: "15:00" },
          { label: "Petrecerea", venue: "Domeniul Florilor", address: "DN1, km 22", time: "18:00" },
        ],
        sections: { program: true, dressCode: true, gifts: true, gallery: false },
      };
    case "Wedding + Baptize":
      return {
        ...baseDefaults,
        accent: accentColor,
        title: "Nuntă și botez",
        subtitle: "Familia Popescu",
        message: "O sărbătoare, două motive. Vă invităm cu drag.",
        celebrants: [
          { role: "Mireasă", name: "Maria" },
          { role: "Mire", name: "Andrei" },
          { role: "Nou-născut", name: "Sofia" },
        ],
        locations: [
          { label: "Cununia & botez", venue: "Biserica Sf. Maria", address: "Str. Domnească 8", time: "14:00" },
          { label: "Petrecerea", venue: "Restaurant Domeniul Regal", address: "Calea Floreasca 22", time: "18:00" },
        ],
        sections: { program: true, dressCode: true, gifts: true, gallery: false },
      };
    case "Baptize":
      return {
        ...baseDefaults,
        accent: accentColor,
        title: "Botezul nostru",
        subtitle: "Sofia",
        message: "Vino să sărbătorim prima zi mare din viața micuței noastre.",
        celebrants: [
          { role: "Nou-născut", name: "Sofia" },
          { role: "Nași", name: "Ana & Mihai" },
        ],
        locations: [
          { label: "Slujba", venue: "Biserica Sf. Nicolae", address: "Str. Bisericii 12", time: "11:00" },
          { label: "Petrecerea", venue: "Restaurant Lumina", address: "Bd. Unirii 5", time: "13:00" },
        ],
        sections: { program: true, dressCode: false, gifts: true, gallery: false },
      };
    case "Birthday":
      return {
        ...baseDefaults,
        accent: accentColor,
        title: "Hai la petrecere!",
        subtitle: "Sărbătorim împreună",
        message: "Te aștept cu tort, muzică și voie bună.",
        celebrants: [{ role: "Sărbătorit", name: "Alex" }],
      };
    case "Business":
      return {
        ...baseDefaults,
        accent: accentColor,
        title: "Eveniment Corporate",
        subtitle: "Conferință anuală",
        message: "Vă invităm la cea mai importantă întâlnire a anului.",
        guestSettings: { ...baseDefaults.guestSettings, allowPlusOne: false, askMenu: false },
      };
    case "Celebration":
      return {
        ...baseDefaults,
        accent: accentColor,
        title: "Sărbătoare specială",
        subtitle: "Aniversare",
        message: "Marcăm un moment important. Te așteptăm.",
      };
    case "Holiday":
      return {
        ...baseDefaults,
        accent: accentColor,
        title: "Sărbători fericite!",
        subtitle: "Petrecerea de sezon",
        message: "Vino să marcăm sărbătorile împreună.",
      };
    default:
      return { ...baseDefaults, accent: accentColor };
  }
}

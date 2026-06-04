import { useEffect, useMemo, useReducer, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Eye, Mail, MessageCircle, Link2, PartyPopper } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { TEMPLATES, TEMPLATE_CATEGORIES, type TemplateCategory } from "@/data/templates";
import { getStepsForCategory, type StepId } from "@/data/wizardConfigs";
import { InvitationRenderer } from "@/components/invitation/InvitationRenderer";
import { InvitationFields } from "@/components/invitation/InvitationFields";
import { defaultDataFor, type InvitationData } from "@/components/invitation/types";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { JourneyStepper, type JourneyPhase } from "@/components/JourneyStepper";

const TIERS: { id: InvitationData["tier"]; name: string; price: string; perks: string[] }[] = [
  {
    id: "basic",
    name: "Basic",
    price: "Gratuit",
    perks: ["Watermark eventspark", "Până la 30 invitați", "RSVP simplu"],
  },
  {
    id: "standard",
    name: "Standard",
    price: "29 €",
    perks: ["Fără watermark", "Până la 150 invitați", "RSVP + meniu", "Hartă & program"],
  },
  {
    id: "premium",
    name: "Premium",
    price: "59 €",
    perks: ["Invitați nelimitați", "Galerie foto", "Suport dedicat", "Domeniu personalizat"],
  },
];

type Action = { type: "patch"; patch: Partial<InvitationData> } | { type: "set"; data: InvitationData };
function reducer(state: InvitationData, action: Action): InvitationData {
  if (action.type === "set") return action.data;
  return { ...state, ...action.patch };
}

export default function InvitationWizard() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const templateId = params.get("template");
  const template = useMemo(() => TEMPLATES.find((t) => t.id === templateId), [templateId]);

  const [paid, setPaid] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const draftKey = template ? `invitation-draft-${template.id}` : "";

  const [data, dispatch] = useReducer(
    reducer,
    template ? defaultDataFor(template.category, template.accent) : ({} as InvitationData),
  );

  useEffect(() => {
    if (!template) return;
    try {
      const stored = sessionStorage.getItem(draftKey) || localStorage.getItem(draftKey);
      if (stored) dispatch({ type: "set", data: { ...defaultDataFor(template.category, template.accent), ...JSON.parse(stored) } });
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templateId]);

  useEffect(() => {
    if (!template) return;
    try {
      localStorage.setItem(draftKey, JSON.stringify(data));
    } catch {}
  }, [data, draftKey, template]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [stepIdx]);

  if (!template) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground mb-4">Niciun model selectat.</p>
        <Button asChild>
          <Link to="/templates">Alege un model</Link>
        </Button>
      </div>
    );
  }

  const steps = getStepsForCategory(data.category ?? template.category);
  const step = steps[Math.min(stepIdx, steps.length - 1)];
  const progress = ((stepIdx + 1) / steps.length) * 100;
  const isLast = stepIdx === steps.length - 1;

  const patch = (p: Partial<InvitationData>) => dispatch({ type: "patch", patch: p });

  const renderStep = (id: StepId) => {
    switch (id) {
      case "general":
        return (
          <div className="space-y-5">
            <div className="space-y-2">
              <Label>Event type</Label>
              <Select
                value={data.category}
                onValueChange={(v) => {
                  const newCat = v as Exclude<TemplateCategory, "All">;
                  patch({ category: newCat });
                  setStepIdx(0);
                }}
              >
                <SelectTrigger className="rounded-full h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TEMPLATE_CATEGORIES.filter((c) => c !== "All").map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Schimbarea tipului ajustează pașii invitației.</p>
            </div>
            <div className="space-y-2">
              <Label>Titlu invitație</Label>
              <Input value={data.title} onChange={(e) => patch({ title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Subtitlu</Label>
              <Input value={data.subtitle} onChange={(e) => patch({ subtitle: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Data</Label>
                <Input type="date" value={data.date} onChange={(e) => patch({ date: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Ora</Label>
                <Input type="time" value={data.time} onChange={(e) => patch({ time: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Mesaj de bun-venit</Label>
              <Textarea rows={4} value={data.message} onChange={(e) => patch({ message: e.target.value })} />
            </div>
          </div>
        );
      case "celebrants":
        return (
          <InvitationFields
            data={data}
            onChange={patch}
            showCelebrants
            showLocations={false}
            compact
          />
        );
      case "locations":
        return (
          <InvitationFields
            data={data}
            onChange={patch}
            showCelebrants={false}
            showLocations
            compact
          />
        );
      case "customization": {
        const Sections = (
          <div className="space-y-3">
            <Label className="block mb-2">Secțiuni active</Label>
            {(
              [
                ["program", "Program eveniment"],
                ["dressCode", "Dress code"],
                ["gifts", "Listă cadouri / cont bancar"],
                ["gallery", "Galerie foto"],
              ] as const
            ).map(([key, label]) => (
              <div key={key} className="flex items-center justify-between p-3 rounded-xl bg-muted/40">
                <span className="text-sm font-medium">{label}</span>
                <Switch
                  checked={data.sections[key]}
                  onCheckedChange={(v) =>
                    patch({ sections: { ...data.sections, [key]: v } })
                  }
                />
              </div>
            ))}
          </div>
        );
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Culoare accent</Label>
              <div className="flex gap-2">
                {[
                  "hsl(340 75% 58%)",
                  "hsl(35 60% 55%)",
                  "hsl(200 60% 50%)",
                  "hsl(150 50% 45%)",
                  "hsl(280 50% 55%)",
                  "hsl(220 15% 25%)",
                ].map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => patch({ accent: c })}
                    className="w-9 h-9 rounded-full border-2 transition-transform hover:scale-110"
                    style={{
                      backgroundColor: c,
                      borderColor: data.accent === c ? "hsl(var(--foreground))" : "transparent",
                    }}
                  />
                ))}
              </div>
            </div>
            {Sections}
          </div>
        );
      }
      case "tier":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {TIERS.map((t) => {
              const active = data.tier === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => patch({ tier: t.id })}
                  className={cn(
                    "text-left p-5 rounded-2xl transition-all",
                    active
                      ? "bg-foreground text-background"
                      : "bg-muted/40 hover:bg-muted text-foreground",
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{t.name}</span>
                    {active && <Check className="w-4 h-4" />}
                  </div>
                  <div className="font-display text-2xl tracking-[-0.02em] mb-3">{t.price}</div>
                  <ul className={cn("space-y-1 text-sm", active ? "opacity-90" : "text-muted-foreground")}>
                    {t.perks.map((p) => (
                      <li key={p}>· {p}</li>
                    ))}
                  </ul>
                </button>
              );
            })}
          </div>
        );
      case "guests":
        return (
          <div className="space-y-4">
            {(
              [
                ["rsvp", "Cere confirmare (RSVP)"],
                ["allowPlusOne", "Permite +1"],
                ["askMenu", "Întreabă preferințe meniu"],
              ] as const
            ).map(([key, label]) => (
              <div key={key} className="flex items-center justify-between p-3 rounded-xl bg-muted/40">
                <span className="text-sm font-medium">{label}</span>
                <Switch
                  checked={data.guestSettings[key] as boolean}
                  onCheckedChange={(v) =>
                    patch({ guestSettings: { ...data.guestSettings, [key]: v } })
                  }
                />
              </div>
            ))}
            <div className="space-y-2">
              <Label>Deadline RSVP</Label>
              <Input
                type="date"
                value={data.guestSettings.rsvpDeadline}
                onChange={(e) =>
                  patch({ guestSettings: { ...data.guestSettings, rsvpDeadline: e.target.value } })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Mesaj custom pentru invitați</Label>
              <Textarea
                rows={3}
                value={data.guestSettings.customMessage}
                onChange={(e) =>
                  patch({ guestSettings: { ...data.guestSettings, customMessage: e.target.value } })
                }
              />
            </div>
          </div>
        );
      case "payment": {
        const tier = TIERS.find((t) => t.id === data.tier)!;
        if (paid) {
          const shareUrl = `${window.location.origin}/invitation/${template.id}`;
          const shareText = `${data.title} — ${data.subtitle}`;
          const copy = async () => {
            await navigator.clipboard.writeText(shareUrl);
            toast({ title: "Link copiat", description: shareUrl });
          };
          return (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-muted/40 text-center space-y-2">
                <div className="inline-flex w-12 h-12 items-center justify-center rounded-full bg-foreground text-background">
                  <PartyPopper className="w-6 h-6" />
                </div>
                <h3 className="font-display text-2xl tracking-[-0.02em]">Invitația ta este gata!</h3>
                <p className="text-sm text-muted-foreground">
                  Trimite-o invitaților prin canalele preferate sau intră în dashboard pentru analitice.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 h-12 rounded-full bg-muted hover:bg-muted/70 transition-colors text-sm font-medium"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
                <a
                  href={`mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(shareUrl)}`}
                  className="flex items-center justify-center gap-2 h-12 rounded-full bg-muted hover:bg-muted/70 transition-colors text-sm font-medium"
                >
                  <Mail className="w-4 h-4" /> Email
                </a>
                <button
                  type="button"
                  onClick={copy}
                  className="flex items-center justify-center gap-2 h-12 rounded-full bg-muted hover:bg-muted/70 transition-colors text-sm font-medium"
                >
                  <Link2 className="w-4 h-4" /> Copiază link
                </button>
              </div>
              <Button onClick={() => navigate("/dashboard/events")} className="w-full font-semibold">
                Mergi la dashboard <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          );
        }
        return (
          <div className="space-y-5">
            <div className="p-5 rounded-2xl bg-muted/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Model</span>
                <span className="font-medium">{template.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Tip eveniment</span>
                <span className="font-medium">{data.category}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Pachet</span>
                <span className="font-medium">{tier.name}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                <span className="font-semibold">Total</span>
                <span className="font-display text-2xl tracking-[-0.02em]">{tier.price}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Vei putea să te loghezi sau să creezi cont chiar înainte de plată. Plata securizată vine în curând.
            </p>
            <Button
              className="w-full font-semibold"
              onClick={() => {
                setPaid(true);
                toast({ title: "Plată confirmată", description: "Invitația ta este activă." });
              }}
            >
              Logare & plată <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        );
      }
    }
  };

  const Preview = (
    <div className="aspect-[3/4] w-full max-w-md mx-auto">
      <InvitationRenderer
        layout={template.layout}
        data={data}
        coverImage={template.image}
        className="h-full"
      />
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-72px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        {/* Journey */}
        <div className="mb-8">
          <JourneyStepper active={journeyPhase} />
        </div>
        {/* Header */}
        <div className="mb-6 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <Link
              to="/templates"
              className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> Alt model
            </Link>
            <h1 className="font-display text-2xl sm:text-3xl tracking-[-0.02em] mt-1 truncate">
              {step.label}
            </h1>
            <p className="text-sm text-muted-foreground">{step.description}</p>
          </div>
          <MobilePreview>{Preview}</MobilePreview>
        </div>

        {/* Progress */}
        <div className="mb-6 space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Pasul {stepIdx + 1} din {steps.length}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-1.5" />
          <div className="flex gap-2 overflow-x-auto pt-2">
            {steps.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setStepIdx(i)}
                className={cn(
                  "px-3 h-8 rounded-full text-xs font-medium whitespace-nowrap transition-colors",
                  i === stepIdx
                    ? "bg-foreground text-background"
                    : i < stepIdx
                      ? "bg-muted text-foreground"
                      : "bg-muted/40 text-muted-foreground",
                )}
              >
                {i + 1}. {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8 lg:gap-12">
          {/* Form column */}
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.25 }}
              >
                {renderStep(step.id)}
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex items-center justify-between gap-3">
              <Button
                variant="ghost"
                onClick={() => setStepIdx((i) => Math.max(0, i - 1))}
                disabled={stepIdx === 0}
              >
                <ArrowLeft className="w-4 h-4" /> Înapoi
              </Button>
              {!isLast ? (
                <Button onClick={() => setStepIdx((i) => Math.min(steps.length - 1, i + 1))} className="font-semibold">
                  Continuă <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button onClick={() => navigate("/dashboard/events")} variant="outline">
                  Salvează draft & ieși
                </Button>
              )}
            </div>
          </div>

          {/* Preview column */}
          <div className="hidden lg:block">
            <div className="sticky top-24">{Preview}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobilePreview({ children }: { children: React.ReactNode }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="lg:hidden shrink-0">
          <Eye className="w-4 h-4" />
          Previzualizează
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh] overflow-y-auto">
        <div className="pt-6">{children}</div>
      </SheetContent>
    </Sheet>
  );
}

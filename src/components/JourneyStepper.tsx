import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type JourneyPhase = "choose" | "customize" | "pay" | "send";

const PHASES: { id: JourneyPhase; label: string; hint: string }[] = [
  { id: "choose", label: "Alege model", hint: "Galeria de invitații" },
  { id: "customize", label: "Personalizează", hint: "Detalii & design" },
  { id: "pay", label: "Plătește", hint: "Cont & pachet" },
  { id: "send", label: "Trimite", hint: "WhatsApp · Email · Link" },
];

export function JourneyStepper({ active }: { active: JourneyPhase }) {
  const activeIdx = PHASES.findIndex((p) => p.id === active);

  return (
    <div className="w-full">
      {/* Desktop / tablet */}
      <ol className="hidden sm:flex items-center gap-2">
        {PHASES.map((p, i) => {
          const isActive = i === activeIdx;
          const isDone = i < activeIdx;
          return (
            <li key={p.id} className="flex items-center gap-2 flex-1 min-w-0">
              <div
                className={cn(
                  "flex items-center gap-2.5 px-3 h-10 rounded-full transition-colors min-w-0",
                  isActive && "bg-foreground text-background",
                  !isActive && isDone && "bg-muted text-foreground",
                  !isActive && !isDone && "text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-semibold shrink-0",
                    isActive && "bg-background text-foreground",
                    !isActive && isDone && "bg-foreground text-background",
                    !isActive && !isDone && "bg-muted text-muted-foreground",
                  )}
                >
                  {isDone ? <Check className="w-3.5 h-3.5" /> : i + 1}
                </span>
                <span className="text-sm font-medium whitespace-nowrap">{p.label}</span>
              </div>
              {i < PHASES.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-px min-w-4",
                    isDone ? "bg-foreground/40" : "bg-border",
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>

      {/* Mobile */}
      <div className="sm:hidden space-y-2">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Pasul {activeIdx + 1} din {PHASES.length}
          </span>
          <span className="font-medium text-foreground">{PHASES[activeIdx].label}</span>
        </div>
        <div className="flex gap-1">
          {PHASES.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 flex-1 rounded-full",
                i <= activeIdx ? "bg-foreground" : "bg-muted",
              )}
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground">{PHASES[activeIdx].hint}</p>
      </div>
    </div>
  );
}

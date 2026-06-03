import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import type { InvitationData } from "./types";

interface Props {
  data: InvitationData;
  onChange: (patch: Partial<InvitationData>) => void;
  showCelebrants?: boolean;
  showLocations?: boolean;
  compact?: boolean;
}

const ACCENTS = [
  "hsl(340 75% 58%)",
  "hsl(35 60% 55%)",
  "hsl(200 60% 50%)",
  "hsl(150 50% 45%)",
  "hsl(280 50% 55%)",
  "hsl(220 15% 25%)",
];

export function InvitationFields({
  data,
  onChange,
  showCelebrants = true,
  showLocations = true,
  compact = false,
}: Props) {
  const updateCelebrant = (i: number, patch: Partial<{ role: string; name: string }>) => {
    const next = [...data.celebrants];
    next[i] = { ...next[i], ...patch };
    onChange({ celebrants: next });
  };
  const updateLocation = (i: number, patch: Partial<InvitationData["locations"][number]>) => {
    const next = [...data.locations];
    next[i] = { ...next[i], ...patch };
    onChange({ locations: next });
  };

  return (
    <div className={compact ? "space-y-4" : "space-y-5"}>
      <div className="space-y-2">
        <Label>Titlu</Label>
        <Input value={data.title} onChange={(e) => onChange({ title: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Subtitlu</Label>
          <Input value={data.subtitle} onChange={(e) => onChange({ subtitle: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Culoare accent</Label>
          <div className="flex gap-1.5 items-center h-11">
            {ACCENTS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => onChange({ accent: c })}
                className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110"
                style={{
                  backgroundColor: c,
                  borderColor: data.accent === c ? "hsl(var(--foreground))" : "transparent",
                }}
                aria-label="accent"
              />
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Data</Label>
          <Input type="date" value={data.date} onChange={(e) => onChange({ date: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label>Ora</Label>
          <Input type="time" value={data.time} onChange={(e) => onChange({ time: e.target.value })} />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Mesaj</Label>
        <Textarea
          rows={3}
          value={data.message}
          onChange={(e) => onChange({ message: e.target.value })}
        />
      </div>

      {showCelebrants && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Sărbătoriți</Label>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() =>
                onChange({ celebrants: [...data.celebrants, { role: "", name: "" }] })
              }
            >
              <Plus className="w-4 h-4" />
              Adaugă
            </Button>
          </div>
          <div className="space-y-2">
            {data.celebrants.map((c, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  placeholder="Rol (ex: Mire)"
                  value={c.role}
                  onChange={(e) => updateCelebrant(i, { role: e.target.value })}
                  className="w-1/3"
                />
                <Input
                  placeholder="Nume"
                  value={c.name}
                  onChange={(e) => updateCelebrant(i, { name: e.target.value })}
                />
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  onClick={() =>
                    onChange({ celebrants: data.celebrants.filter((_, j) => j !== i) })
                  }
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {showLocations && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Locații</Label>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() =>
                onChange({
                  locations: [
                    ...data.locations,
                    { label: "Locație", venue: "", address: "", time: "" },
                  ],
                })
              }
            >
              <Plus className="w-4 h-4" />
              Adaugă
            </Button>
          </div>
          <div className="space-y-3">
            {data.locations.map((loc, i) => (
              <div key={i} className="space-y-2 p-3 rounded-xl bg-muted/40">
                <div className="flex gap-2">
                  <Input
                    placeholder="Etichetă (ex: Ceremonie)"
                    value={loc.label}
                    onChange={(e) => updateLocation(i, { label: e.target.value })}
                  />
                  <Input
                    type="time"
                    value={loc.time}
                    onChange={(e) => updateLocation(i, { time: e.target.value })}
                    className="w-32"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() =>
                      onChange({ locations: data.locations.filter((_, j) => j !== i) })
                    }
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <Input
                  placeholder="Nume locație"
                  value={loc.venue}
                  onChange={(e) => updateLocation(i, { venue: e.target.value })}
                />
                <Input
                  placeholder="Adresă"
                  value={loc.address}
                  onChange={(e) => updateLocation(i, { address: e.target.value })}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

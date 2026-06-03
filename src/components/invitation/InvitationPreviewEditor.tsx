import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import type { Template } from "@/data/templates";
import { InvitationRenderer } from "./InvitationRenderer";
import { InvitationFields } from "./InvitationFields";
import { defaultDataFor, type InvitationData } from "./types";

interface Props {
  template: Template;
  onUse?: () => void;
}

export function InvitationPreviewEditor({ template, onUse }: Props) {
  const initial = useMemo<InvitationData>(
    () => defaultDataFor(template.category, template.accent),
    [template.id, template.category, template.accent],
  );
  const [data, setData] = useState<InvitationData>(initial);
  const navigate = useNavigate();
  const { user } = useAuth();

  const useTemplate = () => {
    if (onUse) return onUse();
    sessionStorage.setItem(`invitation-draft-${template.id}`, JSON.stringify(data));
    if (user) navigate(`/dashboard/invitations/new?template=${template.id}`);
    else navigate(`/auth?mode=signup&template=${template.id}`);
  };

  const showCelebrants = ["Wedding", "Wedding + Baptize", "Baptize", "Birthday"].includes(
    template.category,
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-0 max-h-[88vh]">
      {/* Form */}
      <div className="p-6 lg:p-8 overflow-y-auto border-r border-border/50">
        <div className="mb-5">
          <span
            className="inline-block text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full"
            style={{ backgroundColor: `${template.accent}22`, color: template.accent }}
          >
            {template.category}
          </span>
          <h2 className="font-display text-2xl text-foreground tracking-[-0.02em] mt-3">
            {template.name}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Editează câmpurile — vezi modificările în timp real.
          </p>
        </div>
        <InvitationFields
          data={data}
          onChange={(patch) => setData((d) => ({ ...d, ...patch }))}
          showCelebrants={showCelebrants}
          compact
        />
        <div className="mt-6 pt-5 border-t border-border/50">
          <Button className="w-full font-semibold" onClick={useTemplate}>
            Folosește acest model
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Live preview */}
      <div className="bg-muted/40 p-6 lg:p-8 overflow-y-auto">
        <div className="aspect-[3/4] lg:aspect-[4/5] max-w-md mx-auto">
          <InvitationRenderer
            layout={template.layout}
            data={data}
            coverImage={template.image}
            className="h-full"
          />
        </div>
      </div>
    </div>
  );
}

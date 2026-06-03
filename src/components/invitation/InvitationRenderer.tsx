import { Calendar, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import type { InvitationData } from "./types";

type Layout = "minimal" | "split" | "landing";

interface Props {
  layout: Layout;
  data: InvitationData;
  coverImage?: string;
  className?: string;
}

function formatDate(iso: string) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("ro-RO", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

const CelebrantsBlock = ({ data }: { data: InvitationData }) =>
  data.celebrants.length > 0 ? (
    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
      {data.celebrants.map((c, i) => (
        <span key={i}>
          <span className="font-medium text-foreground">{c.name || "—"}</span>
          {c.role && <span className="opacity-60"> · {c.role}</span>}
          {i < data.celebrants.length - 1 && <span className="mx-1 opacity-40">|</span>}
        </span>
      ))}
    </div>
  ) : null;

const LocationsBlock = ({ data }: { data: InvitationData }) => (
  <div className="space-y-2 text-sm">
    {data.locations.map((loc, i) => (
      <div key={i} className="flex items-start gap-2">
        <MapPin className="w-4 h-4 mt-0.5 shrink-0" style={{ color: data.accent }} />
        <div>
          <div className="font-medium text-foreground">
            {loc.label}
            {loc.time && <span className="text-muted-foreground font-normal"> · {loc.time}</span>}
          </div>
          {(loc.venue || loc.address) && (
            <div className="text-muted-foreground">
              {[loc.venue, loc.address].filter(Boolean).join(", ")}
            </div>
          )}
        </div>
      </div>
    ))}
  </div>
);

export function InvitationRenderer({ layout, data, coverImage, className = "" }: Props) {
  const accent = data.accent;
  const image = coverImage ?? data.coverImage;

  const MinimalView = (
    <div className="h-full w-full bg-background p-8 sm:p-12 flex flex-col items-center justify-center text-center">
      <div
        className="text-xs font-semibold tracking-[0.2em] uppercase mb-6"
        style={{ color: accent }}
      >
        {data.subtitle || "Invitație"}
      </div>
      <h2 className="font-display tracking-[-0.02em] text-3xl sm:text-4xl text-foreground mb-4 max-w-md">
        {data.title}
      </h2>
      <div className="h-px w-12 mb-6" style={{ backgroundColor: accent }} />
      <CelebrantsBlock data={data} />
      <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Calendar className="w-4 h-4" style={{ color: accent }} />
        {formatDate(data.date)} {data.time && `· ${data.time}`}
      </div>
      {data.message && (
        <p className="mt-6 text-sm text-muted-foreground max-w-sm italic">{data.message}</p>
      )}
      <div className="mt-8 w-full max-w-xs">
        <LocationsBlock data={data} />
      </div>
    </div>
  );

  const SplitView = (
    <div className="h-full w-full grid grid-cols-1 sm:grid-cols-2 bg-background">
      <div className="relative bg-muted min-h-[180px]" style={{ backgroundColor: `${accent}22` }}>
        {image ? (
          <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center font-display text-4xl"
               style={{ color: accent }}>
            {(data.subtitle || data.title).slice(0, 1)}
          </div>
        )}
      </div>
      <div className="p-6 sm:p-8 flex flex-col justify-center">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] mb-3"
              style={{ color: accent }}>
          {data.subtitle || "Invitație"}
        </span>
        <h2 className="font-display tracking-[-0.02em] text-2xl sm:text-3xl text-foreground mb-3">
          {data.title}
        </h2>
        <CelebrantsBlock data={data} />
        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" style={{ color: accent }} />
          {formatDate(data.date)} {data.time && `· ${data.time}`}
        </div>
        {data.message && (
          <p className="mt-4 text-sm text-muted-foreground italic">{data.message}</p>
        )}
        <div className="mt-5">
          <LocationsBlock data={data} />
        </div>
      </div>
    </div>
  );

  const LandingView = (
    <div className="h-full w-full flex flex-col bg-background">
      <div className="relative h-1/2 min-h-[200px] overflow-hidden"
           style={{ backgroundColor: accent }}>
        {image && (
          <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-70" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-end text-center text-white p-6">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] mb-2 opacity-90">
            {data.subtitle || "Invitație"}
          </span>
          <h2 className="font-display tracking-[-0.02em] text-3xl sm:text-4xl">{data.title}</h2>
        </div>
      </div>
      <div className="flex-1 p-6 sm:p-8 flex flex-col items-center text-center">
        <CelebrantsBlock data={data} />
        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" style={{ color: accent }} />
          {formatDate(data.date)} {data.time && `· ${data.time}`}
        </div>
        {data.message && (
          <p className="mt-4 text-sm text-muted-foreground italic max-w-sm">{data.message}</p>
        )}
        <div className="mt-5 w-full max-w-sm text-left">
          <LocationsBlock data={data} />
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      key={`${layout}-${accent}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`overflow-hidden rounded-2xl bg-background shadow-[0_10px_40px_-15px_rgba(0,0,0,0.15)] ${className}`}
    >
      {layout === "minimal" && MinimalView}
      {layout === "split" && SplitView}
      {layout === "landing" && LandingView}
    </motion.div>
  );
}

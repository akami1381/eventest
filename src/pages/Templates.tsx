import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Eye } from "lucide-react";

import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import {
  TEMPLATES,
  TEMPLATE_CATEGORIES,
  type Template,
  type TemplateCategory,
} from "@/data/templates";
import { InvitationPreviewEditor } from "@/components/invitation/InvitationPreviewEditor";

const navLinks = [
  { label: "Functionalitati", href: "/#features" },
  { label: "Modele", href: "/templates" },
  { label: "Preturi", href: "/#pricing" },
];

export default function Templates() {
  const [params, setParams] = useSearchParams();
  const activeCategory = (params.get("category") as TemplateCategory) ?? "All";
  const [previewing, setPreviewing] = useState<Template | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const filtered = useMemo(() => {
    if (activeCategory === "All") return TEMPLATES;
    return TEMPLATES.filter((t) => t.category === activeCategory);
  }, [activeCategory]);

  const setCategory = (c: TemplateCategory) => {
    const next = new URLSearchParams(params);
    if (c === "All") next.delete("category");
    else next.set("category", c);
    setParams(next, { replace: true });
  };

  const useTemplate = (t: Template) => {
    if (user) navigate(`/dashboard/events/create?template=${t.id}`);
    else navigate(`/auth?mode=signup&template=${t.id}`);
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden pt-[72px]">
      {/* Navbar (matches Landing) */}
      <nav className="fixed top-0 left-0 right-0 w-full z-50 bg-background/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-[72px] px-6 lg:px-8">
          <Link to="/">
            <Logo size="md" />
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-muted-foreground rounded-full hover:text-foreground hover:bg-muted transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="text-sm font-medium" asChild>
              <Link to="/auth">Intra in cont</Link>
            </Button>
            <Button className="hidden sm:inline-flex text-sm font-semibold" asChild>
              <Link to="/auth?mode=signup">Creeaza invitatie</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 pt-12 lg:pt-16 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-display tracking-[-0.02em] text-foreground text-4xl sm:text-5xl lg:text-6xl mb-4">
            Modele de invitatii
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Alege un design, previzualizeaza-l si personalizeaza-l in cativa pasi.
            De la nunti si botezuri pana la evenimente corporate.
          </p>
        </motion.div>
      </section>

      {/* Category tabs */}
      <section className="sticky top-[72px] z-40 bg-background/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max">
            {TEMPLATE_CATEGORIES.map((c) => {
              const active = c === activeCategory;
              return (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={cn(
                    "px-4 h-11 rounded-full text-sm font-medium transition-colors whitespace-nowrap",
                    active
                      ? "bg-foreground text-background"
                      : "bg-muted text-muted-foreground hover:text-foreground",
                  )}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-10 pb-24">
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((t, i) => (
              <motion.article
                key={t.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, delay: Math.min(i * 0.03, 0.2) }}
                className="group"
              >
                <div className="relative overflow-hidden rounded-2xl bg-muted aspect-[4/5] mb-4">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="font-semibold flex-1"
                      onClick={() => setPreviewing(t)}
                    >
                      <Eye className="w-4 h-4" />
                      Previzualizeaza
                    </Button>
                    <Button
                      size="sm"
                      className="font-semibold flex-1"
                      onClick={() => useTemplate(t)}
                    >
                      Foloseste
                    </Button>
                  </div>
                </div>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-display font-semibold text-foreground tracking-[-0.01em]">
                    {t.name}
                  </h3>
                  <span className="text-xs font-medium text-muted-foreground bg-muted px-2.5 py-1 rounded-full whitespace-nowrap">
                    {t.category}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{t.tagline}</p>
                {/* Mobile-visible actions */}
                <div className="flex gap-2 mt-3 sm:hidden">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setPreviewing(t)}
                  >
                    <Eye className="w-4 h-4" />
                    Vezi
                  </Button>
                  <Button size="sm" className="flex-1" onClick={() => useTemplate(t)}>
                    Foloseste
                  </Button>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-20">
            Niciun model in aceasta categorie inca.
          </p>
        )}
      </section>

      {/* Preview dialog */}
      <Dialog open={!!previewing} onOpenChange={(o) => !o && setPreviewing(null)}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden">
          {previewing && (
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative bg-muted aspect-[4/5] md:aspect-auto">
                <img
                  src={previewing.image}
                  alt={previewing.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-8 flex flex-col">
                <span
                  className="self-start text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full mb-4"
                  style={{ backgroundColor: `${previewing.accent}22`, color: previewing.accent }}
                >
                  {previewing.category}
                </span>
                <h2 className="font-display text-3xl text-foreground tracking-[-0.02em] mb-3">
                  {previewing.name}
                </h2>
                <p className="text-muted-foreground mb-6">{previewing.tagline}</p>
                <ul className="space-y-2 text-sm text-foreground mb-8">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Layout: {previewing.layout}
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Personalizare completa in 7 pasi
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    RSVP, harti, galerie
                  </li>
                </ul>
                <div className="mt-auto flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setPreviewing(null)}
                  >
                    <X className="w-4 h-4" />
                    Inchide
                  </Button>
                  <Button className="flex-1" onClick={() => useTemplate(previewing)}>
                    Foloseste acest model
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

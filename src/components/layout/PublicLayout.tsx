import { Link, NavLink, useLocation } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Funcționalități", href: "/#features", match: (p: string, h: string) => p === "/" && h === "#features" },
  { label: "Modele", href: "/templates", match: (p: string) => p === "/templates" },
  { label: "Prețuri", href: "/#pricing", match: (p: string, h: string) => p === "/" && h === "#pricing" },
];

const sitemapLinks = [
  { label: "Acasă", href: "/", match: (p: string, h: string) => p === "/" && !h },
  { label: "Modele", href: "/templates", match: (p: string) => p === "/templates" },
  { label: "Autentificare", href: "/auth", match: (p: string) => p === "/auth" },
];

const wizardPhases = [
  { label: "1. Alege model", href: "/templates", phase: "choose" as const },
  { label: "2. Personalizează", href: "/invitations/new?phase=customize", phase: "customize" as const },
  { label: "3. Plătește", href: "/invitations/new?phase=pay", phase: "pay" as const },
  { label: "4. Trimite", href: "/invitations/new?phase=send", phase: "send" as const },
];

function getActiveWizardPhase(pathname: string, search: string): string | null {
  if (pathname === "/templates") return "choose";
  if (pathname === "/invitations/new") {
    const phase = new URLSearchParams(search).get("phase");
    return phase || "customize";
  }
  return null;
}

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const { pathname, hash, search } = useLocation();
  const activePhase = getActiveWizardPhase(pathname, search);

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-x-hidden pt-[72px]">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 w-full z-50 bg-background/90 backdrop-blur-md border-b border-border/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-[72px] px-6 lg:px-8">
          <Link to="/" aria-label="eventspark — acasă">
            <Logo size="md" />
          </Link>
          <div className="hidden md:flex items-center gap-1" role="navigation" aria-label="Meniu principal">
            {navLinks.map((link) => {
              const isActive = link.match(pathname, hash);
              return (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-full transition-colors",
                    isActive
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted",
                  )}
                >
                  {link.label}
                </a>
              );
            })}
            {activePhase && (
              <NavLink
                to="/invitations/new"
                aria-current="page"
                className="px-4 py-2 text-sm font-medium rounded-full bg-foreground text-background"
              >
                Wizard invitație
              </NavLink>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" className="text-sm font-medium" asChild>
              <Link to="/auth">Intră în cont</Link>
            </Button>
            <Button className="hidden sm:inline-flex text-sm font-semibold" asChild>
              <Link to="/auth?mode=signup">Creează invitație</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Main */}
      <main className="flex-1">{children}</main>

      {/* Footer / Sitemap */}
      <footer className="py-10 px-6 lg:px-8 border-t border-border/40">
        <div className="max-w-7xl mx-auto grid gap-8 md:grid-cols-3">
          <div className="flex flex-col gap-3">
            <Logo size="md" />
            <p className="text-sm text-muted-foreground max-w-xs">
              Invitații digitale care arată ca site-uri. Trimite-le prin WhatsApp, email sau link.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Navigare
            </h4>
            <nav className="flex flex-col gap-2" aria-label="Sitemap">
              {sitemapLinks.map((link) => {
                const isActive = link.match(pathname, hash);
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "text-sm transition-colors w-fit",
                      isActive
                        ? "text-foreground font-semibold"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {link.label}
                  </a>
                );
              })}
            </nav>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Pași invitație
            </h4>
            <nav className="flex flex-col gap-2" aria-label="Pașii wizardului">
              {wizardPhases.map((p) => {
                const isActive = activePhase === p.phase;
                return (
                  <Link
                    key={p.phase}
                    to={p.href}
                    aria-current={isActive ? "step" : undefined}
                    className={cn(
                      "text-sm transition-colors w-fit",
                      isActive
                        ? "text-foreground font-semibold"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {p.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground">© 2026 eventspark. Toate drepturile rezervate.</p>
        </div>
      </footer>
    </div>
  );
}

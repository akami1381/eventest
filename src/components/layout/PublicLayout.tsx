import { Link, useLocation } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Funcționalități", href: "/#features" },
  { label: "Modele", href: "/templates" },
  { label: "Prețuri", href: "/#pricing" },
];

const sitemapLinks = [
  { label: "Acasă", href: "/" },
  { label: "Modele", href: "/templates" },
  { label: "Autentificare", href: "/auth" },
];

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const isAuthPage = pathname === "/auth" || pathname.startsWith("/register");

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-x-hidden pt-[72px]">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 w-full z-50 bg-background/90 backdrop-blur-md border-b border-border/40">
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
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
            <Logo size="md" />
            <nav className="flex items-center gap-4">
              {sitemapLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 eventspark. Toate drepturile rezervate.</p>
        </div>
      </footer>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, UtensilsCrossed, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { to: "/", label: "Home", ocid: "nav.home_link" },
  { to: "/menu", label: "Menu", ocid: "nav.menu_link" },
  { to: "/order", label: "Order", ocid: "nav.order_link" },
  { to: "/reservations", label: "Reservations", ocid: "nav.reservations_link" },
  { to: "/admin", label: "Admin", ocid: "nav.admin_link" },
] as const;

function useCurrentPath() {
  const routerState = useRouterState();
  return routerState.location.pathname;
}

export default function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const currentPath = useCurrentPath();

  const isActive = (to: string) => {
    if (to === "/") return currentPath === "/";
    return currentPath.startsWith(to);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-card/90 nav-blur shadow-xs">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 border border-primary/20 group-hover:bg-primary/15 transition-colors">
            <UtensilsCrossed className="h-4 w-4 text-primary" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-lg font-bold tracking-wide text-foreground">
              La Maison
            </span>
            <span className="font-body text-[10px] tracking-widest uppercase text-muted-foreground/70">
              Restaurant
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              data-ocid={link.ocid}
              className={cn(
                "font-body text-sm font-medium px-3.5 py-1.5 rounded-md transition-all duration-200",
                isActive(link.to)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/80",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-9 w-9"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle navigation"
        >
          {mobileOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-border/40 bg-card/95 nav-blur">
          <div className="container mx-auto px-4 py-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                data-ocid={link.ocid}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "font-body text-sm font-medium px-3 py-2.5 rounded-md transition-all",
                  isActive(link.to)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/80",
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}

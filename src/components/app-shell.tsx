import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Package,
  Users,
  MessageCircle,
  ShieldAlert,
  Truck,
  BarChart3,
  Settings,
  Menu,
  Upload,
  Bell,
  Search,
  ShieldCheck,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/store";

const NAV = [
  { to: "/app", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
  { to: "/app/commandes", label: "Commandes", icon: Package },
  { to: "/app/clients", label: "Clients", icon: Users },
  { to: "/app/confirmations", label: "Confirmations", icon: MessageCircle },
  { to: "/app/risques", label: "Risques", icon: ShieldAlert },
  { to: "/app/livraisons", label: "Livraisons", icon: Truck },
  { to: "/app/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/app/import", label: "Import CSV", icon: Upload },
  { to: "/app/parametres", label: "Paramètres", icon: Settings },
] as const;

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { demoUser } = useApp();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-2 px-5 py-5">
        <span className="flex size-9 items-center justify-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground">
          <ShieldCheck className="size-5" />
        </span>
        <div className="leading-tight">
          <p className="font-display text-base font-semibold">Confirm.tn</p>
          <p className="text-[11px] text-sidebar-foreground/60">COD intelligence</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 pb-4">
        {NAV.map((item) => {
          const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
              )}
            >
              <item.icon className="size-4.5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-sidebar-border p-3">
        <Link
          to="/app/tarifs"
          onClick={onNavigate}
          className="mb-2 flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent/60"
        >
          <CreditCard className="size-4" />
          Tarifs
        </Link>
        <div className="rounded-xl bg-sidebar-accent/60 px-3 py-3">
          <p className="text-sm font-medium text-sidebar-accent-foreground">{demoUser.store}</p>
          <p className="text-xs text-sidebar-foreground/60">Plan : {demoUser.plan}</p>
        </div>
      </div>
    </div>
  );
}

export function AppShell({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-sidebar-border lg:block">
        <SidebarContent />
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-card/85 px-4 py-3 backdrop-blur md:px-6">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <SheetTitle className="sr-only">Navigation</SheetTitle>
              <SidebarContent onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>

          <div className="min-w-0 flex-1">
            <h1 className="truncate font-display text-lg font-semibold md:text-xl">{title}</h1>
            {subtitle ? (
              <p className="hidden truncate text-sm text-muted-foreground sm:block">{subtitle}</p>
            ) : null}
          </div>

          <div className="flex items-center gap-1.5">
            <Button variant="ghost" size="icon" className="hidden sm:inline-flex" aria-label="Recherche">
              <Search className="size-4.5" />
            </Button>
            <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
              <Bell className="size-4.5" />
              <span className="absolute right-2 top-2 size-2 rounded-full bg-danger" />
            </Button>
            <Link
              to="/app/parametres"
              className="ml-1 flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground"
            >
              AB
            </Link>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1400px] px-4 py-6 md:px-6 md:py-8">
          {actions ? <div className="mb-6 flex flex-wrap gap-2">{actions}</div> : null}
          {children}
        </main>
      </div>
    </div>
  );
}

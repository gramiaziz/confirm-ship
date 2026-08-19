import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowUpRight, Search, Sparkles, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmationBadge, DeliveryBadge, RiskBadge, dt } from "@/components/status";
import { WEEK_SERIES } from "@/lib/demo-data";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { title: "Tableau de bord — Confirm.tn" },
      {
        name: "description",
        content:
          "Suivez vos commandes COD, vos confirmations WhatsApp et vos commandes à risque en temps réel.",
      },
      { property: "og:title", content: "Tableau de bord — Confirm.tn" },
      {
        property: "og:description",
        content: "Performances quotidiennes de vos commandes Cash on Delivery.",
      },
    ],
  }),
  component: Dashboard,
});

const PERIODS = ["Aujourd'hui", "7 derniers jours", "30 jours"] as const;
const FILTERS = ["Toutes", "À risque élevé", "En attente", "Confirmées", "Retournées"] as const;

function Kpi({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "success" | "warning" | "danger";
}) {
  return (
    <div className="surface p-4 md:p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p
        className={cn(
          "mt-1 font-display text-2xl font-bold md:text-3xl",
          tone === "success" && "text-success",
          tone === "warning" && "text-warning-foreground",
          tone === "danger" && "text-danger",
        )}
      >
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function Dashboard() {
  const { orders, demoUser } = useApp();
  const [period, setPeriod] = useState<(typeof PERIODS)[number]>("Aujourd'hui");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("Toutes");
  const [query, setQuery] = useState("");

  const recent = useMemo(() => {
    let list = orders.slice(0, 12);
    if (filter === "À risque élevé") list = list.filter((o) => o.risk > 60);
    if (filter === "En attente") list = list.filter((o) => o.confirmation === "attente");
    if (filter === "Confirmées") list = list.filter((o) => o.confirmation === "confirmee");
    if (filter === "Retournées") list = list.filter((o) => o.delivery === "retournee");
    const q = query.trim().toLowerCase();
    if (q)
      list = list.filter(
        (o) =>
          o.customer.toLowerCase().includes(q) ||
          o.phone.includes(q) ||
          String(o.id).includes(q.replace("#", "")),
      );
    return list.slice(0, 6);
  }, [orders, filter, query]);

  return (
    <AppShell title={`Bonjour, ${demoUser.name} 👋`} subtitle="Voici les performances de vos commandes aujourd'hui.">
      <div className="mb-6 flex flex-wrap gap-2">
        {PERIODS.map((p) => (
          <Button
            key={p}
            size="sm"
            variant={p === period ? "default" : "outline"}
            onClick={() => setPeriod(p)}
          >
            {p}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <Kpi label="Commandes aujourd'hui" value="147" hint="+12% vs hier" />
        <Kpi label="Confirmées" value="112" hint="76.2%" tone="success" />
        <Kpi label="En attente" value="19" tone="warning" />
        <Kpi label="Annulées" value="16" />
        <Kpi label="Commandes à risque élevé" value="8" tone="danger" />
        <Kpi label="Valeur des commandes" value="12 840 DT" />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="surface p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-base font-semibold">Commandes des 7 derniers jours</h2>
            <span className="hidden items-center gap-1 text-xs text-success sm:flex">
              <TrendingUp className="size-3.5" /> +8.4% de confirmations
            </span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={WEEK_SERIES} margin={{ left: -20, right: 8, top: 8 }}>
                <defs>
                  {["c1", "c2", "c3", "c4"].map((id, i) => (
                    <linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={`var(--chart-${i + 1})`} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={`var(--chart-${i + 1})`} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="jour" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area
                  type="monotone"
                  dataKey="recues"
                  name="Reçues"
                  stroke="var(--chart-1)"
                  fill="url(#c1)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="confirmees"
                  name="Confirmées"
                  stroke="var(--chart-2)"
                  fill="url(#c2)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="livrees"
                  name="Livrées"
                  stroke="var(--chart-5)"
                  fill="url(#c5)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="retournees"
                  name="Retournées"
                  stroke="var(--chart-4)"
                  fill="url(#c4)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="surface flex flex-col justify-between bg-primary p-5 text-primary-foreground">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/15 px-2.5 py-1 text-xs font-medium">
              <Sparkles className="size-3.5" /> Impact estimé de Confirm.tn
            </span>
            <p className="mt-4 font-display text-3xl font-bold">420 DT</p>
            <p className="text-sm opacity-90">économisés ce mois-ci</p>
            <ul className="mt-5 space-y-2 text-sm opacity-95">
              <li>• 14 expéditions à risque évitées</li>
              <li>• 39 commandes récupérées après confirmation</li>
              <li>• Taux de confirmation : 76.2%</li>
            </ul>
          </div>
          <p className="mt-6 text-[11px] opacity-70">
            Estimation basée sur les commandes analysées.
          </p>
        </div>
      </div>

      <div className="surface mt-6 overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-border p-4 md:flex-row md:items-center md:justify-between">
          <h2 className="font-display text-base font-semibold">Commandes récentes</h2>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Client, téléphone, n° commande"
                className="w-full pl-8 sm:w-64"
              />
            </div>
            <Button asChild variant="outline">
             <Link
  to="/app/commandes"
  search={{ order: undefined }}
>
  Voir tout
</Link>
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-b border-border p-3">
          {FILTERS.map((f) => (
            <Button
              key={f}
              size="sm"
              variant={f === filter ? "secondary" : "ghost"}
              onClick={() => setFilter(f)}
            >
              {f}
            </Button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-medium">Commande</th>
                <th className="px-4 py-3 font-medium">Client</th>
                <th className="px-4 py-3 font-medium">Gouvernorat</th>
                <th className="px-4 py-3 font-medium">Montant</th>
                <th className="px-4 py-3 font-medium">Confirmation</th>
                <th className="px-4 py-3 font-medium">Risque</th>
                <th className="px-4 py-3 font-medium">Livraison</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((o) => (
                <tr key={o.id} className="border-b border-border/70 last:border-0 hover:bg-muted/50">
                  <td className="px-4 py-3 font-medium">#{o.id}</td>
                  <td className="px-4 py-3">{o.customer}</td>
                  <td className="px-4 py-3 text-muted-foreground">{o.governorate}</td>
                  <td className="px-4 py-3 tabular-nums">{dt(o.amount)}</td>
                  <td className="px-4 py-3">
                    <ConfirmationBadge status={o.confirmation} />
                  </td>
                  <td className="px-4 py-3">
                    <RiskBadge score={o.risk} />
                  </td>
                  <td className="px-4 py-3">
                    <DeliveryBadge status={o.delivery} />
                  </td>
                  <td className="px-4 py-3">
                    <Button asChild size="sm" variant="ghost">
                      <Link to="/app/commandes" search={{ order: o.id }}>
                        Détails <ArrowUpRight className="size-3.5" />
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}
              {recent.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">
                    Aucune commande ne correspond à ce filtre.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Période affichée : {period}. Données de démonstration.
      </p>
    </AppShell>
  );
}

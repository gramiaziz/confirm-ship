import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell } from "@/components/app-shell";
import { RATE_SERIES, RETURNS_BY_GOV, RISK_REASONS } from "@/lib/demo-data";

export const Route = createFileRoute("/app/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — Confirm.tn" },
      {
        name: "description",
        content:
          "Taux de confirmation, de livraison et de retour, retours par gouvernorat et coût estimé des retours.",
      },
      { property: "og:title", content: "Analytics — Confirm.tn" },
      { property: "og:description", content: "Analytique opérationnelle des commandes COD." },
    ],
  }),
  component: AnalyticsPage,
});

const PIE_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

const tooltipStyle = {
  background: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: 12,
  fontSize: 12,
};

function AnalyticsPage() {
  return (
    <AppShell title="Analytics" subtitle="Performances opérationnelles — données de démonstration">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="surface p-5">
          <h2 className="mb-4 font-display text-base font-semibold">
            Taux de confirmation, livraison et retour
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={RATE_SERIES} margin={{ left: -20, right: 8, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="semaine" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} unit="%" />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line
                  type="monotone"
                  dataKey="confirmation"
                  name="Confirmation"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="livraison"
                  name="Livraison"
                  stroke="var(--chart-2)"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="retour"
                  name="Retour"
                  stroke="var(--chart-4)"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="surface p-5">
          <h2 className="mb-4 font-display text-base font-semibold">Retours par gouvernorat</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={RETURNS_BY_GOV} margin={{ left: -20, right: 8, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="gouvernorat" tickLine={false} axisLine={false} fontSize={11} interval={0} angle={-25} height={54} textAnchor="end" />
                <YAxis tickLine={false} axisLine={false} fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="retours" name="Retours" fill="var(--chart-4)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="surface p-5">
          <h2 className="mb-4 font-display text-base font-semibold">
            Principales raisons des commandes risquées
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Pie
                  data={RISK_REASONS}
                  dataKey="valeur"
                  nameKey="raison"
                  innerRadius={55}
                  outerRadius={95}
                  paddingAngle={3}
                >
                  {RISK_REASONS.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="surface p-5">
          <h2 className="font-display text-base font-semibold">Coût estimé des retours</h2>
          <p className="text-sm text-muted-foreground">Estimation — données de démonstration</p>
          <div className="mt-5 space-y-4">
            <div className="rounded-xl border border-danger/25 bg-danger-soft p-4">
              <p className="text-sm">Sans Confirm.tn</p>
              <p className="font-display text-2xl font-bold text-danger">1 180 DT / mois</p>
            </div>
            <div className="rounded-xl border border-warning/30 bg-warning-soft p-4">
              <p className="text-sm">Estimé avec Confirm.tn</p>
              <p className="font-display text-2xl font-bold">760 DT / mois</p>
            </div>
            <div className="rounded-xl border border-success/25 bg-success-soft p-4">
              <p className="text-sm">Économie potentielle</p>
              <p className="font-display text-3xl font-bold text-success">420 DT / mois</p>
            </div>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Ces montants sont des estimations basées sur les commandes analysées.
          </p>
        </div>
      </div>
    </AppShell>
  );
}

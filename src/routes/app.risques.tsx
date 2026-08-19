import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RiskBadge, dt } from "@/components/status";
import { RISK_RULES } from "@/lib/demo-data";
import { useApp } from "@/lib/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/risques")({
  head: () => ({
    meta: [
      { title: "Centre de risque — Confirm.tn" },
      {
        name: "description",
        content:
          "Identifiez les commandes COD à risque élevé et ajustez vos règles de scoring avant expédition.",
      },
      { property: "og:title", content: "Centre de risque — Confirm.tn" },
      { property: "og:description", content: "Scoring de risque des commandes Cash on Delivery." },
    ],
  }),
  component: RiskPage,
});

function RiskPage() {
  const { orders } = useApp();
  const navigate = useNavigate();
  const [rules, setRules] = useState(RISK_RULES);

  const high = orders.filter((o) => o.risk > 60);
  const medium = orders.filter((o) => o.risk > 30 && o.risk <= 60);
  const low = orders.filter((o) => o.risk <= 30);

  return (
    <AppShell title="Centre de risque" subtitle="Analysez et bloquez les expéditions à risque">
      <Tabs defaultValue="centre">
        <TabsList>
          <TabsTrigger value="centre">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="regles">Règles de scoring</TabsTrigger>
        </TabsList>

        <TabsContent value="centre" className="mt-5 space-y-5">
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { l: "Risque élevé", v: high.length, tone: "danger" },
              { l: "Risque moyen", v: medium.length, tone: "warning" },
              { l: "Risque faible", v: low.length, tone: "success" },
            ].map((c) => (
              <div
                key={c.l}
                className={cn(
                  "surface p-5",
                  c.tone === "danger" && "border-danger/30 bg-danger-soft",
                  c.tone === "warning" && "border-warning/30 bg-warning-soft",
                  c.tone === "success" && "border-success/30 bg-success-soft",
                )}
              >
                <p className="text-sm font-medium">{c.l}</p>
                <p className="mt-1 font-display text-3xl font-bold">{c.v}</p>
                <p className="text-xs text-muted-foreground">commandes</p>
              </div>
            ))}
          </div>

          <div className="surface overflow-hidden">
            <div className="border-b border-border p-4">
              <h2 className="font-display text-base font-semibold">Commandes à risque élevé</h2>
              <p className="text-sm text-muted-foreground">
                Chaque score est expliqué par sa raison principale.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-4 py-3 font-medium">Commande</th>
                    <th className="px-4 py-3 font-medium">Client</th>
                    <th className="px-4 py-3 font-medium">Risque</th>
                    <th className="px-4 py-3 font-medium">Raison principale</th>
                    <th className="px-4 py-3 font-medium">Montant</th>
                    <th className="px-4 py-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {high.map((o) => (
                    <tr key={o.id} className="border-b border-border/70 last:border-0 hover:bg-muted/50">
                      <td className="px-4 py-3 font-medium">#{o.id}</td>
                      <td className="px-4 py-3">{o.customer}</td>
                      <td className="px-4 py-3">
                        <RiskBadge score={o.risk} />
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {o.riskFactors[0]?.label ?? "—"}
                      </td>
                      <td className="px-4 py-3 tabular-nums">{dt(o.amount)}</td>
                      <td className="px-4 py-3">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            navigate({ to: "/app/commandes", search: { order: o.id } })
                          }
                        >
                          Examiner
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="regles" className="mt-5 space-y-5">
          <div className="surface p-5">
            <h2 className="font-display text-base font-semibold">Règles de scoring</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              Score minimum : 0 · Score maximum : 100. Valeurs simulées pour le prototype.
            </p>
            <div className="space-y-3">
              {rules.map((r) => (
                <div
                  key={r.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-3"
                >
                  <span className="text-sm">{r.label}</span>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={r.points}
                      onChange={(e) =>
                        setRules((prev) =>
                          prev.map((x) =>
                            x.id === r.id ? { ...x, points: Number(e.target.value) } : x,
                          ),
                        )
                      }
                      className="w-24 tabular-nums"
                    />
                    <span className="text-xs text-muted-foreground">points</span>
                  </div>
                </div>
              ))}
            </div>
            <Button className="mt-4" onClick={() => toast.success("Règles enregistrées (démo)")}>
              Enregistrer les règles
            </Button>
          </div>

          <div className="surface p-5">
            <h3 className="font-display text-base font-semibold">Catégories de risque</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {[
                { r: "0–30", l: "🟢 Faible", c: "bg-success-soft text-success" },
                { r: "31–60", l: "🟠 Moyen", c: "bg-warning-soft text-warning-foreground" },
                { r: "61–100", l: "🔴 Élevé", c: "bg-danger-soft text-danger" },
              ].map((x) => (
                <div key={x.r} className={cn("rounded-xl p-4", x.c)}>
                  <p className="font-display text-lg font-semibold">{x.r}</p>
                  <p className="text-sm">{x.l}</p>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}

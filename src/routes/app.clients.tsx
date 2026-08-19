import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DeliveryBadge, RiskLevelBadge, dt } from "@/components/status";
import { customerRisk, successRate } from "@/lib/demo-data";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/clients")({
  head: () => ({
    meta: [
      { title: "Clients — Confirm.tn" },
      {
        name: "description",
        content: "Historique client, taux de réussite et niveau de risque de chaque acheteur COD.",
      },
      { property: "og:title", content: "Clients — Confirm.tn" },
      { property: "og:description", content: "Base clients et historique de livraison." },
    ],
  }),
  component: CustomersPage,
});

function CustomersPage() {
  const { customers, orders } = useApp();
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    return customers.filter((c) => !q || c.name.toLowerCase().includes(q) || c.phone.includes(q));
  }, [customers, query]);

  const selected = customers.find((c) => c.id === openId);
  const history = orders.filter((o) => o.customerId === openId);

  return (
    <AppShell title="Clients" subtitle={`${customers.length} clients analysés`}>
      <div className="surface mb-5 p-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un client ou un téléphone"
            className="pl-8"
          />
        </div>
      </div>

      <div className="surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="px-4 py-3 font-medium">Client</th>
                <th className="px-4 py-3 font-medium">Téléphone</th>
                <th className="px-4 py-3 font-medium">Total commandes</th>
                <th className="px-4 py-3 font-medium">Livrées</th>
                <th className="px-4 py-3 font-medium">Retournées</th>
                <th className="px-4 py-3 font-medium">Taux de réussite</th>
                <th className="px-4 py-3 font-medium">Niveau de risque</th>
              </tr>
            </thead>
            <tbody>
              {list.map((c) => {
                const rate = successRate(c);
                return (
                  <tr
                    key={c.id}
                    onClick={() => setOpenId(c.id)}
                    className="cursor-pointer border-b border-border/70 last:border-0 hover:bg-muted/50"
                  >
                    <td className="px-4 py-3 font-medium">{c.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{c.phone}</td>
                    <td className="px-4 py-3 tabular-nums">{c.orders}</td>
                    <td className="px-4 py-3 tabular-nums text-success">{c.delivered}</td>
                    <td className="px-4 py-3 tabular-nums text-danger">{c.returned}</td>
                    <td
                      className={cn(
                        "px-4 py-3 tabular-nums font-medium",
                        rate >= 75 ? "text-success" : rate >= 40 ? "text-warning-foreground" : "text-danger",
                      )}
                    >
                      {rate}%
                    </td>
                    <td className="px-4 py-3">
                      <RiskLevelBadge level={customerRisk(c)} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={Boolean(selected)} onOpenChange={(o) => !o && setOpenId(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selected?.name}</DialogTitle>
          </DialogHeader>
          {selected ? (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span>{selected.phone}</span>
                <span>·</span>
                <span>{selected.governorate}</span>
                <RiskLevelBadge level={customerRisk(selected)} />
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  { l: "Commandes", v: selected.orders },
                  { l: "Livrées", v: selected.delivered },
                  { l: "Retournées", v: selected.returned },
                  { l: "Valeur totale", v: dt(selected.totalValue) },
                ].map((s) => (
                  <div key={s.l} className="rounded-lg bg-muted/60 p-3">
                    <p className="text-xs text-muted-foreground">{s.l}</p>
                    <p className="font-display text-lg font-semibold">{s.v}</p>
                  </div>
                ))}
              </div>
              <ol className="space-y-3 border-l border-border pl-5">
                {history.map((o) => (
                  <li key={o.id} className="relative">
                    <span className="absolute -left-[26px] top-1.5 size-2.5 rounded-full bg-border" />
                    <p className="text-sm font-medium">
                      {o.date} · {dt(o.amount)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      #{o.id} — {o.product}
                    </p>
                    <div className="mt-1">
                      <DeliveryBadge status={o.delivery} />
                    </div>
                  </li>
                ))}
              </ol>
              <Button variant="outline" className="w-full" onClick={() => setOpenId(null)}>
                Fermer
              </Button>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

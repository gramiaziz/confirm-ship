import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Plus, Search, Upload } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConfirmationBadge, DeliveryBadge, RiskBadge, dt } from "@/components/status";
import { OrderDetail } from "@/components/order-detail";
import { DELIVERY_LABEL, CONFIRMATION_LABEL, GOVERNORATES } from "@/lib/demo-data";
import { useApp } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/app/commandes")({
  validateSearch: (search: Record<string, unknown>) => ({
    order: search["order"] ? Number(search["order"]) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Commandes — Confirm.tn" },
      {
        name: "description",
        content: "Gérez vos commandes Cash on Delivery : confirmation, risque et livraison.",
      },
      { property: "og:title", content: "Commandes — Confirm.tn" },
      { property: "og:description", content: "Gestion complète des commandes COD tunisiennes." },
    ],
  }),
  component: OrdersPage,
});

function OrdersPage() {
  const { orders } = useApp();
  const { order: selectedId } = Route.useSearch();
  const navigate = useNavigate({ from: "/app/commandes" });

  const [query, setQuery] = useState("");
  const [conf, setConf] = useState("all");
  const [risk, setRisk] = useState("all");
  const [delivery, setDelivery] = useState("all");
  const [gov, setGov] = useState("all");
  const [date, setDate] = useState("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((o) => {
      if (conf !== "all" && o.confirmation !== conf) return false;
      if (delivery !== "all" && o.delivery !== delivery) return false;
      if (gov !== "all" && o.governorate !== gov) return false;
      if (risk === "faible" && o.risk > 30) return false;
      if (risk === "moyen" && (o.risk <= 30 || o.risk > 60)) return false;
      if (risk === "eleve" && o.risk <= 60) return false;
      if (date === "7" && o.date < "2026-08-12") return false;
      if (date === "today" && o.date !== "2026-08-18") return false;
      if (
        q &&
        !o.customer.toLowerCase().includes(q) &&
        !o.phone.includes(q) &&
        !String(o.id).includes(q.replace("#", ""))
      )
        return false;
      return true;
    });
  }, [orders, query, conf, risk, delivery, gov, date]);

  const selected = orders.find((o) => o.id === selectedId);

  return (
    <AppShell title="Commandes" subtitle={`${filtered.length} commandes affichées`}>
      <div className="mb-5 flex flex-wrap gap-2">
        <Button variant="outline" onClick={() => navigate({ to: "/app/import", search: true as never })}>
          <Upload className="size-4" /> Importer CSV
        </Button>
        <Button onClick={() => toast.info("Formulaire de création — démo")}>
          <Plus className="size-4" /> Ajouter une commande
        </Button>
      </div>

      <div className="surface mb-5 grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-6">
        <div className="relative lg:col-span-2">
          <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Client, téléphone, n° commande"
            className="pl-8"
          />
        </div>
        <Select value={date} onValueChange={setDate}>
          <SelectTrigger>
            <SelectValue placeholder="Date" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les dates</SelectItem>
            <SelectItem value="today">Aujourd'hui</SelectItem>
            <SelectItem value="7">7 derniers jours</SelectItem>
          </SelectContent>
        </Select>
        <Select value={conf} onValueChange={setConf}>
          <SelectTrigger>
            <SelectValue placeholder="Confirmation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toute confirmation</SelectItem>
            {Object.entries(CONFIRMATION_LABEL).map(([k, v]) => (
              <SelectItem key={k} value={k}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={risk} onValueChange={setRisk}>
          <SelectTrigger>
            <SelectValue placeholder="Risque" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tout risque</SelectItem>
            <SelectItem value="faible">🟢 Faible</SelectItem>
            <SelectItem value="moyen">🟠 Moyen</SelectItem>
            <SelectItem value="eleve">🔴 Élevé</SelectItem>
          </SelectContent>
        </Select>
        <Select value={delivery} onValueChange={setDelivery}>
          <SelectTrigger>
            <SelectValue placeholder="Livraison" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toute livraison</SelectItem>
            {Object.entries(DELIVERY_LABEL).map(([k, v]) => (
              <SelectItem key={k} value={k}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={gov} onValueChange={setGov}>
          <SelectTrigger>
            <SelectValue placeholder="Gouvernorat" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous gouvernorats</SelectItem>
            {GOVERNORATES.map((g) => (
              <SelectItem key={g} value={g}>
                {g}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="surface overflow-hidden">
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
              {filtered.map((o) => (
                <tr
                  key={o.id}
                  onClick={() => navigate({ search: { order: o.id } })}
                  className="cursor-pointer border-b border-border/70 last:border-0 hover:bg-muted/50"
                >
                  <td className="px-4 py-3 font-medium">#{o.id}</td>
                  <td className="px-4 py-3">
                    <div>{o.customer}</div>
                    <div className="text-xs text-muted-foreground">{o.phone}</div>
                  </td>
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
                    <Button size="sm" variant="ghost">
                      Ouvrir
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Sheet
        open={Boolean(selected)}
        onOpenChange={(o) => {
          if (!o) navigate({ search: { order: undefined } });
        }}
      >
        <SheetContent side="right" className="w-full overflow-y-auto p-5 sm:max-w-xl">
          <SheetTitle className="sr-only">Détail de la commande</SheetTitle>
          {selected ? <OrderDetail order={selected} /> : null}
        </SheetContent>
      </Sheet>
    </AppShell>
  );
}

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Truck } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { RiskBadge, dt } from "@/components/status";
import { DELIVERY_LABEL, type DeliveryStatus } from "@/lib/demo-data";
import { useApp } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/app/livraisons")({
  head: () => ({
    meta: [
      { title: "Livraisons — Confirm.tn" },
      {
        name: "description",
        content: "Suivi des expéditions COD par statut et par transporteur tunisien.",
      },
      { property: "og:title", content: "Livraisons — Confirm.tn" },
      { property: "og:description", content: "Pipeline de livraison : à préparer, en transit, livrée, retournée." },
    ],
  }),
  component: DeliveriesPage,
});

const COLUMNS: DeliveryStatus[] = [
  "a_preparer",
  "expediee",
  "en_transit",
  "livree",
  "retournee",
];

const NEXT: Partial<Record<DeliveryStatus, DeliveryStatus>> = {
  a_preparer: "expediee",
  expediee: "en_transit",
  en_transit: "livree",
};

function DeliveriesPage() {
  const { orders, setDelivery } = useApp();
  const navigate = useNavigate();

  return (
    <AppShell title="Livraisons" subtitle="Transporteurs de démonstration : Aramex, Rapid Poste, Mylerz, local">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {COLUMNS.map((status) => {
          const list = orders.filter((o) => o.delivery === status);
          return (
            <div key={status} className="surface flex flex-col p-4">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold">{DELIVERY_LABEL[status]}</h2>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs tabular-nums text-muted-foreground">
                  {list.length}
                </span>
              </div>
              <div className="space-y-3">
                {list.slice(0, 8).map((o) => (
                  <div key={o.id} className="rounded-lg border border-border p-3">
                    <div className="flex items-center justify-between">
                      <button
                        className="text-sm font-medium hover:underline"
                        onClick={() => navigate({ to: "/app/commandes", search: { order: o.id } })}
                      >
                        #{o.id}
                      </button>
                      <span className="text-xs tabular-nums text-muted-foreground">
                        {dt(o.amount)}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {o.customer} · {o.governorate}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                      <Truck className="size-3.5" /> {o.courier}
                    </p>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <RiskBadge score={o.risk} showScore={false} />
                      {NEXT[status] ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setDelivery(o.id, NEXT[status]!);
                            toast.success(`#${o.id} → ${DELIVERY_LABEL[NEXT[status]!]}`);
                          }}
                        >
                          Avancer
                        </Button>
                      ) : null}
                    </div>
                  </div>
                ))}
                {list.length === 0 ? (
                  <p className="py-6 text-center text-xs text-muted-foreground">Aucune commande</p>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}

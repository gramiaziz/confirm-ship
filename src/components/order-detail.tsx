import { Phone, MessageCircle, Ban, MapPin, Package, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useApp } from "@/lib/store";
import { successRate, type Order } from "@/lib/demo-data";
import {
  ConfirmationBadge,
  DeliveryBadge,
  RiskGauge,
  RiskReasons,
  dt,
} from "@/components/status";
import { cn } from "@/lib/utils";

function Field({ label, value, icon: Icon }: { label: string; value: string; icon?: typeof Phone }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-0.5 flex items-center gap-1.5 text-sm font-medium">
        {Icon ? <Icon className="size-3.5 text-muted-foreground" /> : null}
        {value}
      </p>
    </div>
  );
}

export function OrderDetail({ order }: { order: Order }) {
  const { confirmOrder, blockOrder, customers, orders } = useApp();
  const customer = customers.find((c) => c.id === order.customerId);
  const history = orders
    .filter((o) => o.customerId === order.customerId && o.id !== order.id)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="surface p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-semibold">Commande #{order.id}</h2>
            <p className="text-sm text-muted-foreground">
              {order.date} · {order.courier}
            </p>
          </div>
          <div className="flex gap-2">
            <ConfirmationBadge status={order.confirmation} />
            <DeliveryBadge status={order.delivery} />
          </div>
        </div>

        <Separator className="my-4" />

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Field label="Client" value={order.customer} />
          <Field label="Téléphone" value={order.phone} icon={Phone} />
          <Field label="Localisation" value={`${order.governorate} — ${order.address}`} icon={MapPin} />
          <Field label="Produit" value={order.product} icon={Package} />
          <Field label="Taille" value={order.size} />
          <Field label="Couleur" value={order.color} />
          <Field label="Montant" value={dt(order.amount)} />
          <Field label="Paiement" value="Cash on Delivery" icon={CreditCard} />
          <Field
            label="Statut"
            value={
              order.confirmation === "confirmee"
                ? "Confirmée par le client"
                : order.confirmation === "annulee"
                  ? "Annulée"
                  : "En attente de confirmation"
            }
          />
        </div>
      </div>

      <div className="surface p-5">
        <h3 className="font-display text-base font-semibold">Score de risque</h3>
        <div className="mt-4">
          <RiskGauge score={order.risk} />
        </div>

        <Separator className="my-5" />

        <h4 className="mb-3 text-sm font-semibold">Pourquoi cette commande est risquée ?</h4>
        <RiskReasons factors={order.riskFactors} />

        <div
          className={cn(
            "mt-5 rounded-xl border p-4",
            order.risk > 60
              ? "border-danger/25 bg-danger-soft"
              : order.risk > 30
                ? "border-warning/30 bg-warning-soft"
                : "border-success/25 bg-success-soft",
          )}
        >
          <p className="text-xs font-semibold uppercase tracking-wide">Recommandation</p>
          <p className="mt-1 text-sm">
            {order.risk > 60
              ? "« Contactez le client avant d'expédier cette commande. »"
              : order.risk > 30
                ? "« Confirmez la taille et l'adresse avant expédition. »"
                : "« Commande fiable, expédition possible immédiatement. »"}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => toast.info(`Appel simulé vers ${order.phone}`)}>
            <Phone className="size-4" /> Appeler le client
          </Button>
          <Button
            onClick={() => {
              confirmOrder(order.id);
              toast.success("Message WhatsApp de confirmation envoyé (démo)");
            }}
          >
            <MessageCircle className="size-4" /> Envoyer confirmation WhatsApp
          </Button>
          <Button
            variant="outline"
            className="text-danger"
            onClick={() => {
              blockOrder(order.id);
              toast.warning("Expédition bloquée");
            }}
          >
            <Ban className="size-4" /> Bloquer l'expédition
          </Button>
        </div>
      </div>

      <div className="surface p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-base font-semibold">Historique client</h3>
          <span className="text-sm text-muted-foreground">{customer?.orders ?? 1} commandes</span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Livrées", value: customer?.delivered ?? 0, tone: "text-success" },
            { label: "Retournées", value: customer?.returned ?? 0, tone: "text-danger" },
            { label: "En cours", value: customer?.inProgress ?? 0, tone: "text-warning-foreground" },
            {
              label: "Valeur totale",
              value: dt(customer?.totalValue ?? order.amount),
              tone: "text-foreground",
            },
          ].map((s) => (
            <div key={s.label} className="rounded-lg bg-muted/60 p-3">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className={cn("font-display text-lg font-semibold", s.tone)}>{s.value}</p>
            </div>
          ))}
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          Taux de réussite : {customer ? successRate(customer) : 0}%
        </p>

        <ol className="mt-5 space-y-4 border-l border-border pl-5">
          {history.map((h) => (
            <li key={h.id} className="relative">
              <span className="absolute -left-[26px] top-1.5 size-2.5 rounded-full bg-border" />
              <p className="text-sm font-medium">
                {h.date} · {dt(h.amount)}
              </p>
              <p className="text-xs text-muted-foreground">
                Commande #{h.id} — {h.product}
              </p>
              <div className="mt-1">
                <DeliveryBadge status={h.delivery} />
              </div>
            </li>
          ))}
          <li className="relative">
            <span className="absolute -left-[26px] top-1.5 size-2.5 rounded-full bg-primary" />
            <p className="text-sm font-medium">Actuelle · {dt(order.amount)}</p>
            <div className="mt-1">
              <DeliveryBadge status={order.delivery} />
            </div>
          </li>
        </ol>
      </div>
    </div>
  );
}

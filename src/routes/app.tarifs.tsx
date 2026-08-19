import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/tarifs")({
  head: () => ({
    meta: [
      { title: "Tarifs — Confirm.tn" },
      {
        name: "description",
        content: "Starter 29 DT, Growth 79 DT, Pro 149 DT par mois pour vos commandes COD.",
      },
      { property: "og:title", content: "Tarifs — Confirm.tn" },
      { property: "og:description", content: "Des plans simples pour les marchands tunisiens." },
    ],
  }),
  component: PricingPage,
});

export const PLANS = [
  {
    name: "Starter",
    price: "29 DT",
    features: [
      "Jusqu'à 100 commandes",
      "Gestion des commandes",
      "Tableau de confirmation",
      "Scoring de risque basique",
    ],
  },
  {
    name: "Growth",
    price: "79 DT",
    recommended: true,
    features: [
      "Jusqu'à 500 commandes",
      "Automatisation WhatsApp",
      "Historique client",
      "Scoring de risque",
      "Analytics",
    ],
  },
  {
    name: "Pro",
    price: "149 DT",
    features: [
      "Jusqu'à 1 500 commandes",
      "Règles de risque avancées",
      "Analytics de livraison",
      "Support prioritaire",
      "Reporting avancé",
    ],
  },
];

export function PricingCards() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {PLANS.map((p) => (
        <div
          key={p.name}
          className={cn(
            "surface flex flex-col p-6",
            p.recommended && "border-primary/40 ring-2 ring-primary/20",
          )}
        >
          {p.recommended ? (
            <span className="mb-3 inline-flex w-fit rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground">
              Recommandé
            </span>
          ) : null}
          <h3 className="font-display text-lg font-semibold">{p.name}</h3>
          <p className="mt-1">
            <span className="font-display text-3xl font-bold">{p.price}</span>
            <span className="text-sm text-muted-foreground"> / mois</span>
          </p>
          <ul className="mt-5 flex-1 space-y-2 text-sm">
            {p.features.map((f) => (
              <li key={f} className="flex items-start gap-2">
                <Check className="mt-0.5 size-4 shrink-0 text-success" />
                <span className="text-muted-foreground">{f}</span>
              </li>
            ))}
          </ul>
          <Button
            className="mt-6"
            variant={p.recommended ? "default" : "outline"}
            onClick={() => toast.success(`Plan ${p.name} sélectionné (démo)`)}
          >
            Essayer
          </Button>
        </div>
      ))}
    </div>
  );
}

function PricingPage() {
  return (
    <AppShell title="Tarifs" subtitle="Choisissez le plan adapté à votre volume de commandes">
      <PricingCards />
      <p className="mt-4 text-xs text-muted-foreground">
        Facturation en dinar tunisien. Version MVP — aucun paiement réel n'est traité.
      </p>
    </AppShell>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MessageCircle, Building2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/app/parametres")({
  head: () => ({
    meta: [
      { title: "Paramètres — Confirm.tn" },
      {
        name: "description",
        content: "Configurez votre boutique, WhatsApp, le modèle de risque et vos notifications.",
      },
      { property: "og:title", content: "Paramètres — Confirm.tn" },
      { property: "og:description", content: "Réglages de votre compte marchand Confirm.tn." },
    ],
  }),
  component: SettingsPage,
});

const NOTIFS = [
  "Commande à risque élevé",
  "Annulation client",
  "Commande retournée",
  "Aucune réponse après 30 min",
];

function SettingsPage() {
  const { autoRisk, setAutoRisk, blockThreshold, setBlockThreshold } = useApp();
  const [notifs, setNotifs] = useState<Record<string, boolean>>({
    "Commande à risque élevé": true,
    "Annulation client": true,
    "Commande retournée": true,
    "Aucune réponse après 30 min": false,
  });

  return (
    <AppShell title="Paramètres" subtitle="Compte marchand — mode démonstration">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="surface p-5">
          <h2 className="flex items-center gap-2 font-display text-base font-semibold">
            <Building2 className="size-4" /> Entreprise
          </h2>
          <div className="mt-4 space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Nom</Label>
              <Input id="name" defaultValue="Fashion Store TN" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Téléphone</Label>
              <Input id="phone" defaultValue="+216 71 445 200" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="contact@fashionstore.tn" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="logo">Logo</Label>
              <Input id="logo" type="file" />
            </div>
            <Button onClick={() => toast.success("Informations enregistrées")}>Enregistrer</Button>
          </div>
        </div>

        <div className="surface p-5">
          <h2 className="flex items-center gap-2 font-display text-base font-semibold">
            <MessageCircle className="size-4" /> WhatsApp
          </h2>
          <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-warning/30 bg-warning-soft px-3 py-1 text-xs font-medium">
            Statut : Mode démo
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            « Pour cette version MVP, les conversations WhatsApp sont simulées. »
          </p>
          <Button
            className="mt-4"
            variant="outline"
            onClick={() => toast.info("Connexion WhatsApp Business disponible prochainement")}
          >
            Connecter WhatsApp Business
          </Button>

          <Separator className="my-6" />

          <h3 className="font-display text-base font-semibold">Modèle de risque</h3>
          <div className="mt-4 flex items-center justify-between gap-4">
            <Label htmlFor="autorisk">Calcul automatique du risque</Label>
            <Switch id="autorisk" checked={autoRisk} onCheckedChange={setAutoRisk} />
          </div>
          <div className="mt-5">
            <div className="flex items-center justify-between text-sm">
              <span>Bloquer l'expédition si le risque dépasse</span>
              <span className="font-display text-lg font-semibold tabular-nums">
                {blockThreshold}
              </span>
            </div>
            <Slider
              className="mt-3"
              value={[blockThreshold]}
              min={0}
              max={100}
              step={5}
              onValueChange={(v) => setBlockThreshold(v[0] ?? 75)}
            />
          </div>
        </div>

        <div className="surface p-5 lg:col-span-2">
          <h2 className="font-display text-base font-semibold">Notifications</h2>
          <div className="mt-4 space-y-3">
            {NOTIFS.map((n) => (
              <div
                key={n}
                className="flex items-center justify-between gap-4 rounded-lg border border-border p-3"
              >
                <Label htmlFor={n}>{n}</Label>
                <Switch
                  id={n}
                  checked={notifs[n] ?? false}
                  onCheckedChange={(v) => setNotifs((p) => ({ ...p, [n]: v }))}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

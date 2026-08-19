import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, FileSpreadsheet, Upload, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";

export const Route = createFileRoute("/app/import")({
  head: () => ({
    meta: [
      { title: "Import CSV — Confirm.tn" },
      {
        name: "description",
        content: "Importez vos commandes en masse depuis un fichier CSV et détectez les lignes à corriger.",
      },
      { property: "og:title", content: "Import CSV — Confirm.tn" },
      { property: "og:description", content: "Import de commandes COD en quelques secondes." },
    ],
  }),
  component: ImportPage,
});

const COLUMNS = [
  "customer_name",
  "phone",
  "product",
  "quantity",
  "amount",
  "address",
  "governorate",
];

function ImportPage() {
  const [analyzed, setAnalyzed] = useState(false);
  const { setImportedCount, importedCount } = useApp();
  const navigate = useNavigate();

  return (
    <AppShell title="Import CSV" subtitle="Importez vos commandes en masse (simulation MVP)">
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="surface p-6 lg:col-span-2">
          <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border p-10 text-center">
            <FileSpreadsheet className="size-10 text-muted-foreground" />
            <p className="mt-3 font-medium">Déposez votre fichier CSV ici</p>
            <p className="text-sm text-muted-foreground">ou sélectionnez-le depuis votre ordinateur</p>
            <Button
              className="mt-4"
              onClick={() => {
                setAnalyzed(true);
                toast.success("commandes_aout.csv analysé");
              }}
            >
              <Upload className="size-4" /> Importer un fichier CSV
            </Button>
          </div>

          {analyzed ? (
            <div className="mt-6 space-y-3">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-border p-4">
                  <p className="text-sm text-muted-foreground">Commandes détectées</p>
                  <p className="font-display text-2xl font-bold">500</p>
                </div>
                <div className="rounded-xl border border-success/25 bg-success-soft p-4">
                  <p className="text-sm">Valides</p>
                  <p className="font-display text-2xl font-bold text-success">487</p>
                </div>
                <div className="rounded-xl border border-warning/30 bg-warning-soft p-4">
                  <p className="text-sm">Nécessitent une correction</p>
                  <p className="font-display text-2xl font-bold">13</p>
                </div>
              </div>
              <div className="flex items-start gap-2 rounded-lg bg-muted/60 p-3 text-sm text-muted-foreground">
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-warning-foreground" />
                13 lignes ont un numéro de téléphone ou une adresse incomplète.
              </div>
              <Button
                onClick={() => {
                  setImportedCount(487);
                  toast.success("487 commandes importées (démo)");
                  navigate({ to: "/app/commandes", search: { order: undefined } });
                }}
              >
                <CheckCircle2 className="size-4" /> Importer les commandes
              </Button>
            </div>
          ) : null}

          {importedCount > 0 ? (
            <p className="mt-4 text-sm text-success">
              Dernier import : {importedCount} commandes ajoutées à la file de confirmation.
            </p>
          ) : null}
        </div>

        <div className="surface p-6">
          <h2 className="font-display text-base font-semibold">Colonnes attendues</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {COLUMNS.map((c) => (
              <li key={c} className="rounded-md bg-muted/60 px-3 py-2 font-mono text-xs">
                {c}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-muted-foreground">
            Le fichier doit être encodé en UTF-8. Import simulé pour cette version MVP.
          </p>
        </div>
      </div>
    </AppShell>
  );
}

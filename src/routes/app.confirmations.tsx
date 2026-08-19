import { createFileRoute } from "@tanstack/react-router";
import { Check, Pencil, X, Bot, Clock } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";
import { dt } from "@/components/status";

export const Route = createFileRoute("/app/confirmations")({
  head: () => ({
    meta: [
      { title: "Confirmations WhatsApp — Confirm.tn" },
      {
        name: "description",
        content:
          "Conversations de confirmation WhatsApp simulées et interprétation automatique des réponses clients.",
      },
      { property: "og:title", content: "Confirmations WhatsApp — Confirm.tn" },
      {
        property: "og:description",
        content: "Confirmez vos commandes COD par message avant expédition.",
      },
    ],
  }),
  component: ConfirmationsPage,
});

const STATS = [
  { label: "Messages envoyés", value: "147" },
  { label: "Réponses", value: "121" },
  { label: "Confirmations", value: "112", tone: "text-success" },
  { label: "Modifications", value: "9", tone: "text-warning-foreground" },
  { label: "Annulations", value: "16", tone: "text-danger" },
  { label: "Temps de réponse moyen", value: "4m 32s" },
];

function ConfirmationsPage() {
  const { conversations, orders, applyConversation } = useApp();

  return (
    <AppShell
      title="Confirmations"
      subtitle="Conversations WhatsApp simulées — mode démo"
    >
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {STATS.map((s) => (
          <div key={s.label} className="surface p-4">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className={cn("mt-1 font-display text-2xl font-bold", s.tone)}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {conversations.map((c) => {
          const order = orders.find((o) => o.id === c.orderId);
          return (
            <div key={c.id} className="surface overflow-hidden">
              <div className="flex items-center justify-between border-b border-border bg-whatsapp-soft px-4 py-3">
                <div>
                  <p className="text-sm font-semibold">{c.customer}</p>
                  <p className="text-xs text-muted-foreground">
                    Commande #{c.orderId} · {order ? dt(order.amount) : ""}
                  </p>
                </div>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="size-3.5" /> {c.sentAt}
                </span>
              </div>

              <div className="space-y-3 bg-muted/40 p-4">
                <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-card px-3.5 py-2.5 shadow-sm">
                  <p className="mb-1 text-[11px] font-semibold text-whatsapp">Confirm.tn</p>
                  <p className="whitespace-pre-line text-sm leading-relaxed">{c.outgoing}</p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <span className="rounded-md border border-border bg-background px-2 py-1 text-xs">
                      ✅ تأكيد
                    </span>
                    <span className="rounded-md border border-border bg-background px-2 py-1 text-xs">
                      ✏️ تعديل
                    </span>
                    <span className="rounded-md border border-border bg-background px-2 py-1 text-xs">
                      ❌ إلغاء
                    </span>
                  </div>
                </div>

                {c.reply ? (
                  <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-whatsapp px-3.5 py-2.5 text-sm text-primary-foreground shadow-sm">
                    {c.reply}
                  </div>
                ) : (
                  <div className="ml-auto max-w-[85%] rounded-2xl border border-dashed border-border px-3.5 py-2.5 text-sm text-muted-foreground">
                    Aucune réponse du client…
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="rounded-xl border border-border bg-accent/40 p-4">
                  <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide">
                    <Bot className="size-3.5" /> Réponse comprise
                  </p>
                  <Separator className="my-3" />
                  <dl className="space-y-2 text-sm">
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">Intent</dt>
                      <dd className="text-right font-medium">{c.intent}</dd>
                    </div>
                    {c.change ? (
                      <div className="flex justify-between gap-4">
                        <dt className="text-muted-foreground">Modification détectée</dt>
                        <dd className="text-right font-medium">
                          {c.change.field} : {c.change.from} → {c.change.to}
                        </dd>
                      </div>
                    ) : null}
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted-foreground">Résultat</dt>
                      <dd className="text-right font-medium">{c.result}</dd>
                    </div>
                  </dl>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    disabled={c.applied || c.intent === "SANS RÉPONSE"}
                    onClick={() => {
                      applyConversation(c.id);
                      toast.success(
                        c.change
                          ? `Modification appliquée : ${c.change.field} ${c.change.from} → ${c.change.to}`
                          : "Commande mise à jour",
                      );
                    }}
                  >
                    <Check className="size-4" />
                    {c.applied
                      ? "Appliquée"
                      : c.change
                        ? "Appliquer la modification"
                        : "Appliquer le résultat"}
                  </Button>
                  <Button variant="outline" onClick={() => toast.info("Message de relance envoyé (démo)")}>
                    <Pencil className="size-4" /> Relancer
                  </Button>
                  <Button
                    variant="ghost"
                    className="text-danger"
                    onClick={() => toast.warning("Conversation ignorée")}
                  >
                    <X className="size-4" /> Ignorer
                  </Button>
                </div>

                {order ? (
                  <p className="mt-3 text-xs text-muted-foreground">
                    État actuel : {order.product} · Taille {order.size} · Risque {order.risk}/100
                  </p>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}

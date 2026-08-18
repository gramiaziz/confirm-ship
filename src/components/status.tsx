import { cn } from "@/lib/utils";
import {
  CONFIRMATION_LABEL,
  DELIVERY_LABEL,
  RISK_EMOJI,
  RISK_LABEL,
  riskLevel,
  type ConfirmationStatus,
  type DeliveryStatus,
  type RiskFactor,
  type RiskLevel,
} from "@/lib/demo-data";

const base =
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap";

const riskTone: Record<RiskLevel, string> = {
  faible: "border-success/25 bg-success-soft text-success",
  moyen: "border-warning/30 bg-warning-soft text-warning-foreground",
  eleve: "border-danger/25 bg-danger-soft text-danger",
};

export function RiskBadge({ score, showScore = true }: { score: number; showScore?: boolean }) {
  const level = riskLevel(score);
  return (
    <span className={cn(base, riskTone[level])}>
      <span aria-hidden>{RISK_EMOJI[level]}</span>
      {showScore ? `${score} – ${RISK_LABEL[level]}` : RISK_LABEL[level]}
    </span>
  );
}

export function RiskLevelBadge({ level }: { level: RiskLevel }) {
  return (
    <span className={cn(base, riskTone[level])}>
      <span aria-hidden>{RISK_EMOJI[level]}</span>
      {RISK_LABEL[level]}
    </span>
  );
}

const confirmTone: Record<ConfirmationStatus, string> = {
  confirmee: "border-success/25 bg-success-soft text-success",
  attente: "border-warning/30 bg-warning-soft text-warning-foreground",
  non_confirmee: "border-danger/25 bg-danger-soft text-danger",
  annulee: "border-border bg-muted text-muted-foreground",
};

export function ConfirmationBadge({ status }: { status: ConfirmationStatus }) {
  return <span className={cn(base, confirmTone[status])}>{CONFIRMATION_LABEL[status]}</span>;
}

const deliveryTone: Record<DeliveryStatus, string> = {
  en_attente: "border-border bg-muted text-muted-foreground",
  a_preparer: "border-info/25 bg-info-soft text-info",
  en_preparation: "border-info/25 bg-info-soft text-info",
  expediee: "border-primary/25 bg-accent text-accent-foreground",
  en_transit: "border-primary/25 bg-accent text-accent-foreground",
  livree: "border-success/25 bg-success-soft text-success",
  retournee: "border-danger/25 bg-danger-soft text-danger",
  bloquee: "border-danger/25 bg-danger-soft text-danger",
};

export function DeliveryBadge({ status }: { status: DeliveryStatus }) {
  return <span className={cn(base, deliveryTone[status])}>{DELIVERY_LABEL[status]}</span>;
}

const gaugeTone: Record<RiskLevel, string> = {
  faible: "bg-success",
  moyen: "bg-warning",
  eleve: "bg-danger",
};

export function RiskGauge({ score }: { score: number }) {
  const level = riskLevel(score);
  return (
    <div className="space-y-2">
      <div className="flex items-end justify-between">
        <div className="flex items-baseline gap-1">
          <span className="font-display text-4xl font-bold tabular-nums">{score}</span>
          <span className="text-sm text-muted-foreground">/ 100</span>
        </div>
        <span className={cn(base, "uppercase tracking-wide", riskTone[level])}>
          <span aria-hidden>{RISK_EMOJI[level]}</span>
          Risque {RISK_LABEL[level]}
        </span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full transition-all duration-500", gaugeTone[level])}
          style={{ width: `${score}%` }}
        />
      </div>
      <div className="flex justify-between text-[11px] text-muted-foreground">
        <span>0–30 Faible</span>
        <span>31–60 Moyen</span>
        <span>61–100 Élevé</span>
      </div>
    </div>
  );
}

export function RiskReasons({ factors }: { factors: RiskFactor[] }) {
  return (
    <ul className="space-y-2">
      {factors.map((f) => (
        <li key={f.label} className="flex items-start gap-3 text-sm">
          <span
            className={cn(
              "mt-0.5 inline-flex min-w-11 justify-center rounded-md px-1.5 py-0.5 text-xs font-semibold tabular-nums",
              f.points > 0 ? "bg-danger-soft text-danger" : "bg-success-soft text-success",
            )}
          >
            {f.points > 0 ? `+${f.points}` : f.points}
          </span>
          <span className="text-muted-foreground">{f.label}</span>
        </li>
      ))}
    </ul>
  );
}

export function dt(amount: number) {
  return `${amount.toLocaleString("fr-FR")} DT`;
}

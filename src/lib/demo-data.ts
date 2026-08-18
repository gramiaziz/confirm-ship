export type ConfirmationStatus = "confirmee" | "attente" | "non_confirmee" | "annulee";
export type DeliveryStatus =
  | "en_attente"
  | "a_preparer"
  | "en_preparation"
  | "expediee"
  | "en_transit"
  | "livree"
  | "retournee"
  | "bloquee";
export type RiskLevel = "faible" | "moyen" | "eleve";

export type RiskFactor = { points: number; label: string };

export type Order = {
  id: number;
  date: string;
  customerId: string;
  customer: string;
  phone: string;
  governorate: string;
  address: string;
  product: string;
  size: string;
  color: string;
  quantity: number;
  amount: number;
  confirmation: ConfirmationStatus;
  risk: number;
  riskFactors: RiskFactor[];
  delivery: DeliveryStatus;
  courier: string;
};

export type Customer = {
  id: string;
  name: string;
  phone: string;
  governorate: string;
  orders: number;
  delivered: number;
  returned: number;
  inProgress: number;
  totalValue: number;
};

export const CONFIRMATION_LABEL: Record<ConfirmationStatus, string> = {
  confirmee: "Confirmée",
  attente: "En attente",
  non_confirmee: "Non confirmée",
  annulee: "Annulée",
};

export const DELIVERY_LABEL: Record<DeliveryStatus, string> = {
  en_attente: "En attente",
  a_preparer: "À préparer",
  en_preparation: "En préparation",
  expediee: "Expédiée",
  en_transit: "En transit",
  livree: "Livrée",
  retournee: "Retournée",
  bloquee: "Bloquée",
};

export const GOVERNORATES = [
  "Tunis",
  "Sfax",
  "Sousse",
  "Ariana",
  "Nabeul",
  "Ben Arous",
  "Bizerte",
  "Jendouba",
  "Monastir",
  "Gabès",
];

export const COURIERS = ["Aramex", "Rapid Poste", "Mylerz", "Transporteur local"];

export function riskLevel(score: number): RiskLevel {
  if (score <= 30) return "faible";
  if (score <= 60) return "moyen";
  return "eleve";
}

export const RISK_LABEL: Record<RiskLevel, string> = {
  faible: "Faible",
  moyen: "Moyen",
  eleve: "Élevé",
};

export const RISK_EMOJI: Record<RiskLevel, string> = {
  faible: "🟢",
  moyen: "🟠",
  eleve: "🔴",
};

export const RISK_RULES = [
  { id: "r1", label: "Commande précédente retournée", points: 25 },
  { id: "r2", label: "2 commandes retournées ou plus", points: 45 },
  { id: "r3", label: "Adresse incomplète", points: 15 },
  { id: "r4", label: "Aucune réponse WhatsApp", points: 20 },
  { id: "r5", label: "Panier > 3× la moyenne", points: 10 },
  { id: "r6", label: "3 livraisons réussies ou plus", points: -20 },
  { id: "r7", label: "Confirmation immédiate", points: -10 },
];

const NAMES: Array<[string, string, string]> = [
  ["Ahmed Ben Salah", "+216 55 123 456", "Tunis"],
  ["Mariem Trabelsi", "+216 98 447 210", "Sousse"],
  ["Mohamed Gharbi", "+216 22 845 671", "Sfax"],
  ["Sarra Jlassi", "+216 24 336 909", "Nabeul"],
  ["Yassine Mansour", "+216 52 771 034", "Ariana"],
  ["Imen Saidi", "+216 29 118 552", "Ben Arous"],
  ["Houssem Ayari", "+216 20 664 187", "Bizerte"],
  ["Rayen Chaabane", "+216 53 902 447", "Jendouba"],
  ["Amira Ben Amor", "+216 26 540 118", "Monastir"],
  ["Aziz Bouzid", "+216 92 087 336", "Gabès"],
  ["Nour Hammami", "+216 54 220 913", "Tunis"],
  ["Skander Khelifi", "+216 27 665 042", "Sfax"],
  ["Ines Bouazizi", "+216 96 331 780", "Sousse"],
  ["Wassim Dridi", "+216 21 448 605", "Ariana"],
  ["Fatma Zouari", "+216 55 903 214", "Nabeul"],
];

const PRODUCTS: Array<[string, string, string]> = [
  ["Nike Air Max", "42", "Noir"],
  ["Veste en jean oversize", "M", "Bleu"],
  ["Robe été fleurie", "S", "Beige"],
  ["Sneakers Adidas Gazelle", "40", "Blanc"],
  ["Sac à main cuir", "Unique", "Marron"],
  ["Hoodie premium", "L", "Gris"],
  ["Chemise lin", "XL", "Blanc"],
  ["Montre classique", "Unique", "Argent"],
  ["Ensemble survêtement", "M", "Noir"],
  ["Baskets running", "44", "Rouge"],
];

const ADDRESSES = [
  "12 Rue de Marseille, Lafayette",
  "Avenue Habib Bourguiba, Immeuble Yasmine",
  "Cité El Ghazela, Bloc B",
  "Route de Gremda km 4",
  "Rue Ibn Khaldoun (sans numéro)",
  "Cité Ennasr 2, App 14",
  "Boulevard 14 Janvier, Résidence Perle",
  "Sans précision, appeler avant",
];

function seeded(i: number, mod: number) {
  return (i * 7919 + 104729) % mod;
}

function factorsFor(score: number, i: number): RiskFactor[] {
  if (score >= 61) {
    return [
      { points: 30, label: "2 commandes précédentes retournées" },
      { points: 20, label: "Aucune réponse au premier message WhatsApp" },
      { points: 17, label: "Adresse incomplète" },
      { points: 15, label: "Panier supérieur à la moyenne" },
    ].slice(0, 3 + (i % 2));
  }
  if (score >= 31) {
    return [
      { points: 25, label: "1 commande précédente retournée" },
      { points: 15, label: "Adresse incomplète" },
      { points: 10, label: "Réponse WhatsApp tardive" },
    ].slice(0, 2 + (i % 2));
  }
  return [
    { points: 10, label: "Nouveau client" },
    { points: -20, label: "3 livraisons réussies ou plus" },
    { points: -10, label: "Confirmation immédiate" },
  ].slice(0, 2 + (i % 2));
}

const FIXED: Partial<Order>[] = [
  {
    id: 1245,
    customer: "Ahmed Ben Salah",
    governorate: "Tunis",
    amount: 89,
    confirmation: "confirmee",
    risk: 14,
    delivery: "expediee",
  },
  {
    id: 1246,
    customer: "Mariem Trabelsi",
    governorate: "Sousse",
    amount: 145,
    confirmation: "attente",
    risk: 51,
    delivery: "en_attente",
  },
  {
    id: 1247,
    customer: "Mohamed Gharbi",
    governorate: "Sfax",
    amount: 239,
    confirmation: "non_confirmee",
    risk: 82,
    delivery: "bloquee",
    product: "Nike Air Max",
    size: "42",
    color: "Noir",
    address: "Route de Gremda km 4 (adresse incomplète)",
  },
  {
    id: 1248,
    customer: "Sarra Jlassi",
    governorate: "Nabeul",
    amount: 69,
    confirmation: "confirmee",
    risk: 8,
    delivery: "livree",
  },
  {
    id: 1249,
    customer: "Yassine Mansour",
    governorate: "Ariana",
    amount: 189,
    confirmation: "confirmee",
    risk: 37,
    delivery: "en_preparation",
  },
  {
    id: 1255,
    customer: "Houssem Ayari",
    governorate: "Bizerte",
    amount: 320,
    confirmation: "non_confirmee",
    risk: 78,
    delivery: "bloquee",
  },
  {
    id: 1262,
    customer: "Imen Saidi",
    governorate: "Ben Arous",
    amount: 189,
    confirmation: "non_confirmee",
    risk: 73,
    delivery: "bloquee",
  },
];

function customerId(name: string) {
  return name.toLowerCase().replace(/[^a-z]+/g, "-");
}

function buildOrders(): Order[] {
  const orders: Order[] = [];
  const deliveries: DeliveryStatus[] = [
    "livree",
    "expediee",
    "en_transit",
    "a_preparer",
    "retournee",
    "en_preparation",
    "livree",
    "livree",
  ];
  const confirmations: ConfirmationStatus[] = [
    "confirmee",
    "confirmee",
    "attente",
    "confirmee",
    "annulee",
    "non_confirmee",
    "confirmee",
    "attente",
  ];

  for (let i = 0; i < 46; i++) {
    const id = 1245 + i;
    const fixed = FIXED.find((f) => f.id === id);
    const nameIdx = seeded(i, NAMES.length);
    const [name, phone, gov] = NAMES[nameIdx]!;
    const [product, size, color] = PRODUCTS[seeded(i + 3, PRODUCTS.length)]!;
    const amount = 35 + seeded(i + 5, 416);
    const risk = seeded(i + 11, 100);
    const day = 18 - (i % 14);
    const base: Order = {
      id,
      date: `2026-08-${String(day).padStart(2, "0")}`,
      customerId: customerId(name),
      customer: name,
      phone,
      governorate: gov,
      address: ADDRESSES[seeded(i + 2, ADDRESSES.length)]!,
      product,
      size,
      color,
      quantity: 1 + (i % 2),
      amount,
      confirmation: confirmations[i % confirmations.length]!,
      risk,
      riskFactors: factorsFor(risk, i),
      delivery: deliveries[i % deliveries.length]!,
      courier: COURIERS[seeded(i + 1, COURIERS.length)]!,
    };
    if (fixed) {
      const merged: Order = { ...base, ...fixed } as Order;
      merged.customerId = customerId(merged.customer);
      merged.phone = NAMES.find((n) => n[0] === merged.customer)?.[1] ?? merged.phone;
      merged.riskFactors =
        merged.id === 1247
          ? [
              { points: 30, label: "2 commandes précédentes retournées" },
              { points: 20, label: "Aucune réponse au premier message WhatsApp" },
              { points: 17, label: "Adresse incomplète" },
              { points: 15, label: "Panier supérieur à la moyenne" },
            ]
          : factorsFor(merged.risk, i);
      orders.push(merged);
    } else {
      orders.push(base);
    }
  }
  return orders;
}

export const INITIAL_ORDERS: Order[] = buildOrders();

export function buildCustomers(orders: Order[]): Customer[] {
  const map = new Map<string, Customer>();
  for (const o of orders) {
    const existing =
      map.get(o.customerId) ??
      ({
        id: o.customerId,
        name: o.customer,
        phone: o.phone,
        governorate: o.governorate,
        orders: 0,
        delivered: 0,
        returned: 0,
        inProgress: 0,
        totalValue: 0,
      } as Customer);
    existing.orders += 1;
    existing.totalValue += o.amount;
    if (o.delivery === "livree") existing.delivered += 1;
    else if (o.delivery === "retournee") existing.returned += 1;
    else existing.inProgress += 1;
    map.set(o.customerId, existing);
  }
  return [...map.values()].sort((a, b) => b.orders - a.orders);
}

export function successRate(c: Customer) {
  const closed = c.delivered + c.returned;
  return closed === 0 ? 0 : Math.round((c.delivered / closed) * 1000) / 10;
}

export function customerRisk(c: Customer): RiskLevel {
  const rate = successRate(c);
  if (c.returned >= 2 || rate < 40) return "eleve";
  if (c.returned === 1 || rate < 75) return "moyen";
  return "faible";
}

export const WEEK_SERIES = [
  { jour: "Mer", recues: 118, confirmees: 88, livrees: 71, retournees: 11 },
  { jour: "Jeu", recues: 132, confirmees: 99, livrees: 80, retournees: 13 },
  { jour: "Ven", recues: 156, confirmees: 121, livrees: 98, retournees: 9 },
  { jour: "Sam", recues: 174, confirmees: 133, livrees: 110, retournees: 14 },
  { jour: "Dim", recues: 96, confirmees: 71, livrees: 58, retournees: 8 },
  { jour: "Lun", recues: 141, confirmees: 108, livrees: 92, retournees: 12 },
  { jour: "Mar", recues: 147, confirmees: 112, livrees: 89, retournees: 10 },
];

export const RETURNS_BY_GOV = [
  { gouvernorat: "Tunis", retours: 12 },
  { gouvernorat: "Sfax", retours: 21 },
  { gouvernorat: "Sousse", retours: 14 },
  { gouvernorat: "Ariana", retours: 9 },
  { gouvernorat: "Nabeul", retours: 7 },
  { gouvernorat: "Ben Arous", retours: 11 },
  { gouvernorat: "Bizerte", retours: 8 },
  { gouvernorat: "Jendouba", retours: 16 },
];

export const RISK_REASONS = [
  { raison: "Historique de retour", valeur: 34 },
  { raison: "Absence de réponse", valeur: 26 },
  { raison: "Adresse incomplète", valeur: 18 },
  { raison: "Panier inhabituel", valeur: 13 },
  { raison: "Modifications fréquentes", valeur: 9 },
];

export const RATE_SERIES = [
  { semaine: "S1", confirmation: 68, livraison: 71, retour: 22 },
  { semaine: "S2", confirmation: 71, livraison: 74, retour: 19 },
  { semaine: "S3", confirmation: 74, livraison: 78, retour: 16 },
  { semaine: "S4", confirmation: 76, livraison: 81, retour: 13 },
];

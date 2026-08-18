import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  INITIAL_ORDERS,
  buildCustomers,
  type ConfirmationStatus,
  type Customer,
  type DeliveryStatus,
  type Order,
} from "./demo-data";

export type Conversation = {
  id: string;
  orderId: number;
  customer: string;
  sentAt: string;
  outgoing: string;
  reply: string | null;
  intent: "CONFIRMATION" | "CONFIRMATION AVEC MODIFICATION" | "ANNULATION" | "SANS RÉPONSE";
  change: { field: string; from: string; to: string } | null;
  result: string;
  applied: boolean;
};

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: "c1",
    orderId: 1247,
    customer: "Mohamed Gharbi",
    sentAt: "09:42",
    outgoing:
      "عسلامة محمد 👋\nنحبوا نأكدوا الـcommande متاعك:\nNike Air Max\nTaille 42\nNoir\n239 DT\nالعنوان: Sfax\nتأكدلنا الطلب؟",
    reply: "اي اما نحب taille 43",
    intent: "CONFIRMATION AVEC MODIFICATION",
    change: { field: "Taille", from: "42", to: "43" },
    result: "Commande confirmée",
    applied: false,
  },
  {
    id: "c2",
    orderId: 1246,
    customer: "Mariem Trabelsi",
    sentAt: "10:05",
    outgoing:
      "عسلامة مريم 👋\nالـcommande متاعك:\nVeste en jean oversize\nTaille M\n145 DT\nالعنوان: Sousse\nنأكدو الـlivraison؟",
    reply: "اي برشا مرسي، نستنى الـlivraison 🙏",
    intent: "CONFIRMATION",
    change: null,
    result: "Commande confirmée",
    applied: false,
  },
  {
    id: "c3",
    orderId: 1255,
    customer: "Houssem Ayari",
    sentAt: "10:31",
    outgoing:
      "عسلامة حسام 👋\nنأكدو الـcommande:\nSac à main cuir\n320 DT\nالعنوان: Bizerte\nتنجم تعطينا العنوان الكامل؟",
    reply: null,
    intent: "SANS RÉPONSE",
    change: null,
    result: "Aucune réponse — expédition à risque",
    applied: false,
  },
  {
    id: "c4",
    orderId: 1262,
    customer: "Imen Saidi",
    sentAt: "11:12",
    outgoing: "عسلامة إيمان 👋\nالـcommande متاعك 189 DT، نأكدوها؟",
    reply: "لا سامحني، ما عادش نحب نشريها",
    intent: "ANNULATION",
    change: null,
    result: "Commande annulée par le client",
    applied: false,
  },
];

type Ctx = {
  orders: Order[];
  customers: Customer[];
  conversations: Conversation[];
  demoUser: { name: string; store: string; plan: string };
  updateOrder: (id: number, patch: Partial<Order>) => void;
  confirmOrder: (id: number) => void;
  cancelOrder: (id: number) => void;
  blockOrder: (id: number) => void;
  setDelivery: (id: number, delivery: DeliveryStatus) => void;
  setConfirmation: (id: number, confirmation: ConfirmationStatus) => void;
  applyConversation: (conversationId: string) => void;
  importedCount: number;
  setImportedCount: (n: number) => void;
  autoRisk: boolean;
  setAutoRisk: (v: boolean) => void;
  blockThreshold: number;
  setBlockThreshold: (v: number) => void;
};

const AppContext = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);
  const [importedCount, setImportedCount] = useState(0);
  const [autoRisk, setAutoRisk] = useState(true);
  const [blockThreshold, setBlockThreshold] = useState(75);

  const value = useMemo<Ctx>(() => {
    const updateOrder = (id: number, patch: Partial<Order>) =>
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, ...patch } : o)));

    return {
      orders,
      customers: buildCustomers(orders),
      conversations,
      demoUser: { name: "Ahmed", store: "Fashion Store TN", plan: "Growth" },
      updateOrder,
      confirmOrder: (id) =>
        setOrders((prev) =>
          prev.map((o) =>
            o.id === id
              ? {
                  ...o,
                  confirmation: "confirmee",
                  risk: Math.max(0, o.risk - 25),
                  riskFactors: [
                    ...o.riskFactors.filter((f) => !f.label.includes("réponse")),
                    { points: -25, label: "Client a confirmé la commande via WhatsApp" },
                  ],
                  delivery: o.delivery === "bloquee" ? "a_preparer" : o.delivery,
                }
              : o,
          ),
        ),
      cancelOrder: (id) => updateOrder(id, { confirmation: "annulee", delivery: "bloquee" }),
      blockOrder: (id) => updateOrder(id, { delivery: "bloquee" }),
      setDelivery: (id, delivery) => updateOrder(id, { delivery }),
      setConfirmation: (id, confirmation) => updateOrder(id, { confirmation }),
      applyConversation: (conversationId) => {
        const conv = conversations.find((c) => c.id === conversationId);
        if (!conv) return;
        setConversations((prev) =>
          prev.map((c) => (c.id === conversationId ? { ...c, applied: true } : c)),
        );
        if (conv.intent === "ANNULATION") {
          updateOrder(conv.orderId, { confirmation: "annulee", delivery: "bloquee" });
          return;
        }
        if (conv.intent === "SANS RÉPONSE") return;
        setOrders((prev) =>
          prev.map((o) =>
            o.id === conv.orderId
              ? {
                  ...o,
                  ...(conv.change?.field === "Taille" ? { size: conv.change.to } : {}),
                  confirmation: "confirmee" as ConfirmationStatus,
                  risk: Math.max(0, o.risk - 45),
                  riskFactors: [
                    { points: -45, label: "Commande confirmée par le client sur WhatsApp" },
                    ...o.riskFactors.filter((f) => f.points > 0).slice(0, 1),
                  ],
                  delivery: "a_preparer" as DeliveryStatus,
                }
              : o,
          ),
        );
      },
      importedCount,
      setImportedCount,
      autoRisk,
      setAutoRisk,
      blockThreshold,
      setBlockThreshold,
    };
  }, [orders, conversations, importedCount, autoRisk, blockThreshold]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

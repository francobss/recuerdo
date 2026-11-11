import { Compass, Crown, Flame, Flower2, Gift, Heart } from "lucide-react";

// Ícono y color de acento por categoría (detalle visual del ticket).
export const CATEGORY_VISUALS = {
  carino: { icon: Heart, accent: "#D99BAF" },
  consentida: { icon: Flower2, accent: "#C9A46A" },
  experiencias: { icon: Compass, accent: "#A5748A" },
  traviesos: { icon: Flame, accent: "#75485B" },
  legendarios: { icon: Crown, accent: "#B8893F" },
  bonus: { icon: Gift, accent: "#D99BAF" },
};

export function formatDateTime(timestamp) {
  if (!timestamp) return "";
  return new Intl.DateTimeFormat("es-AR", { dateStyle: "long", timeStyle: "short" }).format(timestamp);
}

export function couponCode(coupon) {
  return `VALE-${String(coupon.number).padStart(3, "0")}`;
}

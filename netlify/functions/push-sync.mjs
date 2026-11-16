import { getStore } from "@netlify/blobs";

// POST /api/push-sync  { subscription, notifyAt }
// Guarda (o actualiza) la suscripción push del dispositivo y cuándo hay que avisarle
// (ms epoch; null = no avisar). Una entrada por dispositivo, indexada por endpoint.
export const config = { path: "/api/push-sync" };

const DAY = 24 * 60 * 60 * 1000;

export default async (req) => {
  if (req.method !== "POST") return new Response("Método no permitido", { status: 405 });

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response("Pedido inválido", { status: 400 });
  }
  const { subscription, notifyAt } = body ?? {};
  const endpoint = subscription?.endpoint;
  if (
    typeof endpoint !== "string" ||
    !endpoint.startsWith("https://") ||
    !subscription?.keys?.p256dh ||
    !subscription?.keys?.auth
  ) {
    return new Response("Suscripción inválida", { status: 400 });
  }
  const when =
    typeof notifyAt === "number" && Number.isFinite(notifyAt) && notifyAt > 0
      ? Math.min(notifyAt, Date.now() + 2 * DAY)
      : null;

  const store = getStore("push");
  const subs = (await store.get("subs", { type: "json" })) ?? [];
  const i = subs.findIndex((s) => s.subscription.endpoint === endpoint);
  const entry = { subscription, notifyAt: when };
  if (i >= 0) subs[i] = entry;
  else subs.push(entry);
  await store.setJSON("subs", subs.slice(-20));

  return new Response(JSON.stringify({ ok: true }), {
    headers: { "Content-Type": "application/json" },
  });
};

import { getStore } from "@netlify/blobs";
import webpush from "web-push";

// Función programada: cada 10 minutos manda el aviso a los dispositivos
// cuyo momento de desbloqueo (notifyAt) ya llegó.
export const config = { schedule: "*/10 * * * *" };

export default async () => {
  const { VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT } = process.env;
  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    console.log("Faltan VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY: no se envían avisos.");
    return;
  }
  webpush.setVapidDetails(VAPID_SUBJECT || "mailto:nadie@example.com", VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

  const store = getStore("push");
  const subs = (await store.get("subs", { type: "json" })) ?? [];
  const ahora = Date.now();
  const payload = JSON.stringify({
    titulo: "Tu sorpresa de hoy ya está lista 🎁",
    cuerpo: "Entrá a descubrir tu próximo cupón.",
    url: "/cupones",
  });

  const resultado = [];
  for (const entry of subs) {
    if (!entry.notifyAt || entry.notifyAt > ahora) {
      resultado.push(entry);
      continue;
    }
    try {
      await webpush.sendNotification(entry.subscription, payload, { TTL: 60 * 60 * 24 });
      resultado.push({ ...entry, notifyAt: null });
    } catch (err) {
      // 404/410: el dispositivo ya no existe, se descarta. Otro error: se reintenta en la próxima corrida.
      if (err.statusCode !== 404 && err.statusCode !== 410) resultado.push(entry);
    }
  }
  await store.setJSON("subs", resultado);
};

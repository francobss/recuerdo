import { useCallback, useEffect, useState } from "react";

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

export const pushSoportado =
  typeof window !== "undefined" &&
  "serviceWorker" in navigator &&
  "PushManager" in window &&
  "Notification" in window &&
  Boolean(VAPID_PUBLIC_KEY);

function claveAUint8(base64) {
  const relleno = "=".repeat((4 - (base64.length % 4)) % 4);
  const raw = atob((base64 + relleno).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

async function obtenerSuscripcion(crear) {
  const reg = await navigator.serviceWorker.ready;
  const existente = await reg.pushManager.getSubscription();
  if (existente || !crear) return existente;
  return reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: claveAUint8(VAPID_PUBLIC_KEY),
  });
}

async function enviar(subscription, notifyAt) {
  await fetch("/api/push-sync", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ subscription: subscription.toJSON(), notifyAt }),
  });
}

/**
 * Avisos push cuando se habilita la próxima sorpresa.
 * notifyAt: ms epoch del próximo desbloqueo (o null si ya se puede / no hay más).
 */
export function usePushAvisos(notifyAt) {
  const [permiso, setPermiso] = useState(() =>
    pushSoportado ? Notification.permission : "unsupported"
  );
  const [suscripto, setSuscripto] = useState(false);

  // Si ya hay permiso y suscripción, mantiene al servidor al día con el próximo desbloqueo.
  useEffect(() => {
    if (!pushSoportado || permiso !== "granted") return;
    let cancelado = false;
    obtenerSuscripcion(false)
      .then(async (sub) => {
        if (cancelado || !sub) return;
        setSuscripto(true);
        await enviar(sub, notifyAt);
      })
      .catch(() => {});
    return () => {
      cancelado = true;
    };
  }, [permiso, notifyAt]);

  const activar = useCallback(async () => {
    if (!pushSoportado) return false;
    const res = await Notification.requestPermission();
    setPermiso(res);
    if (res !== "granted") return false;
    try {
      const sub = await obtenerSuscripcion(true);
      await enviar(sub, notifyAt);
      setSuscripto(true);
      return true;
    } catch {
      return false;
    }
  }, [notifyAt]);

  return { permiso, suscripto, activar };
}

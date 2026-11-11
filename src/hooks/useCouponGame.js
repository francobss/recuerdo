import { useCallback, useEffect, useMemo, useState } from "react";
import { COUPONS, TOTAL_COUPONS } from "../data/coupons";
import { pickCoupon } from "../utils/couponRandomizer";
import {
  STORAGE_KEY,
  canUnlock,
  getNextUnlockAt,
  getStats,
  getUnlockedIds,
  importProgress,
  parseProgress,
  readState,
  redeemCoupon,
  serializeProgress,
  unlockCoupon,
} from "../utils/couponStorage";

const MAX_TIMEOUT = 2 ** 31 - 1;

export function useCouponGame() {
  const [state, setState] = useState(readState);
  const [, setTick] = useState(0);
  const rerender = useCallback(() => setTick((n) => n + 1), []);

  // Sincroniza con otras pestañas abiertas.
  useEffect(() => {
    function onStorage(event) {
      if (event.key === null || event.key === STORAGE_KEY) setState(readState());
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const now = Date.now();
  const nextUnlockAt = getNextUnlockAt(state, now);
  const stats = getStats(state);
  const canDiscover = canUnlock(state, now);

  // Re-evalúa justo cuando termina la espera, y al volver a la pestaña.
  useEffect(() => {
    const wait = nextUnlockAt === null ? 0 : nextUnlockAt - Date.now();
    let timer;
    if (wait > 0) timer = setTimeout(rerender, Math.min(wait + 50, MAX_TIMEOUT));
    function onVisible() {
      if (document.visibilityState === "visible") rerender();
    }
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [nextUnlockAt, rerender]);

  const coupons = useMemo(
    () =>
      COUPONS.map((item) => {
        const entry = state.coupons[item.id];
        if (!entry) return { ...item, status: "locked", unlockedAt: null, redeemedAt: null };
        return {
          ...item,
          status: entry.redeemedAt !== null ? "redeemed" : "available",
          unlockedAt: entry.unlockedAt,
          redeemedAt: entry.redeemedAt,
        };
      }),
    [state]
  );

  /** Sortea y guarda un cupón nuevo. Devuelve el cupón o null si no corresponde. */
  const discover = useCallback(() => {
    const fresh = readState();
    if (!canUnlock(fresh)) {
      setState(fresh);
      return null;
    }
    const chosen = pickCoupon(COUPONS, new Set(getUnlockedIds(fresh)));
    if (!chosen) return null;
    const result = unlockCoupon(chosen.id);
    setState(result.state);
    if (!result.ok) return null;
    return { ...chosen, unlockedAt: result.state.coupons[chosen.id].unlockedAt, redeemedAt: null, status: "available" };
  }, []);

  const redeem = useCallback((couponId) => {
    const result = redeemCoupon(couponId);
    setState(result.state);
    return result.ok;
  }, []);

  const exportProgress = useCallback(() => serializeProgress(readState()), []);

  /** Valida un archivo de respaldo sin aplicarlo. */
  const previewImport = useCallback((text) => {
    const parsed = parseProgress(text);
    if (!parsed.ok) return parsed;
    return { ok: true, state: parsed.state, stats: getStats(parsed.state) };
  }, []);

  const applyImport = useCallback((importedState) => {
    const result = importProgress(importedState);
    setState(result.state);
    return result.persisted;
  }, []);

  return {
    coupons,
    stats,
    total: TOTAL_COUPONS,
    nextUnlockAt,
    canDiscover,
    discover,
    redeem,
    exportProgress,
    previewImport,
    applyImport,
  };
}

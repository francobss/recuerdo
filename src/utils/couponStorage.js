// Persistencia local de "La colección de Vale". Sin backend: todo vive en
// localStorage del navegador y dispositivo actual.
//
// Forma del estado guardado (JSON):
// {
//   version: 1,
//   lastUnlockAt: 1700000000000 | null,      // instante (ms epoch) del último descubrimiento
//   coupons: {
//     "vale-001": { unlockedAt: 1700000000000, redeemedAt: null | 1700000000000 }
//   }
// }
//
// Los ids de cupón que ya no existan en el catálogo se conservan en el
// almacenamiento (no se pierde nada por tocar el catálogo) pero no cuentan.

import { COUPONS_BY_ID, TOTAL_COUPONS, UNLOCK_INTERVAL_MS } from "../data/coupons";

export const STORAGE_KEY = "vale_coupon_game_v1";
export const STATE_VERSION = 1;
export const EXPORT_APP_ID = "vale-coupon-game";

// Copia en memoria: solo se usa si localStorage no deja leer o escribir (modo privado, cuota, etc.).
let memoryFallback = null;
let storageFailed = false;

export function createEmptyState() {
  return { version: STATE_VERSION, lastUnlockAt: null, coupons: {} };
}

function isTimestamp(value) {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

/** Normaliza cualquier cosa leída del disco o de un archivo importado. */
export function sanitizeState(raw) {
  const state = createEmptyState();
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return state;

  const source = raw.coupons && typeof raw.coupons === "object" && !Array.isArray(raw.coupons)
    ? raw.coupons
    : {};

  let newestUnlock = 0;
  for (const [id, entry] of Object.entries(source)) {
    if (!entry || typeof entry !== "object" || !isTimestamp(entry.unlockedAt)) continue;
    state.coupons[id] = {
      unlockedAt: entry.unlockedAt,
      redeemedAt: isTimestamp(entry.redeemedAt) ? entry.redeemedAt : null,
    };
    newestUnlock = Math.max(newestUnlock, entry.unlockedAt);
  }

  if (isTimestamp(raw.lastUnlockAt)) {
    state.lastUnlockAt = raw.lastUnlockAt;
  } else if (newestUnlock > 0) {
    state.lastUnlockAt = newestUnlock;
  }
  return state;
}

export function readState() {
  if (storageFailed && memoryFallback) return sanitizeState(memoryFallback);
  try {
    const text = window.localStorage.getItem(STORAGE_KEY);
    if (text === null) return createEmptyState();
    try {
      return sanitizeState(JSON.parse(text));
    } catch {
      // Dato corrupto: se guarda una copia aparte para no destruirlo y se arranca limpio.
      try {
        window.localStorage.setItem(`${STORAGE_KEY}_corrupt`, text);
      } catch {
        /* sin espacio o sin acceso: se ignora */
      }
      return createEmptyState();
    }
  } catch {
    storageFailed = true;
    return memoryFallback ? sanitizeState(memoryFallback) : createEmptyState();
  }
}

/** Guarda el estado. Devuelve true si quedó persistido en localStorage. */
export function writeState(state) {
  const clean = sanitizeState(state);
  memoryFallback = clean;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
    storageFailed = false;
    return true;
  } catch {
    storageFailed = true;
    return false;
  }
}

/** Ids desbloqueados que existen en el catálogo actual. */
export function getUnlockedIds(state) {
  return Object.keys(state.coupons).filter((id) => id in COUPONS_BY_ID);
}

export function getStats(state) {
  const ids = getUnlockedIds(state);
  const redeemed = ids.filter((id) => state.coupons[id].redeemedAt !== null).length;
  return {
    total: TOTAL_COUPONS,
    unlocked: ids.length,
    redeemed,
    available: ids.length - redeemed,
    isComplete: ids.length >= TOTAL_COUPONS,
  };
}

/**
 * Cuándo se puede volver a descubrir: lastUnlockAt + 24 h, con timestamps reales.
 * Si el reloj del dispositivo retrocedió (lastUnlockAt en el futuro), la espera
 * se acota a 24 h desde ahora para no dejar el juego bloqueado por días.
 */
export function getNextUnlockAt(state, now = Date.now()) {
  if (!isTimestamp(state.lastUnlockAt)) return null;
  return Math.min(state.lastUnlockAt, now) + UNLOCK_INTERVAL_MS;
}

export function canUnlock(state, now = Date.now()) {
  if (getStats(state).isComplete) return false;
  const next = getNextUnlockAt(state, now);
  return next === null || now >= next;
}

/**
 * Desbloquea un cupón concreto. Relee el estado guardado para validar contra
 * lo último que hay en disco (por ejemplo si hay otra pestaña abierta).
 */
export function unlockCoupon(couponId, now = Date.now()) {
  const state = readState();
  if (!(couponId in COUPONS_BY_ID)) return { ok: false, reason: "unknown", state };
  if (couponId in state.coupons) return { ok: false, reason: "already-unlocked", state };
  if (!canUnlock(state, now)) return { ok: false, reason: "too-soon", state };

  const next = {
    ...state,
    lastUnlockAt: now,
    coupons: { ...state.coupons, [couponId]: { unlockedAt: now, redeemedAt: null } },
  };
  const persisted = writeState(next);
  return { ok: true, state: next, persisted };
}

/** Marca un cupón desbloqueado como canjeado. No toca el desbloqueo diario. */
export function redeemCoupon(couponId, now = Date.now()) {
  const state = readState();
  const entry = state.coupons[couponId];
  if (!entry || !(couponId in COUPONS_BY_ID)) return { ok: false, reason: "not-unlocked", state };
  if (entry.redeemedAt !== null) return { ok: false, reason: "already-redeemed", state };

  const next = {
    ...state,
    coupons: { ...state.coupons, [couponId]: { ...entry, redeemedAt: now } },
  };
  const persisted = writeState(next);
  return { ok: true, state: next, persisted };
}

/* ---------- Exportar / importar ---------- */

export function serializeProgress(state, now = Date.now()) {
  return JSON.stringify(
    { app: EXPORT_APP_ID, version: STATE_VERSION, exportedAt: now, state: sanitizeState(state) },
    null,
    2
  );
}

/** Valida el contenido de un archivo de respaldo. No escribe nada. */
export function parseProgress(text) {
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    return { ok: false, error: "El archivo no es un JSON válido." };
  }
  if (!data || typeof data !== "object" || data.app !== EXPORT_APP_ID || typeof data.state !== "object" || data.state === null) {
    return { ok: false, error: "Este archivo no parece una copia de La colección de Vale." };
  }
  if (typeof data.version === "number" && data.version > STATE_VERSION) {
    return { ok: false, error: "La copia es de una versión más nueva de la colección." };
  }
  const state = sanitizeState(data.state);
  if (Object.keys(state.coupons).length === 0 && !isTimestamp(state.lastUnlockAt)) {
    return { ok: false, error: "La copia no contiene progreso para restaurar." };
  }
  return { ok: true, state };
}

/** Reemplaza el progreso guardado por el de una copia ya validada. */
export function importProgress(state) {
  const clean = sanitizeState(state);
  const persisted = writeState(clean);
  return { ok: true, state: clean, persisted };
}

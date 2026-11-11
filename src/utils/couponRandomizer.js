import { RARITIES } from "../data/coupons";

/**
 * Elige un cupón que todavía no fue desbloqueado.
 *
 * 1. Agrupa los cupones restantes por rareza.
 * 2. Elige una rareza según su peso (solo entre las que todavía tienen cupones).
 * 3. Elige un cupón al azar dentro de esa rareza.
 *
 * Como solo se consideran rarezas con cupones disponibles, el sorteo nunca se
 * "atasca" cuando quedan pocos: siempre devuelve algo mientras haya restantes.
 *
 * @param {ReadonlyArray<object>} catalog
 * @param {Set<string>|ReadonlyArray<string>} unlockedIds
 * @param {() => number} rng  función que devuelve un número en [0, 1)
 * @returns {object|null} cupón elegido, o null si la colección está completa
 */
export function pickCoupon(catalog, unlockedIds, rng = Math.random) {
  const taken = unlockedIds instanceof Set ? unlockedIds : new Set(unlockedIds);
  const remaining = catalog.filter((item) => !taken.has(item.id));
  if (remaining.length === 0) return null;

  const groups = new Map();
  for (const item of remaining) {
    if (!groups.has(item.rarity)) groups.set(item.rarity, []);
    groups.get(item.rarity).push(item);
  }

  const weighted = [...groups.entries()].map(([rarity, list]) => ({
    list,
    weight: Math.max(0, RARITIES[rarity]?.weight ?? 0),
  }));
  const total = weighted.reduce((sum, group) => sum + group.weight, 0);

  // Si por configuración todos los pesos fueran 0, sorteo parejo entre los restantes.
  if (total <= 0) return remaining[randomIndex(remaining.length, rng)];

  let roll = clamp01(rng()) * total;
  for (const group of weighted) {
    if (roll < group.weight) return group.list[randomIndex(group.list.length, rng)];
    roll -= group.weight;
  }
  const last = weighted[weighted.length - 1].list;
  return last[randomIndex(last.length, rng)];
}

function clamp01(value) {
  return Number.isFinite(value) ? Math.min(Math.max(value, 0), 0.9999999) : 0;
}

function randomIndex(length, rng) {
  return Math.min(length - 1, Math.floor(clamp01(rng()) * length));
}

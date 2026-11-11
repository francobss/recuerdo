export const WELCOME_MESSAGES = [
  "Hoy puede tocarte algo lindo.",
  "Una sorpresa más para vos.",
  "La colección sigue creciendo.",
  "No abras todos los regalos de una vez.",
  "Las mejores sorpresas tienen su momento.",
];

export function randomWelcomeMessage(rng = Math.random) {
  return WELCOME_MESSAGES[Math.floor(rng() * WELCOME_MESSAGES.length)];
}

const UNITS = [
  "cero", "uno", "dos", "tres", "cuatro", "cinco", "seis", "siete", "ocho", "nueve",
  "diez", "once", "doce", "trece", "catorce", "quince", "dieciséis", "diecisiete",
  "dieciocho", "diecinueve", "veinte", "veintiuno", "veintidós", "veintitrés",
  "veinticuatro", "veinticinco", "veintiséis", "veintisiete", "veintiocho", "veintinueve",
];
const TENS = ["", "", "", "treinta", "cuarenta", "cincuenta", "sesenta", "setenta", "ochenta", "noventa"];

// Número en palabras (0–99) para los textos que dependen del tamaño del catálogo.
export function numberToWords(n) {
  if (!Number.isInteger(n) || n < 0 || n > 99) return String(n);
  if (n < 30) return UNITS[n];
  const tens = TENS[Math.floor(n / 10)];
  const unit = n % 10;
  return unit === 0 ? tens : `${tens} y ${UNITS[unit]}`;
}

export function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

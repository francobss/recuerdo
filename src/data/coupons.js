// Catálogo de "La colección de Vale".
//
// Todo lo que se puede ajustar del juego vive acá:
//  - UNLOCK_INTERVAL_MS: tiempo entre descubrimientos.
//  - RARITIES: peso de cada rareza en el sorteo (más alto = más frecuente).
//  - CATEGORIES: nombre visible de cada categoría.
//  - COUPONS: el listado de cupones.
//
// Probabilidades: el sorteo primero elige una rareza según su peso (solo entre
// las que todavía tienen cupones sin descubrir) y después un cupón al azar de
// esa rareza. Así los comunes salen más seguido y los legendarios menos, y el
// juego siempre puede seguir sorteando aunque queden pocos cupones.
// Si agregás o sacás cupones, el total y los textos se ajustan solos.

export const UNLOCK_INTERVAL_MS = 24 * 60 * 60 * 1000;

export const RARITIES = {
  comun: { label: "Común", weight: 38, level: 1 },
  pococomun: { label: "Poco común", weight: 27, level: 2 },
  especial: { label: "Especial", weight: 20, level: 3 },
  raro: { label: "Raro", weight: 11, level: 4 },
  legendario: { label: "Legendario", weight: 4, level: 5 },
};

export const CATEGORIES = {
  carino: { label: "Cariño" },
  consentida: { label: "Consentida" },
  experiencias: { label: "Experiencias" },
  traviesos: { label: "Traviesos" },
  legendarios: { label: "Legendarios" },
  bonus: { label: "Colección especial" },
};

function coupon(number, category, rarity, title, description) {
  return Object.freeze({
    id: `vale-${String(number).padStart(3, "0")}`,
    number,
    title,
    description,
    category,
    rarity,
    // Peso de la rareza (ver RARITIES). Se deriva para no repetirlo 40 veces.
    probability: RARITIES[rarity].weight,
  });
}

export const COUPONS = Object.freeze([
  // CARIÑO — comunes
  coupon(1, "carino", "comun", "Abrazo interminable", "Un abrazo de esos que hacen que el mundo pueda esperar."),
  coupon(2, "carino", "comun", "Lluvia de besos", "Todos los besos que quieras, sin límite de cantidad."),
  coupon(3, "carino", "comun", "Mimos sin límite", "Hoy tenés derecho a pedir todos los mimos que se te ocurran."),
  coupon(4, "carino", "comun", "Dormir abrazaditos", "Una noche para olvidarnos del mundo y quedarnos cerquita."),
  coupon(5, "carino", "comun", "Beso sorpresa", "Un beso inesperado, en cualquier momento que vos elijas."),

  // CONSENTIDA — poco comunes
  coupon(6, "consentida", "pococomun", "Masajes exclusivos", "Una sesión de masajes para relajarte y olvidarte de todo."),
  coupon(7, "consentida", "pococomun", "Masaje de pies", "Hoy te toca descansar. Yo me encargo de consentirte."),
  coupon(8, "consentida", "pococomun", "Desayuno en la cama", "Un desayuno preparado especialmente para vos."),
  coupon(9, "consentida", "pococomun", "Tarde de spa", "Una tarde de relajación, cuidados y cero preocupaciones."),
  coupon(10, "consentida", "pococomun", "Noche de mimos", "Una noche en la que la prioridad es que estés cómoda y feliz."),

  // EXPERIENCIAS — especiales
  coupon(11, "experiencias", "especial", "Cena sorpresa", "Una cena organizada especialmente para vos."),
  coupon(12, "experiencias", "especial", "La cita la elegís vos", "Vos elegís el lugar, el plan y la compañía."),
  coupon(13, "experiencias", "especial", "Salida sin mirar el reloj", "Un plan juntos sin apuros ni horarios."),
  coupon(14, "experiencias", "especial", "Escapada de fin de semana", "Una pequeña aventura para salir de la rutina."),
  coupon(15, "experiencias", "especial", "Aventura sorpresa", "Un plan que no vas a conocer hasta que llegue el momento."),

  // TRAVIESOS — raros
  coupon(16, "traviesos", "raro", "Noche de pasión", "Una noche especial para disfrutar de nuestra intimidad, siempre con ganas de ambos."),
  coupon(17, "traviesos", "raro", "Encuentro sin apuros", "Tiempo para nosotros, sin interrupciones y sin mirar el reloj."),
  coupon(18, "traviesos", "raro", "Una fantasía por cumplir", "Una fantasía que quieras compartir, siempre desde el deseo y el consentimiento mutuo."),
  coupon(19, "traviesos", "raro", "Esta noche mandás vos", "Vos elegís el plan, el ritmo y cómo queremos disfrutarlo."),
  coupon(20, "traviesos", "raro", "Besos en lugares inesperados", "Una sorpresa romántica que puede aparecer en cualquier momento."),

  // LEGENDARIOS
  coupon(21, "legendarios", "legendario", "Un deseo especial", "Un deseo tuyo que vamos a intentar hacer realidad."),
  coupon(22, "legendarios", "legendario", "Una experiencia pendiente", "Elegí algo que siempre hayas querido vivir y vamos a planearlo."),
  coupon(23, "legendarios", "legendario", "Un viaje sorpresa", "Una aventura especial para descubrir algún lugar nuevo."),
  coupon(24, "legendarios", "legendario", "Una noche inolvidable", "Una noche preparada para que sea realmente especial."),
  coupon(25, "legendarios", "legendario", "Un regalo misterioso", "No vas a saber qué es hasta que llegue el momento."),

  // BONUS — colección especial
  coupon(26, "bonus", "especial", "Hoy se hace lo que vos quieras", "Un día en el que vos elegís cómo disfrutar cada momento."),
  coupon(27, "bonus", "especial", "Vale por una revancha", "Podés elegir una revancha pendiente. Esta vez no hay excusas."),
  coupon(28, "bonus", "especial", "Control remoto para vos", "Película, serie, música y comida: hoy elegís todo."),
  coupon(29, "bonus", "especial", "Capricho aprobado", "Un pequeño capricho que vamos a intentar cumplir."),
  coupon(30, "bonus", "especial", "El cupón secreto", "Una sorpresa especial que queda a tu elección."),

  // TRAVIESOS — repertorio ampliado
  coupon(31, "traviesos", "raro", "Un beso ahí abajo", "Mi boca a tu disposición, el tiempo que haga falta. Vos marcás el ritmo y yo obedezco."),
  coupon(32, "traviesos", "raro", "Mis dedos, tus reglas", "Mis dedos donde vos quieras y cuando quieras. Yo no puedo decir que no."),
  coupon(33, "traviesos", "raro", "Rapidín a pedido", "Un rapidín en el momento y el lugar que elijas. Sin excusas y sin vueltas."),
  coupon(34, "traviesos", "raro", "Masaje con final feliz", "Empieza como un masaje cualquiera. Cómo termina lo decidís vos."),
  coupon(35, "traviesos", "raro", "Ducha de a dos", "Agua caliente, poca ropa y ningún apuro por salir."),
  coupon(36, "traviesos", "raro", "Hacer el amor todo el día", "Un día entero para nosotros, sin planes ni horarios. Solo tiempo, ganas y las vueltas que se nos antojen."),
  coupon(37, "traviesos", "raro", "Ojos vendados", "Vos solo tenés que sentir. Frenamos cuando quieras, siempre."),
  coupon(38, "traviesos", "raro", "Pedime lo que quieras en la cama", "Lo que se te antoje, cuando se te antoje, sin vergüenza. Hoy yo digo que sí."),
  coupon(39, "traviesos", "raro", "Besos de adolescentes", "Besos largos y desprolijos, como si no existiera nada más. Después vemos hasta dónde llegamos."),
  coupon(40, "traviesos", "raro", "Domingo sin salir de la cama", "Un día entero de sábanas, mimos y planes que no pasan del colchón."),
]);

export const TOTAL_COUPONS = COUPONS.length;
export const COUPONS_BY_ID = Object.freeze(
  Object.fromEntries(COUPONS.map((item) => [item.id, item]))
);

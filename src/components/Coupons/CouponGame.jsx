import { useEffect, useRef, useState } from "react";
import { useCouponGame } from "../../hooks/useCouponGame";
import { randomWelcomeMessage } from "../../data/couponMessages";
import CouponHeader from "./CouponHeader";
import CouponEnvelope from "./CouponEnvelope";
import CouponProgress from "./CouponProgress";
import CouponReveal from "./CouponReveal";
import CouponCollection from "./CouponCollection";
import CouponDetail from "./CouponDetail";
import CouponRedeemModal from "./CouponRedeemModal";
import CouponComplete from "./CouponComplete";
import CouponBackup from "./CouponBackup";
import "./coupons.css";

const OPEN_MS = 1700;
const OPEN_MS_REDUCED = 350;

function prefersReducedMotion() {
  return typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function CouponGame() {
  const game = useCouponGame();
  const [view, setView] = useState("home");
  const [welcome] = useState(randomWelcomeMessage);
  const [opening, setOpening] = useState(false);
  const [revealed, setRevealed] = useState(null);
  const [detailId, setDetailId] = useState(null);
  const [redeemId, setRedeemId] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const { coupons, stats, nextUnlockAt, canDiscover } = game;
  const waiting = !canDiscover && !stats.isComplete;
  const detail = coupons.find((item) => item.id === detailId) ?? null;
  const redeeming = coupons.find((item) => item.id === redeemId) ?? null;

  function handleDiscover() {
    if (opening || !canDiscover) return;
    // El cupón se sortea y guarda ya mismo: si se recarga a mitad de la animación no se pierde.
    const coupon = game.discover();
    if (!coupon) return;
    setOpening(true);
    timerRef.current = setTimeout(
      () => {
        setOpening(false);
        setRevealed(coupon);
      },
      prefersReducedMotion() ? OPEN_MS_REDUCED : OPEN_MS
    );
  }

  const message = opening
    ? "Un momento…"
    : waiting
      ? "Tu sorpresa de hoy ya está descubierta. La próxima te espera en…"
      : welcome;

  return (
    <div className="vale vale-panel">
      <CouponHeader view={view} onViewChange={setView} availableCount={stats.available} />

      {view === "home" ? (
        <>
          {stats.isComplete && !opening && !revealed ? (
            <CouponComplete onViewCollection={() => setView("collection")} />
          ) : (
            <CouponEnvelope
              canDiscover={canDiscover}
              opening={opening}
              onDiscover={handleDiscover}
              message={message}
            />
          )}
          <CouponProgress stats={stats} nextUnlockAt={nextUnlockAt} waiting={waiting && !opening} />
        </>
      ) : (
        <CouponCollection
          coupons={coupons}
          stats={stats}
          onOpen={setDetailId}
          onRedeem={setRedeemId}
        />
      )}

      <CouponBackup
        stats={stats}
        onExport={game.exportProgress}
        onPreviewImport={game.previewImport}
        onApplyImport={game.applyImport}
      />

      {revealed && (
        <CouponReveal
          coupon={revealed}
          isLast={stats.isComplete}
          onClose={() => setRevealed(null)}
          onViewCollection={() => {
            setRevealed(null);
            setView("collection");
          }}
        />
      )}
      {detail && detail.status !== "locked" && (
        <CouponDetail coupon={detail} onClose={() => setDetailId(null)} onRedeem={setRedeemId} />
      )}
      {redeeming && redeeming.status !== "locked" && (
        <CouponRedeemModal coupon={redeeming} onConfirm={game.redeem} onClose={() => setRedeemId(null)} />
      )}
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { formatVND } from "../data/mockData";
import { MapPin, Clock, Car, CreditCard, CheckCircle2 } from "lucide-react";
import "./CheckOutPage.css";

export default function CheckOutPage() {
  const { activeSession, user, checkOut } = useApp();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(null);

  if (!activeSession && !completed) {
    navigate("/dashboard");
    return null;
  }

  const session = completed || activeSession;
  const now = new Date();
  const checkInTime = new Date(session.checkInTime);
  const durationMs = now - checkInTime;
  const durationMinutes = Math.max(1, Math.ceil(durationMs / 60000));
  const hours = Math.floor(durationMinutes / 60);
  const mins = durationMinutes % 60;
  const cost = completed
    ? completed.cost
    : Math.ceil((durationMinutes / 60) * session.rate);

  const handleCheckOut = () => {
    setProcessing(true);
    setTimeout(() => {
      const result = checkOut();
      setCompleted(result);
      setProcessing(false);
    }, 1200);
  };

  return (
    <div className="page-container" id="checkout-page">
      {!completed ? (
        <>
          <div className="checkout-header animate-fade-in">
            <h1 className="headline-lg">Check out</h1>
            <p className="body-md" style={{ color: "var(--on-surface-variant)" }}>
              Review your session before checking out
            </p>
          </div>

          <div className="checkout-summary card animate-fade-in-up">
            <h3 className="title-md checkout-summary-title">Session summary</h3>

            <div className="checkout-row">
              <div className="checkout-row-label">
                <MapPin size={16} /> <span>Zone & Spot</span>
              </div>
              <span className="title-sm">{session.zoneName} · {session.spot}</span>
            </div>

            <div className="checkout-row">
              <div className="checkout-row-label">
                <Car size={16} /> <span>Vehicle</span>
              </div>
              <span className="title-sm">{user?.licensePlate}</span>
            </div>

            <div className="checkout-row">
              <div className="checkout-row-label">
                <Clock size={16} /> <span>Duration</span>
              </div>
              <span className="title-sm">{hours}h {mins}m</span>
            </div>

            <div className="checkout-divider"></div>

            <div className="checkout-cost">
              <div>
                <span className="label-md">Total cost</span>
                <span className="label-sm">
                  {formatVND(session.rate)}/hr × {hours}h {mins}m
                </span>
              </div>
              <span className="headline-md checkout-cost-amount">{formatVND(cost)}</span>
            </div>
          </div>

          <button
            className={`btn btn-primary btn-full btn-lg ${processing ? "confirming" : ""}`}
            onClick={handleCheckOut}
            disabled={processing}
            id="btn-confirm-checkout"
          >
            {processing ? "Processing..." : "Confirm check-out"}
          </button>
        </>
      ) : (
        <div className="checkout-success animate-scale-in">
          <div className="checkout-success-icon">
            <CheckCircle2 size={56} strokeWidth={1.5} />
          </div>
          <h1 className="headline-lg">Checked out!</h1>
          <p className="body-md" style={{ color: "var(--on-surface-variant)" }}>
            Your session has been completed successfully
          </p>

          <div className="checkout-receipt card">
            <div className="checkout-receipt-row">
              <span className="label-md">Zone</span>
              <span className="title-sm">{completed.zoneName}</span>
            </div>
            <div className="checkout-receipt-row">
              <span className="label-md">Duration</span>
              <span className="title-sm">
                {Math.floor(completed.durationMinutes / 60)}h{" "}
                {completed.durationMinutes % 60}m
              </span>
            </div>
            <div className="checkout-receipt-row">
              <span className="label-md">Amount charged</span>
              <span className="title-lg" style={{ color: "var(--primary)" }}>
                {formatVND(completed.cost)}
              </span>
            </div>
          </div>

          <div className="checkout-success-actions">
            <button
              className="btn btn-primary btn-full btn-lg"
              onClick={() => navigate("/billing")}
              id="btn-view-billing"
            >
              View billing
            </button>
            <button
              className="btn btn-secondary btn-full"
              onClick={() => navigate("/dashboard")}
              id="btn-back-dashboard"
            >
              Back to dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { formatVND } from "../data/mockData";
import SessionTimer from "../components/SessionTimer";
import { MapPin, Car, CreditCard, LogOut } from "lucide-react";
import StatusChip from "../components/StatusChip";
import "./ActiveSessionPage.css";

export default function ActiveSessionPage() {
  const { activeSession, user } = useApp();
  const navigate = useNavigate();

  if (!activeSession) {
    return (
      <div className="page-container" id="session-page-empty">
        <div className="session-empty animate-fade-in">
          <div className="session-empty-icon">
            <Car size={48} strokeWidth={1.2} />
          </div>
          <h2 className="headline-sm">No active session</h2>
          <p className="body-md" style={{ color: "var(--on-surface-variant)" }}>
            Check in to a parking zone to start a session
          </p>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => navigate("/parking")}
            id="btn-find-parking-empty"
          >
            Find parking
          </button>
        </div>
      </div>
    );
  }

  const elapsed = Math.max(1, Math.ceil((Date.now() - new Date(activeSession.checkInTime).getTime()) / 60000));
  const estimatedCost = Math.ceil((elapsed / 60) * activeSession.rate);

  return (
    <div className="page-container" id="session-page">
      <div className="session-header animate-fade-in">
        <StatusChip status="active" size="lg" />
        <h1 className="headline-lg">Active session</h1>
      </div>

      {/* Timer */}
      <div className="animate-scale-in">
        <SessionTimer startTime={activeSession.checkInTime} />
      </div>

      {/* Session Details */}
      <div className="session-details card animate-fade-in-up">
        <div className="session-detail-item">
          <div className="session-detail-icon">
            <MapPin size={18} />
          </div>
          <div className="session-detail-text">
            <span className="label-md">Zone & Spot</span>
            <span className="title-md">
              {activeSession.zoneName} · {activeSession.spot}
            </span>
          </div>
        </div>

        <div className="session-detail-item">
          <div className="session-detail-icon">
            <Car size={18} />
          </div>
          <div className="session-detail-text">
            <span className="label-md">Vehicle</span>
            <span className="title-md">{user?.licensePlate}</span>
          </div>
        </div>

        <div className="session-detail-item">
          <div className="session-detail-icon">
            <CreditCard size={18} />
          </div>
          <div className="session-detail-text">
            <span className="label-md">Estimated cost</span>
            <span className="title-md">{formatVND(estimatedCost)}</span>
          </div>
        </div>
      </div>

      {/* Rate Info */}
      <div className="session-rate-info animate-fade-in">
        <span className="label-md">Rate: {formatVND(activeSession.rate)}/hr</span>
      </div>

      {/* Check Out */}
      <button
        className="btn btn-danger btn-full btn-lg session-checkout-btn"
        onClick={() => navigate("/checkout")}
        id="btn-checkout"
      >
        <LogOut size={20} />
        Check out
      </button>
    </div>
  );
}

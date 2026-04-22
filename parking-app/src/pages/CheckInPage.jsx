import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { formatVND } from "../data/mockData";
import StatusChip from "../components/StatusChip";
import { MapPin, Clock, Car, CheckCircle } from "lucide-react";
import "./CheckInPage.css";

export default function CheckInPage() {
  const { zoneId } = useParams();
  const { zones, user, checkIn } = useApp();
  const navigate = useNavigate();
  const [licensePlate, setLicensePlate] = useState(user?.licensePlate || "");
  const [confirming, setConfirming] = useState(false);

  const zone = zones.find((z) => z.id === zoneId);
  if (!zone) return <div className="page-container">Zone not found</div>;

  const available = zone.total - zone.occupied;

  const handleCheckIn = () => {
    setConfirming(true);
    setTimeout(() => {
      const session = checkIn(zoneId);
      if (session) {
        navigate("/session");
      }
    }, 800);
  };

  return (
    <div className="page-container" id="checkin-page">
      <div className="checkin-header animate-fade-in">
        <h1 className="headline-lg">Check in</h1>
        <p className="body-md" style={{ color: "var(--on-surface-variant)" }}>
          Confirm your parking details
        </p>
      </div>

      {/* Zone Summary */}
      <div className="checkin-zone-card card animate-fade-in-up">
        <div className="checkin-zone-header">
          <div className="parking-card-zone-badge">{zone.id}</div>
          <div>
            <h2 className="title-md">{zone.name} – {zone.subtitle}</h2>
            <span className="label-md">{zone.description}</span>
          </div>
        </div>

        <div className="checkin-zone-details">
          <div className="checkin-detail-row">
            <MapPin size={16} color="var(--on-surface-variant)" />
            <span className="body-md">{available} spots available</span>
            <StatusChip status="available" size="sm" />
          </div>
          <div className="checkin-detail-row">
            <Clock size={16} color="var(--on-surface-variant)" />
            <span className="body-md">{zone.openHours}</span>
          </div>
          <div className="checkin-detail-row">
            <Car size={16} color="var(--on-surface-variant)" />
            <span className="body-md">{formatVND(zone.rate)} per hour</span>
          </div>
        </div>
      </div>

      {/* Vehicle Info */}
      <div className="checkin-form animate-fade-in">
        <div className="input-group">
          <label className="input-label">License Plate</label>
          <input
            type="text"
            className="input-field"
            value={licensePlate}
            onChange={(e) => setLicensePlate(e.target.value)}
            placeholder="e.g. 59A-12345"
            id="input-license-plate"
          />
        </div>

        <div className="input-group">
          <label className="input-label">Vehicle Owner</label>
          <input
            type="text"
            className="input-field"
            value={user?.name || ""}
            readOnly
            id="input-owner"
          />
        </div>

        <div className="input-group">
          <label className="input-label">Student ID</label>
          <input
            type="text"
            className="input-field"
            value={user?.studentId || ""}
            readOnly
            id="input-student-id"
          />
        </div>
      </div>

      {/* Confirm Button */}
      <button
        className={`btn btn-primary btn-full btn-lg checkin-btn ${confirming ? "confirming" : ""}`}
        onClick={handleCheckIn}
        disabled={confirming || !licensePlate}
        id="btn-confirm-checkin"
      >
        {confirming ? (
          <>
            <CheckCircle size={20} />
            Checking in...
          </>
        ) : (
          "Confirm check-in"
        )}
      </button>
    </div>
  );
}

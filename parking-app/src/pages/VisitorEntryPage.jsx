import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bike,
  Car,
  Zap,
  Ticket,
  ShieldCheck,
  Info,
  ArrowRight,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { formatVND, visitorRates } from "../data/mockData";
import "./VisitorEntryPage.css";

const vehicleChoices = [
  { key: "motorcycle", label: "Motorcycle", icon: Zap },
  { key: "car", label: "Car", icon: Car },
  { key: "bicycle", label: "Bicycle", icon: Bike },
];

export default function VisitorEntryPage() {
  const { createVisitorTicket, visitorTicket, user } = useApp();
  const navigate = useNavigate();

  const [licensePlate, setLicensePlate] = useState(user?.licensePlate || "");
  const [vehicleType, setVehicleType] = useState("motorcycle");
  const [phone, setPhone] = useState(user?.phone || "");
  const [purpose, setPurpose] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const rate = visitorRates[vehicleType];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!licensePlate.trim()) {
      setError("License plate is required to issue a ticket.");
      return;
    }
    if (!phone.trim()) {
      setError("Phone number is required for contact.");
      return;
    }
    setError("");
    setProcessing(true);
    setTimeout(() => {
      createVisitorTicket({
        licensePlate: licensePlate.toUpperCase(),
        vehicleType,
        phone,
        purpose,
      });
      navigate("/visitor/ticket");
    }, 700);
  };

  // If ticket already exists, allow user to jump back
  if (visitorTicket) {
    return (
      <div className="page-container" id="visitor-entry-page">
        <div className="visitor-existing animate-fade-in">
          <Ticket size={36} color="var(--primary)" />
          <h2 className="headline-sm">You already have an active ticket</h2>
          <p className="body-md" style={{ color: "var(--on-surface-variant)" }}>
            Ticket {visitorTicket.id} is still active. View it or proceed to
            check-out.
          </p>
          <div className="visitor-existing-actions">
            <button
              className="btn btn-primary btn-full btn-lg"
              onClick={() => navigate("/visitor/ticket")}
            >
              View ticket
            </button>
            <button
              className="btn btn-secondary btn-full"
              onClick={() => navigate("/visitor/checkout")}
            >
              Go to check-out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container" id="visitor-entry-page">
      <div className="visitor-header animate-fade-in">
        <span className="chip chip-active visitor-chip">
          <ShieldCheck size={12} />
          Temporary Entry
        </span>
        <h1 className="headline-lg">Welcome, visitor</h1>
        <p className="body-md" style={{ color: "var(--on-surface-variant)" }}>
          Fill in your vehicle details to receive a temporary parking ticket.
        </p>
      </div>

      <form className="visitor-form" onSubmit={handleSubmit}>
        <div className="visitor-section animate-fade-in-up">
          <p className="input-label">Vehicle type</p>
          <div className="visitor-vehicle-grid stagger-children">
            {vehicleChoices.map((v) => {
              const Icon = v.icon;
              const active = vehicleType === v.key;
              return (
                <button
                  type="button"
                  key={v.key}
                  className={`visitor-vehicle-card ${active ? "active" : ""}`}
                  onClick={() => setVehicleType(v.key)}
                  id={`vehicle-${v.key}`}
                >
                  <Icon size={22} />
                  <span className="title-sm">{v.label}</span>
                  <span className="label-sm">
                    {formatVND(visitorRates[v.key].hourly)}/hr
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="visitor-section animate-fade-in">
          <div className="input-group">
            <label className="input-label" htmlFor="license">
              License plate
            </label>
            <input
              id="license"
              type="text"
              className="input-field"
              value={licensePlate}
              onChange={(e) => setLicensePlate(e.target.value)}
              placeholder="e.g. 51G-67890"
              autoComplete="off"
            />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="phone">
              Phone number
            </label>
            <input
              id="phone"
              type="tel"
              className="input-field"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 0901234567"
              autoComplete="off"
            />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="purpose">
              Purpose of visit (optional)
            </label>
            <input
              id="purpose"
              type="text"
              className="input-field"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="e.g. Meeting with faculty"
              autoComplete="off"
            />
          </div>

          {error && (
            <div className="visitor-error">
              <Info size={14} /> {error}
            </div>
          )}
        </div>

        <div className="visitor-rate-preview animate-fade-in">
          <div>
            <span className="label-md">You will be charged</span>
            <span className="title-lg">{formatVND(rate.hourly)}/hr</span>
          </div>
          <div className="visitor-rate-meta">
            <span className="label-sm">
              + {formatVND(rate.flatEntry)} entry
            </span>
            <span className="label-sm">
              Daily cap {formatVND(rate.maxDaily)}
            </span>
          </div>
        </div>

        <button
          type="submit"
          className={`btn btn-primary btn-full btn-lg ${processing ? "confirming" : ""}`}
          disabled={processing}
          id="btn-issue-ticket"
        >
          {processing ? (
            "Issuing ticket..."
          ) : (
            <>
              Issue ticket <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

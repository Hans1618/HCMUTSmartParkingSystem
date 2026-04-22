import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Car, Clock, Hash, Wallet } from "lucide-react";
import { useApp } from "../context/AppContext";
import { formatVND, computeVisitorFee } from "../data/mockData";
import "./VisitorCheckoutPage.css";

export default function VisitorCheckoutPage() {
  const { visitorTicket } = useApp();
  const navigate = useNavigate();
  const [fee, setFee] = useState(() =>
    visitorTicket ? computeVisitorFee(visitorTicket, new Date()) : null
  );

  useEffect(() => {
    if (!visitorTicket) return;
    const id = setInterval(() => {
      setFee(computeVisitorFee(visitorTicket, new Date()));
    }, 1000);
    return () => clearInterval(id);
  }, [visitorTicket]);

  if (!visitorTicket) {
    return (
      <div className="page-container" id="visitor-checkout-empty">
        <div className="visitor-checkout-empty animate-fade-in">
          <h2 className="headline-sm">No active ticket to check out</h2>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => navigate("/visitor/entry")}
          >
            Register entry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container" id="visitor-checkout-page">
      <div className="visitor-checkout-header animate-fade-in">
        <h1 className="headline-lg">Check out</h1>
        <p className="body-md" style={{ color: "var(--on-surface-variant)" }}>
          Review your visit before paying
        </p>
      </div>

      <div className="visitor-summary card animate-fade-in-up">
        <div className="visitor-summary-row">
          <div className="visitor-summary-label">
            <Hash size={16} /> <span>Ticket</span>
          </div>
          <span className="title-sm">{visitorTicket.id}</span>
        </div>
        <div className="visitor-summary-row">
          <div className="visitor-summary-label">
            <MapPin size={16} /> <span>Zone & Spot</span>
          </div>
          <span className="title-sm">
            {visitorTicket.zoneName} · {visitorTicket.spot}
          </span>
        </div>
        <div className="visitor-summary-row">
          <div className="visitor-summary-label">
            <Car size={16} /> <span>Vehicle</span>
          </div>
          <span className="title-sm">{visitorTicket.licensePlate}</span>
        </div>
        <div className="visitor-summary-row">
          <div className="visitor-summary-label">
            <Clock size={16} /> <span>Duration</span>
          </div>
          <span className="title-sm">
            {fee.hours}h {fee.minutes}m
          </span>
        </div>
      </div>

      <div className="visitor-fee card animate-fade-in">
        <div className="visitor-fee-row">
          <span className="label-md">Entry fee</span>
          <span className="title-sm">{formatVND(fee.entryFee)}</span>
        </div>
        <div className="visitor-fee-row">
          <span className="label-md">
            Hourly ({formatVND(visitorTicket.rate)}/hr × {fee.hours}h{" "}
            {fee.minutes}m)
          </span>
          <span className="title-sm">{formatVND(fee.hourlyComponent)}</span>
        </div>
        {fee.capped && (
          <div className="visitor-fee-row visitor-fee-cap">
            <span className="label-sm">Daily cap applied</span>
            <span className="label-sm">{formatVND(visitorTicket.maxDaily)}</span>
          </div>
        )}
        <div className="visitor-fee-divider"></div>
        <div className="visitor-fee-total">
          <div>
            <span className="label-md">Amount due</span>
            <span className="label-sm">
              Pay now to raise the exit barrier
            </span>
          </div>
          <span className="display-md visitor-fee-total-amount">
            {formatVND(fee.total)}
          </span>
        </div>
      </div>

      <button
        className="btn btn-primary btn-full btn-lg"
        onClick={() => navigate("/visitor/payment")}
        id="btn-goto-payment"
      >
        <Wallet size={20} />
        Continue to payment
      </button>
    </div>
  );
}

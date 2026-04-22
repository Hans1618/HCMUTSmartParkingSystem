import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Car,
  Clock,
  Hash,
  QrCode,
  LogOut,
  Phone,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { formatVND, visitorRates } from "../data/mockData";
import SessionTimer from "../components/SessionTimer";
import StatusChip from "../components/StatusChip";
import "./VisitorTicketPage.css";

function formatDateTime(date) {
  if (!date) return "—";
  const d = new Date(date);
  return `${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes()
  ).padStart(2, "0")} · ${d.toLocaleDateString("en-GB")}`;
}

// Very small, decorative "QR-like" pattern generator (purely visual)
function QrPattern({ seed = "T-0000" }) {
  const size = 12;
  const cells = [];
  const hash = Array.from(seed).reduce(
    (acc, ch) => (acc * 31 + ch.charCodeAt(0)) & 0xffffffff,
    7
  );
  let state = hash || 1;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      state = (state * 1664525 + 1013904223) & 0xffffffff;
      const fill = ((state >>> (x % 8)) & 1) === 1;
      cells.push({ x, y, fill });
    }
  }
  // Corner anchors
  const isAnchor = (x, y) =>
    (x < 3 && y < 3) ||
    (x >= size - 3 && y < 3) ||
    (x < 3 && y >= size - 3);

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="visitor-qr"
      aria-label="Ticket QR"
    >
      <rect width={size} height={size} fill="white" />
      {cells.map((c) =>
        (c.fill || isAnchor(c.x, c.y)) ? (
          <rect
            key={`${c.x}-${c.y}`}
            x={c.x}
            y={c.y}
            width={1}
            height={1}
            fill={
              isAnchor(c.x, c.y) &&
              (c.x === 0 || c.x === size - 3 || c.y === 0 || c.y === size - 3)
                ? "var(--primary)"
                : "var(--on-surface)"
            }
          />
        ) : null
      )}
      {/* anchor outlines */}
      {[
        [0, 0],
        [size - 3, 0],
        [0, size - 3],
      ].map(([ax, ay]) => (
        <g key={`${ax}-${ay}`}>
          <rect
            x={ax}
            y={ay}
            width={3}
            height={3}
            fill="var(--primary)"
          />
          <rect
            x={ax + 1}
            y={ay + 1}
            width={1}
            height={1}
            fill="white"
          />
        </g>
      ))}
    </svg>
  );
}

export default function VisitorTicketPage() {
  const { visitorTicket } = useApp();
  const navigate = useNavigate();

  if (!visitorTicket) {
    return (
      <div className="page-container" id="visitor-ticket-empty">
        <div className="visitor-ticket-empty animate-fade-in">
          <h2 className="headline-sm">No active ticket</h2>
          <p className="body-md" style={{ color: "var(--on-surface-variant)" }}>
            Register a temporary entry to receive your parking ticket.
          </p>
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

  const rateInfo = visitorRates[visitorTicket.vehicleType];

  return (
    <div className="page-container" id="visitor-ticket-page">
      <div className="visitor-ticket-header animate-fade-in">
        <StatusChip status="active" />
        <h1 className="headline-lg">Your temporary ticket</h1>
        <p className="body-md" style={{ color: "var(--on-surface-variant)" }}>
          Please keep this ticket ready when you check out.
        </p>
      </div>

      {/* Ticket card */}
      <div className="ticket-card animate-fade-in-up">
        <div className="ticket-card-top">
          <div>
            <span className="label-md ticket-card-label">Ticket no.</span>
            <span className="title-lg ticket-card-id">{visitorTicket.id}</span>
          </div>
          <div className="ticket-card-qr">
            <QrPattern seed={visitorTicket.id} />
          </div>
        </div>

        <div className="ticket-divider">
          <span className="ticket-notch left" />
          <span className="ticket-notch right" />
        </div>

        <div className="ticket-card-bottom">
          <div className="ticket-row">
            <div className="ticket-row-icon">
              <MapPin size={16} />
            </div>
            <div>
              <span className="label-sm">Assigned zone</span>
              <span className="title-sm">{visitorTicket.zoneName}</span>
            </div>
          </div>
          <div className="ticket-row">
            <div className="ticket-row-icon">
              <Hash size={16} />
            </div>
            <div>
              <span className="label-sm">Spot</span>
              <span className="title-sm">{visitorTicket.spot}</span>
            </div>
          </div>
          <div className="ticket-row">
            <div className="ticket-row-icon">
              <Car size={16} />
            </div>
            <div>
              <span className="label-sm">
                {rateInfo?.label || "Vehicle"} · License
              </span>
              <span className="title-sm">{visitorTicket.licensePlate}</span>
            </div>
          </div>
          <div className="ticket-row">
            <div className="ticket-row-icon">
              <Phone size={16} />
            </div>
            <div>
              <span className="label-sm">Contact</span>
              <span className="title-sm">{visitorTicket.phone}</span>
            </div>
          </div>
          <div className="ticket-row">
            <div className="ticket-row-icon">
              <Clock size={16} />
            </div>
            <div>
              <span className="label-sm">Issued · Valid until</span>
              <span className="title-sm">
                {formatDateTime(visitorTicket.issuedAt)} →{" "}
                {formatDateTime(visitorTicket.validUntil)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Live timer */}
      <div className="animate-scale-in">
        <SessionTimer startTime={visitorTicket.issuedAt} />
      </div>

      {/* Rate summary */}
      <div className="ticket-rate-summary animate-fade-in">
        <div className="ticket-rate-row">
          <span className="label-md">Hourly rate</span>
          <span className="title-sm">{formatVND(visitorTicket.rate)}/hr</span>
        </div>
        <div className="ticket-rate-row">
          <span className="label-md">Entry fee</span>
          <span className="title-sm">{formatVND(visitorTicket.entryFee)}</span>
        </div>
        <div className="ticket-rate-row">
          <span className="label-md">Daily cap</span>
          <span className="title-sm">{formatVND(visitorTicket.maxDaily)}</span>
        </div>
      </div>

      <button
        className="btn btn-danger btn-full btn-lg"
        onClick={() => navigate("/visitor/checkout")}
        id="btn-goto-checkout"
      >
        <LogOut size={20} />
        Proceed to check-out
      </button>
    </div>
  );
}

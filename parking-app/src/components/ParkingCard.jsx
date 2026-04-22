import StatusChip from "./StatusChip";
import { getZoneStatus } from "../data/mockData";
import { MapPin, Clock, ChevronRight } from "lucide-react";
import "./ParkingCard.css";

export default function ParkingCard({ zone, onClick }) {
  const status = getZoneStatus(zone);
  const available = zone.total - zone.occupied;
  const occupancyPercent = (zone.occupied / zone.total) * 100;
  const isFull = status === "full";

  return (
    <div
      className={`parking-card card ${!isFull ? "card-interactive" : ""}`}
      onClick={!isFull ? onClick : undefined}
      id={`zone-card-${zone.id}`}
      role={!isFull ? "button" : undefined}
      tabIndex={!isFull ? 0 : undefined}
      aria-label={`${zone.name} - ${zone.subtitle}. ${available} spots available`}
    >
      <div className="parking-card-header">
        <div className="parking-card-title-group">
          <div className="parking-card-zone-badge">{zone.id}</div>
          <div>
            <h3 className="title-md">{zone.name}</h3>
            <p className="label-md">{zone.subtitle}</p>
          </div>
        </div>
        <StatusChip status={status} />
      </div>

      <div className="parking-card-body">
        <p className="body-sm parking-card-desc">{zone.description}</p>

        <div className="parking-card-capacity">
          <div className="capacity-bar">
            <div
              className={`capacity-bar-fill ${status}`}
              style={{ width: `${occupancyPercent}%` }}
            ></div>
          </div>
          <div className="parking-card-capacity-text">
            <span className="title-sm">
              {isFull ? "No spots left" : `${available} available`}
            </span>
            <span className="label-sm">
              {zone.occupied} / {zone.total}
            </span>
          </div>
        </div>

        <div className="parking-card-meta">
          <div className="parking-card-meta-item">
            <Clock size={14} />
            <span className="label-md">{zone.openHours}</span>
          </div>
          <div className="parking-card-meta-item">
            <MapPin size={14} />
            <span className="label-md">
              {new Intl.NumberFormat("vi-VN").format(zone.rate)}₫/hr
            </span>
          </div>
        </div>
      </div>

      {!isFull && (
        <div className="parking-card-action">
          <span className="label-md" style={{ color: "var(--primary)" }}>
            Select zone
          </span>
          <ChevronRight size={16} color="var(--primary)" />
        </div>
      )}
    </div>
  );
}

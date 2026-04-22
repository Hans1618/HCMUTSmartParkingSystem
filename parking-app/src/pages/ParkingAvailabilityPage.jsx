import { useState } from "react";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import ParkingCard from "../components/ParkingCard";
import { Search, Map, List } from "lucide-react";
import "./ParkingAvailabilityPage.css";

export default function ParkingAvailabilityPage() {
  const { zones } = useApp();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("map"); // "map" or "list"

  const totalAvailable = zones.reduce(
    (sum, z) => sum + (z.total - z.occupied),
    0
  );

  const handleZoneSelect = (zoneId) => {
    navigate(`/checkin/${zoneId}`);
  };

  return (
    <div className="page-container" id="parking-availability-page">
      {/* Header */}
      <div className="parking-header animate-fade-in">
        <div className="parking-header-top">
          <div>
            <h1 className="headline-lg">Parking zones</h1>
            <p className="body-md" style={{ color: "var(--on-surface-variant)" }}>
              {totalAvailable} spots available across {zones.length} zones
            </p>
          </div>
          {/* View Toggle */}
          <div className="parking-view-toggle">
            <button
              className={`parking-view-btn ${viewMode === "map" ? "active" : ""}`}
              onClick={() => setViewMode("map")}
              id="view-map"
            >
              <Map size={16} />
            </button>
            <button
              className={`parking-view-btn ${viewMode === "list" ? "active" : ""}`}
              onClick={() => setViewMode("list")}
              id="view-list"
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Campus Map View */}
      {viewMode === "map" && (
        <div className="parking-map-section animate-fade-in">
          <div className="parking-map-container card">
            <img
              src="/campus-map.png"
              alt="HCMUT Campus Map"
              className="parking-map-image"
            />
            {/* Map overlay markers */}
            <div className="parking-map-overlay">
              {zones.map((zone) => {
                const available = zone.total - zone.occupied;
                const isFull = available === 0;
                const isNearlyFull = available > 0 && available / zone.total < 0.1;
                const statusClass = isFull
                  ? "marker-full"
                  : isNearlyFull
                  ? "marker-nearly-full"
                  : "marker-available";
                return (
                  <button
                    key={zone.id}
                    className={`parking-map-marker ${statusClass}`}
                    data-zone={zone.id}
                    onClick={() => !isFull && handleZoneSelect(zone.id)}
                    title={`${zone.name}: ${available} spots`}
                    style={{ cursor: isFull ? "default" : "pointer" }}
                    id={`marker-${zone.id}`}
                  >
                    <span className="marker-letter">{zone.id}</span>
                    <span className="marker-count">{available}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Compact Zone List under Map */}
          <div className="parking-compact-list stagger-children">
            {zones.map((zone) => {
              const available = zone.total - zone.occupied;
              const isFull = available === 0;
              const occupancy = Math.round(
                (zone.occupied / zone.total) * 100
              );
              return (
                <button
                  key={zone.id}
                  className={`parking-compact-item card ${!isFull ? "card-interactive" : ""}`}
                  onClick={() => !isFull && handleZoneSelect(zone.id)}
                  disabled={isFull}
                  id={`compact-zone-${zone.id}`}
                >
                  <div className="parking-compact-badge">{zone.id}</div>
                  <div className="parking-compact-info">
                    <span className="title-sm">{zone.subtitle}</span>
                    <span className="label-sm">
                      {isFull ? "Full" : `${available} available`}
                    </span>
                  </div>
                  <div className="parking-compact-bar">
                    <div className="capacity-bar">
                      <div
                        className={`capacity-bar-fill ${isFull ? "full" : occupancy > 90 ? "nearly-full" : "available"}`}
                        style={{ width: `${occupancy}%` }}
                      ></div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <>
          {/* Search */}
          <div className="parking-search animate-fade-in">
            <Search size={18} color="var(--outline)" />
            <input
              type="text"
              className="input-field parking-search-input"
              placeholder="Search zones..."
              id="zone-search"
            />
          </div>

          {/* Zone Cards */}
          <div className="parking-zones stagger-children">
            {zones.map((zone) => (
              <ParkingCard
                key={zone.id}
                zone={zone}
                onClick={() => handleZoneSelect(zone.id)}
              />
            ))}
          </div>
        </>
      )}

      {/* Legend */}
      <div className="parking-legend animate-fade-in">
        <div className="parking-legend-item">
          <span
            className="parking-legend-dot"
            style={{ background: "var(--tertiary)" }}
          ></span>
          <span className="label-sm">Available</span>
        </div>
        <div className="parking-legend-item">
          <span
            className="parking-legend-dot"
            style={{ background: "var(--secondary)" }}
          ></span>
          <span className="label-sm">Nearly full</span>
        </div>
        <div className="parking-legend-item">
          <span
            className="parking-legend-dot"
            style={{ background: "var(--error)" }}
          ></span>
          <span className="label-sm">Full</span>
        </div>
      </div>
    </div>
  );
}

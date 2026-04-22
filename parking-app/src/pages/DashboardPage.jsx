import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { formatVND, getZoneStatus } from "../data/mockData";
import {
  Car,
  Clock,
  Wallet,
  ChevronRight,
  ParkingCircle,
  ArrowRight,
} from "lucide-react";
import StatusChip from "../components/StatusChip";
import "./DashboardPage.css";

export default function DashboardPage() {
  const { user, activeSession, balance, zones } = useApp();
  const navigate = useNavigate();

  // Calculate total availability
  const totalSpots = zones.reduce((sum, z) => sum + z.total, 0);
  const totalOccupied = zones.reduce((sum, z) => sum + z.occupied, 0);
  const totalAvailable = totalSpots - totalOccupied;
  const overallPercent = Math.round((totalOccupied / totalSpots) * 100);

  // Find best zone (most available)
  const bestZone = zones
    .filter((z) => z.occupied < z.total)
    .sort((a, b) => (b.total - b.occupied) - (a.total - a.occupied))[0];

  return (
    <div className="page-container" id="dashboard-page">
      {/* Editorial Greeting */}
      <div className="dashboard-greeting animate-fade-in">
        <p className="label-lg dashboard-greeting-label">Good morning</p>
        <h1 className="headline-lg">{user?.name}</h1>
        <p className="body-md dashboard-role">
          {user?.faculty} · {user?.studentId}
        </p>
      </div>

      {/* Active Session Banner */}
      {activeSession && (
        <div
          className="dashboard-session-banner card animate-fade-in-up"
          onClick={() => navigate("/session")}
          id="active-session-banner"
        >
          <div className="dashboard-session-banner-header">
            <StatusChip status="active" />
            <ChevronRight size={18} color="var(--primary)" />
          </div>
          <div className="dashboard-session-info">
            <div>
              <span className="title-md">{activeSession.zoneName}</span>
              <span className="label-md">
                Spot {activeSession.spot} · {user?.licensePlate}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="dashboard-stats stagger-children">
        <div
          className="dashboard-stat-card card card-interactive"
          onClick={() => navigate("/parking")}
          id="stat-availability"
        >
          <div className="dashboard-stat-icon stat-icon-primary">
            <Car size={20} />
          </div>
          <div className="dashboard-stat-content">
            <span className="headline-sm">{totalAvailable}</span>
            <span className="label-md">Spots available</span>
          </div>
          <div className="dashboard-stat-meta">
            <div className="capacity-bar" style={{ width: 48 }}>
              <div
                className={`capacity-bar-fill ${overallPercent > 90 ? "nearly-full" : "available"}`}
                style={{ width: `${overallPercent}%` }}
              ></div>
            </div>
            <span className="label-sm">{overallPercent}% full</span>
          </div>
        </div>

        <div
          className="dashboard-stat-card card card-interactive"
          onClick={() => navigate("/billing")}
          id="stat-balance"
        >
          <div className="dashboard-stat-icon stat-icon-secondary">
            <Wallet size={20} />
          </div>
          <div className="dashboard-stat-content">
            <span className="headline-sm">{formatVND(balance)}</span>
            <span className="label-md">Current balance</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-section animate-fade-in">
        <h2 className="title-md dashboard-section-title">Quick actions</h2>

        <div className="dashboard-actions stagger-children">
          {!activeSession && (
            <button
              className="dashboard-action-card card card-interactive"
              onClick={() => navigate("/parking")}
              id="action-find-parking"
            >
              <div className="dashboard-action-icon action-icon-primary">
                <ParkingCircle size={24} />
              </div>
              <div className="dashboard-action-text">
                <span className="title-md">Find parking</span>
                <span className="body-sm" style={{ color: "var(--on-surface-variant)" }}>
                  Browse available zones
                </span>
              </div>
              <ArrowRight size={18} color="var(--primary)" />
            </button>
          )}

          {activeSession && (
            <button
              className="dashboard-action-card card card-interactive"
              onClick={() => navigate("/session")}
              id="action-view-session"
            >
              <div className="dashboard-action-icon action-icon-tertiary">
                <Clock size={24} />
              </div>
              <div className="dashboard-action-text">
                <span className="title-md">View active session</span>
                <span className="body-sm" style={{ color: "var(--on-surface-variant)" }}>
                  Monitor your parking time
                </span>
              </div>
              <ArrowRight size={18} color="var(--primary)" />
            </button>
          )}

          <button
            className="dashboard-action-card card card-interactive"
            onClick={() => navigate("/billing")}
            id="action-billing"
          >
            <div className="dashboard-action-icon action-icon-secondary">
              <Wallet size={24} />
            </div>
            <div className="dashboard-action-text">
              <span className="title-md">Billing & history</span>
              <span className="body-sm" style={{ color: "var(--on-surface-variant)" }}>
                View transactions and balance
              </span>
            </div>
            <ArrowRight size={18} color="var(--primary)" />
          </button>
        </div>
      </div>

      {/* Recommended Zone */}
      {bestZone && !activeSession && (
        <div className="dashboard-section animate-fade-in">
          <h2 className="title-md dashboard-section-title">Recommended for you</h2>
          <div
            className="dashboard-recommended card card-interactive"
            onClick={() => navigate(`/checkin/${bestZone.id}`)}
            id="recommended-zone"
          >
            <div className="dashboard-recommended-header">
              <div className="parking-card-zone-badge">{bestZone.id}</div>
              <div>
                <span className="title-md">{bestZone.name} – {bestZone.subtitle}</span>
                <span className="label-md">
                  {bestZone.total - bestZone.occupied} spots · {formatVND(bestZone.rate)}/hr
                </span>
              </div>
            </div>
            <StatusChip status={getZoneStatus(bestZone)} />
          </div>
        </div>
      )}
    </div>
  );
}

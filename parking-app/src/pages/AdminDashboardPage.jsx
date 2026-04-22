import { useNavigate } from "react-router-dom";
import {
  FileText,
  Sliders,
  Activity,
  AlertTriangle,
  ShieldCheck,
  Users,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { formatVND } from "../data/mockData";
import "./AdminDashboardPage.css";

export default function AdminDashboardPage() {
  const { user, zones, policies, auditLogs } = useApp();
  const navigate = useNavigate();

  const totalSpots = zones.reduce((s, z) => s + z.total, 0);
  const occupied = zones.reduce((s, z) => s + z.occupied, 0);
  const occupancy = Math.round((occupied / totalSpots) * 100);
  const activePolicies = policies.filter((p) => p.enabled).length;
  const todayAlerts = auditLogs.filter(
    (l) => l.type === "alert" && !l.acknowledged
  ).length;
  const revenueToday = Math.round(occupied * 15000); // illustrative figure

  const recentAlerts = auditLogs
    .filter((l) => l.type === "alert")
    .slice(0, 3);

  const tiles = [
    {
      id: "policies",
      path: "/admin/policies",
      icon: FileText,
      label: "Policy management",
      desc: `${activePolicies} of ${policies.length} policies active`,
      tone: "primary",
    },
    {
      id: "pricing",
      path: "/admin/pricing",
      icon: Sliders,
      label: "Pricing & privileges",
      desc: "Tune zone rates and role discounts",
      tone: "secondary",
    },
    {
      id: "logs",
      path: "/admin/logs",
      icon: Activity,
      label: "Logs, audit & alerts",
      desc: `${todayAlerts} unacknowledged alerts`,
      tone: "tertiary",
    },
  ];

  return (
    <div className="page-container" id="admin-dashboard">
      <div className="admin-header animate-fade-in">
        <span className="chip chip-active admin-role-chip">
          <ShieldCheck size={12} />
          Administrator console
        </span>
        <h1 className="headline-lg">Welcome back, {user?.name?.split(" ").slice(-1)[0]}</h1>
        <p className="body-md" style={{ color: "var(--on-surface-variant)" }}>
          Monitor parking operations, tune policies, and respond to alerts.
        </p>
      </div>

      <div className="admin-stats stagger-children">
        <div className="admin-stat card">
          <div className="admin-stat-icon admin-tone-primary">
            <Users size={20} />
          </div>
          <div>
            <span className="headline-sm">{occupied}</span>
            <span className="label-md">
              Vehicles parked · {occupancy}% full
            </span>
          </div>
          <div className="capacity-bar admin-stat-bar">
            <div
              className={`capacity-bar-fill ${occupancy > 90 ? "nearly-full" : "available"}`}
              style={{ width: `${occupancy}%` }}
            />
          </div>
        </div>

        <div className="admin-stat card">
          <div className="admin-stat-icon admin-tone-secondary">
            <TrendingUp size={20} />
          </div>
          <div>
            <span className="headline-sm">{formatVND(revenueToday)}</span>
            <span className="label-md">Estimated revenue today</span>
          </div>
        </div>

        <div className="admin-stat card">
          <div className="admin-stat-icon admin-tone-tertiary">
            <AlertTriangle size={20} />
          </div>
          <div>
            <span className="headline-sm">{todayAlerts}</span>
            <span className="label-md">Active alerts to review</span>
          </div>
        </div>
      </div>

      <div className="admin-section animate-fade-in">
        <h2 className="title-md admin-section-title">Operations</h2>
        <div className="admin-tiles stagger-children">
          {tiles.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                className="admin-tile card card-interactive"
                onClick={() => navigate(t.path)}
                id={`admin-tile-${t.id}`}
              >
                <div className={`admin-tile-icon admin-tone-${t.tone}`}>
                  <Icon size={22} />
                </div>
                <div className="admin-tile-text">
                  <span className="title-md">{t.label}</span>
                  <span className="label-sm">{t.desc}</span>
                </div>
                <ArrowRight size={18} color="var(--on-surface-variant)" />
              </button>
            );
          })}
        </div>
      </div>

      <div className="admin-section animate-fade-in">
        <div className="admin-section-head">
          <h2 className="title-md admin-section-title">Recent alerts</h2>
          <button
            className="btn btn-secondary admin-section-link"
            onClick={() => navigate("/admin/logs")}
          >
            View all
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="admin-alert-list">
          {recentAlerts.length === 0 ? (
            <div className="admin-empty">
              <span className="label-md">No alerts right now — all quiet.</span>
            </div>
          ) : (
            recentAlerts.map((a) => (
              <div
                key={a.id}
                className={`admin-alert card severity-${a.severity}`}
              >
                <div className="admin-alert-severity">
                  <AlertTriangle size={16} />
                </div>
                <div className="admin-alert-text">
                  <span className="title-sm">{a.action}</span>
                  <span className="label-sm">
                    {a.actor} · {a.timestamp}
                  </span>
                </div>
                <span className={`chip chip-${a.severity}`}>
                  <span className="chip-dot" />
                  {a.severity}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

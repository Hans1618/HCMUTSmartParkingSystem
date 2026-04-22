import { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ShieldCheck,
  ScrollText,
  Search,
  CheckCheck,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import "./AdminLogsPage.css";

const TABS = [
  { key: "all", label: "All", icon: Activity },
  { key: "alert", label: "Alerts", icon: AlertTriangle },
  { key: "audit", label: "Audit", icon: ShieldCheck },
  { key: "log", label: "Logs", icon: ScrollText },
];

const TYPE_ICONS = {
  alert: AlertTriangle,
  audit: ShieldCheck,
  log: ScrollText,
};

export default function AdminLogsPage() {
  const { auditLogs, acknowledgeLog } = useApp();
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return auditLogs.filter((l) => {
      const matchTab = tab === "all" || l.type === tab;
      const q = search.trim().toLowerCase();
      const matchSearch =
        !q ||
        l.action.toLowerCase().includes(q) ||
        l.actor.toLowerCase().includes(q) ||
        l.id.toLowerCase().includes(q);
      return matchTab && matchSearch;
    });
  }, [auditLogs, tab, search]);

  const unacknowledged = auditLogs.filter(
    (l) => l.type === "alert" && !l.acknowledged
  ).length;

  return (
    <div className="page-container" id="admin-logs">
      <div className="admin-logs-header animate-fade-in">
        <h1 className="headline-lg">Logs, audit & alerts</h1>
        <p className="body-md" style={{ color: "var(--on-surface-variant)" }}>
          {unacknowledged > 0
            ? `${unacknowledged} alert${unacknowledged > 1 ? "s" : ""} awaiting review`
            : "All alerts acknowledged — system healthy."}
        </p>
      </div>

      <div className="admin-search animate-fade-in">
        <Search size={16} color="var(--outline)" />
        <input
          type="text"
          className="input-field"
          placeholder="Search by actor, action, or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          id="log-search"
        />
      </div>

      <div className="logs-tabs animate-fade-in" role="tablist">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.key;
          const count =
            t.key === "all"
              ? auditLogs.length
              : auditLogs.filter((l) => l.type === t.key).length;
          return (
            <button
              key={t.key}
              role="tab"
              aria-selected={active}
              className={`logs-tab ${active ? "active" : ""}`}
              onClick={() => setTab(t.key)}
            >
              <Icon size={14} />
              <span>{t.label}</span>
              <span className="logs-tab-count">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="logs-list stagger-children">
        {filtered.length === 0 ? (
          <div className="admin-empty">
            <span className="label-md">No entries match the current filter.</span>
          </div>
        ) : (
          filtered.map((l) => {
            const Icon = TYPE_ICONS[l.type] || Activity;
            return (
              <div
                key={l.id}
                className={`log-item card severity-${l.severity} ${l.acknowledged ? "ack" : ""}`}
              >
                <div className="log-item-icon">
                  <Icon size={16} />
                </div>
                <div className="log-item-body">
                  <div className="log-item-top">
                    <span className="title-sm">{l.action}</span>
                    <span className={`chip chip-${l.severity}`}>
                      <span className="chip-dot" />
                      {l.severity}
                    </span>
                  </div>
                  <span className="label-sm log-meta">
                    {l.id} · {l.actor}
                  </span>
                  <span className="label-sm log-meta">
                    {l.timestamp}
                    {l.acknowledged && (
                      <span className="log-ack-pill">
                        <CheckCheck size={10} />
                        acknowledged
                      </span>
                    )}
                  </span>
                  {l.type === "alert" && !l.acknowledged && (
                    <div className="log-actions">
                      <button
                        className="log-ack-btn"
                        onClick={() => acknowledgeLog(l.id)}
                      >
                        <CheckCheck size={14} />
                        Acknowledge
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

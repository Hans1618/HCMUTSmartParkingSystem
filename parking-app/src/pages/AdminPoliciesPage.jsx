import { useMemo, useState } from "react";
import {
  Search,
  CheckCircle2,
  Circle,
  Filter,
  FileText,
  Users,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import "./AdminPoliciesPage.css";

const CATEGORY_ICONS = {
  Pricing: Wallet,
  Access: Users,
  Security: ShieldCheck,
};

const FILTERS = [
  { key: "all", label: "All" },
  { key: "Pricing", label: "Pricing" },
  { key: "Access", label: "Access" },
  { key: "Security", label: "Security" },
];

export default function AdminPoliciesPage() {
  const { policies, togglePolicy } = useApp();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = useMemo(() => {
    return policies.filter((p) => {
      const matchCat = category === "all" || p.category === category;
      const query = search.trim().toLowerCase();
      const matchSearch =
        !query ||
        p.name.toLowerCase().includes(query) ||
        p.id.toLowerCase().includes(query);
      return matchCat && matchSearch;
    });
  }, [policies, category, search]);

  const enabledCount = policies.filter((p) => p.enabled).length;

  return (
    <div className="page-container" id="admin-policies">
      <div className="admin-policies-header animate-fade-in">
        <h1 className="headline-lg">Policy management</h1>
        <p className="body-md" style={{ color: "var(--on-surface-variant)" }}>
          {enabledCount} of {policies.length} policies enabled
        </p>
      </div>

      <div className="admin-policies-controls animate-fade-in">
        <div className="admin-search">
          <Search size={16} color="var(--outline)" />
          <input
            type="text"
            className="input-field"
            placeholder="Search by name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            id="policy-search"
          />
        </div>

        <div className="admin-filter-row">
          <Filter size={14} color="var(--on-surface-variant)" />
          <div className="admin-filter-chips">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                className={`admin-filter-chip ${category === f.key ? "active" : ""}`}
                onClick={() => setCategory(f.key)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="admin-policies-list stagger-children">
        {filtered.length === 0 ? (
          <div className="admin-empty">
            <FileText size={24} color="var(--outline)" />
            <span className="label-md">No matching policies.</span>
          </div>
        ) : (
          filtered.map((p) => {
            const Icon = CATEGORY_ICONS[p.category] || FileText;
            return (
              <div key={p.id} className="policy-card card" id={`policy-${p.id}`}>
                <div className="policy-card-left">
                  <div
                    className={`policy-card-icon ${p.enabled ? "enabled" : "disabled"}`}
                  >
                    <Icon size={18} />
                  </div>
                </div>
                <div className="policy-card-body">
                  <div className="policy-card-top">
                    <span className="title-sm">{p.name}</span>
                    <span className={`chip chip-${p.enabled ? "available" : "completed"}`}>
                      <span className="chip-dot" />
                      {p.enabled ? "Active" : "Disabled"}
                    </span>
                  </div>
                  <span className="label-sm policy-id">
                    {p.id} · {p.category} · updated {p.updatedAt}
                  </span>
                  <p className="body-sm policy-desc">{p.description}</p>
                  <div className="policy-card-meta">
                    <div className="policy-scope">
                      {p.scope.map((s) => (
                        <span key={s} className="policy-scope-tag">
                          {s}
                        </span>
                      ))}
                    </div>
                    <button
                      className={`policy-toggle ${p.enabled ? "on" : "off"}`}
                      onClick={() => togglePolicy(p.id)}
                      id={`toggle-${p.id}`}
                      aria-pressed={p.enabled}
                    >
                      {p.enabled ? (
                        <>
                          <CheckCircle2 size={14} /> Disable
                        </>
                      ) : (
                        <>
                          <Circle size={14} /> Enable
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

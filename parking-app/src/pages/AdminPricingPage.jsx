import { useState } from "react";
import {
  Sliders,
  Save,
  RotateCcw,
  GraduationCap,
  Briefcase,
  UserRound,
  Wallet,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { formatVND } from "../data/mockData";
import "./AdminPricingPage.css";

const ROLE_META = {
  student: { icon: GraduationCap, label: "University Member" },
  staff: { icon: Briefcase, label: "Faculty / Staff" },
  visitor: { icon: UserRound, label: "Visitor" },
};

export default function AdminPricingPage() {
  const { zones, privileges, updateZoneRate, updatePrivilege } = useApp();

  const [drafts, setDrafts] = useState(() =>
    zones.reduce((acc, z) => ({ ...acc, [z.id]: z.rate }), {})
  );
  const [privDrafts, setPrivDrafts] = useState(() =>
    privileges.reduce(
      (acc, p) => ({
        ...acc,
        [p.role]: {
          discount: Math.round(p.discount * 100),
          monthlyCap: p.monthlyCap,
        },
      }),
      {}
    )
  );
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  };

  const saveRate = (zoneId) => {
    updateZoneRate(zoneId, drafts[zoneId]);
    showToast("Zone rate updated");
  };

  const resetRate = (zoneId) => {
    const original = zones.find((z) => z.id === zoneId)?.rate ?? 0;
    setDrafts((prev) => ({ ...prev, [zoneId]: original }));
  };

  const savePrivilege = (role) => {
    const draft = privDrafts[role];
    updatePrivilege(role, {
      discount: Math.min(1, Math.max(0, Number(draft.discount) / 100)),
      monthlyCap: Math.max(0, Number(draft.monthlyCap) || 0),
    });
    showToast(`Privileges updated for ${ROLE_META[role]?.label || role}`);
  };

  return (
    <div className="page-container" id="admin-pricing">
      <div className="admin-pricing-header animate-fade-in">
        <span className="chip chip-active admin-role-chip">
          <Sliders size={12} />
          Pricing console
        </span>
        <h1 className="headline-lg">Pricing & privileges</h1>
        <p className="body-md" style={{ color: "var(--on-surface-variant)" }}>
          Fine-tune zone rates and role-based discounts. Changes are logged for
          audit.
        </p>
      </div>

      {/* Zone rates */}
      <div className="admin-section animate-fade-in">
        <h2 className="title-md admin-section-title">Zone rates (VND / hour)</h2>
        <div className="pricing-grid stagger-children">
          {zones.map((z) => {
            const draft = drafts[z.id];
            const dirty = Number(draft) !== Number(z.rate);
            return (
              <div key={z.id} className="pricing-card card">
                <div className="pricing-card-top">
                  <div className="pricing-zone-badge">{z.id}</div>
                  <div className="pricing-card-title">
                    <span className="title-sm">{z.name}</span>
                    <span className="label-sm">{z.subtitle}</span>
                  </div>
                  <Wallet size={16} color="var(--on-surface-variant)" />
                </div>

                <div className="pricing-card-body">
                  <label className="input-label" htmlFor={`rate-${z.id}`}>
                    Hourly rate
                  </label>
                  <div className="pricing-input-row">
                    <input
                      id={`rate-${z.id}`}
                      type="number"
                      min="0"
                      step="500"
                      className="input-field"
                      value={draft}
                      onChange={(e) =>
                        setDrafts((prev) => ({
                          ...prev,
                          [z.id]: Number(e.target.value),
                        }))
                      }
                    />
                    <span className="label-md">VND</span>
                  </div>
                  <span className="label-sm pricing-preview">
                    Preview · {formatVND(draft || 0)}/hr
                  </span>
                </div>

                <div className="pricing-card-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() => resetRate(z.id)}
                    disabled={!dirty}
                  >
                    <RotateCcw size={14} />
                    Reset
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => saveRate(z.id)}
                    disabled={!dirty}
                  >
                    <Save size={14} />
                    Save
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Privileges */}
      <div className="admin-section animate-fade-in">
        <h2 className="title-md admin-section-title">Role privileges</h2>
        <div className="priv-grid stagger-children">
          {privileges.map((p) => {
            const meta = ROLE_META[p.role] || {
              icon: UserRound,
              label: p.label,
            };
            const Icon = meta.icon;
            const draft = privDrafts[p.role] || {
              discount: 0,
              monthlyCap: 0,
            };
            const dirty =
              Number(draft.discount) !== Math.round(p.discount * 100) ||
              Number(draft.monthlyCap) !== p.monthlyCap;
            return (
              <div key={p.role} className="priv-card card">
                <div className="priv-card-top">
                  <div className="priv-icon">
                    <Icon size={18} />
                  </div>
                  <div>
                    <span className="title-sm">{meta.label}</span>
                    <span className="label-sm">
                      Reserved window · {p.reservedWindow}
                    </span>
                  </div>
                </div>

                <div className="priv-fields">
                  <div className="priv-field">
                    <label
                      className="input-label"
                      htmlFor={`discount-${p.role}`}
                    >
                      Discount (%)
                    </label>
                    <input
                      id={`discount-${p.role}`}
                      type="number"
                      min="0"
                      max="100"
                      step="5"
                      className="input-field"
                      value={draft.discount}
                      onChange={(e) =>
                        setPrivDrafts((prev) => ({
                          ...prev,
                          [p.role]: {
                            ...prev[p.role],
                            discount: Number(e.target.value),
                          },
                        }))
                      }
                    />
                  </div>

                  <div className="priv-field">
                    <label
                      className="input-label"
                      htmlFor={`cap-${p.role}`}
                    >
                      Monthly cap (VND)
                    </label>
                    <input
                      id={`cap-${p.role}`}
                      type="number"
                      min="0"
                      step="10000"
                      className="input-field"
                      value={draft.monthlyCap}
                      onChange={(e) =>
                        setPrivDrafts((prev) => ({
                          ...prev,
                          [p.role]: {
                            ...prev[p.role],
                            monthlyCap: Number(e.target.value),
                          },
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="priv-actions">
                  <span className="label-sm">
                    Current: {Math.round(p.discount * 100)}% off ·{" "}
                    {formatVND(p.monthlyCap)}/mo
                  </span>
                  <button
                    className="btn btn-primary"
                    onClick={() => savePrivilege(p.role)}
                    disabled={!dirty}
                  >
                    <Save size={14} />
                    Save
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {toast && <div className="admin-toast">{toast}</div>}
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Wallet,
  Smartphone,
  CreditCard,
  Building2,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { formatVND } from "../data/mockData";
import "./TopUpPage.css";

const QUICK_AMOUNTS = [50000, 100000, 200000, 500000];

const METHODS = [
  {
    key: "momo",
    label: "MoMo e-wallet",
    sub: "Scan & approve inside the MoMo app",
    icon: Smartphone,
    tone: "primary",
  },
  {
    key: "vnpay",
    label: "VNPay QR",
    sub: "Any domestic bank",
    icon: Wallet,
    tone: "tertiary",
  },
  {
    key: "card",
    label: "Credit / debit card",
    sub: "Visa, Mastercard, JCB",
    icon: CreditCard,
    tone: "secondary",
  },
  {
    key: "bkpay",
    label: "BKPay",
    sub: "HCMUT campus payment system",
    icon: Building2,
    tone: "tertiary",
  },
];

export default function TopUpPage() {
  const { balance, topUpBalance } = useApp();
  const navigate = useNavigate();
  const [amount, setAmount] = useState(100000);
  const [customAmount, setCustomAmount] = useState("");
  const [useCustom, setUseCustom] = useState(false);
  const [method, setMethod] = useState("momo");
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(null);

  const finalAmount = useCustom
    ? Math.max(0, Math.floor(Number(customAmount) || 0))
    : amount;

  const canSubmit = finalAmount >= 10000 && finalAmount <= 5000000;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setProcessing(true);
    setTimeout(() => {
      const result = topUpBalance({ amount: finalAmount, method });
      setProcessing(false);
      setDone({ ...result, method });
    }, 1100);
  };

  if (done) {
    const methodLabel = METHODS.find((m) => m.key === done.method)?.label || done.method;
    return (
      <div className="page-container" id="topup-success">
        <div className="topup-success animate-scale-in">
          <div className="topup-success-icon">
            <CheckCircle2 size={56} strokeWidth={1.5} />
          </div>
          <h1 className="headline-lg">Top-up successful</h1>
          <p className="body-md" style={{ color: "var(--on-surface-variant)" }}>
            Your balance has been updated instantly.
          </p>

          <div className="topup-receipt card">
            <div className="topup-receipt-row">
              <span className="label-md">Transaction ID</span>
              <span className="title-sm">{done.id}</span>
            </div>
            <div className="topup-receipt-row">
              <span className="label-md">Method</span>
              <span className="title-sm">{methodLabel}</span>
            </div>
            <div className="topup-receipt-row">
              <span className="label-md">Time</span>
              <span className="title-sm">
                {done.date} · {done.time}
              </span>
            </div>
            <div className="topup-receipt-divider" />
            <div className="topup-receipt-row">
              <span className="label-md">Amount added</span>
              <span className="title-lg" style={{ color: "var(--primary)" }}>
                +{formatVND(done.amount)}
              </span>
            </div>
            <div className="topup-receipt-row">
              <span className="label-md">New balance</span>
              <span className="title-md">{formatVND(balance)}</span>
            </div>
          </div>

          <div className="topup-success-actions">
            <button
              className="btn btn-primary btn-full btn-lg"
              onClick={() => navigate("/billing")}
            >
              View history
            </button>
            <button
              className="btn btn-secondary btn-full"
              onClick={() => navigate("/dashboard")}
            >
              Back to dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container" id="topup-page">
      <div className="topup-header animate-fade-in">
        <h1 className="headline-lg">Top up</h1>
        <p className="body-md" style={{ color: "var(--on-surface-variant)" }}>
          Add funds to your HCMUT wallet for seamless auto-payment at exit.
        </p>
      </div>

      <div className="topup-balance-card animate-fade-in-up">
        <div className="topup-balance-bg" />
        <div className="topup-balance-inner">
          <span className="label-lg" style={{ color: "rgba(255,255,255,0.85)" }}>
            Current balance
          </span>
          <span className="display-md topup-balance-amount">
            {formatVND(balance)}
          </span>
        </div>
      </div>

      <div className="topup-section animate-fade-in">
        <h2 className="title-md topup-section-title">Amount</h2>
        <div className="topup-amount-grid">
          {QUICK_AMOUNTS.map((value) => {
            const active = !useCustom && amount === value;
            return (
              <button
                key={value}
                className={`topup-amount-chip ${active ? "active" : ""}`}
                onClick={() => {
                  setUseCustom(false);
                  setAmount(value);
                }}
                id={`amount-${value}`}
              >
                <span className="title-sm">{formatVND(value)}</span>
              </button>
            );
          })}
        </div>

        <div className={`topup-custom ${useCustom ? "active" : ""}`}>
          <label className="input-label" htmlFor="topup-custom-amount">
            Custom amount (10,000₫ – 5,000,000₫)
          </label>
          <div className="topup-custom-row">
            <input
              id="topup-custom-amount"
              type="number"
              min="10000"
              max="5000000"
              step="10000"
              className="input-field"
              value={customAmount}
              placeholder="e.g. 150,000"
              onFocus={() => setUseCustom(true)}
              onChange={(e) => {
                setUseCustom(true);
                setCustomAmount(e.target.value);
              }}
            />
            <span className="label-md">VND</span>
          </div>
        </div>
      </div>

      <div className="topup-section animate-fade-in">
        <h2 className="title-md topup-section-title">Payment method</h2>
        <div className="topup-methods stagger-children">
          {METHODS.map((m) => {
            const Icon = m.icon;
            const active = method === m.key;
            return (
              <button
                key={m.key}
                className={`topup-method ${active ? "active" : ""}`}
                onClick={() => setMethod(m.key)}
                id={`topup-method-${m.key}`}
                data-tone={m.tone}
              >
                <div className="topup-method-icon">
                  <Icon size={20} />
                </div>
                <div className="topup-method-text">
                  <span className="title-sm">{m.label}</span>
                  <span className="label-sm">{m.sub}</span>
                </div>
                <div className={`topup-method-radio ${active ? "active" : ""}`}>
                  {active && <span className="dot" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="topup-secure">
        <ShieldCheck size={14} />
        <span className="label-sm">
          Secured by HCMUT Gateway. Your balance updates instantly after confirmation.
        </span>
      </div>

      <button
        className={`btn btn-primary btn-full btn-lg ${processing ? "confirming" : ""}`}
        onClick={handleSubmit}
        disabled={!canSubmit || processing}
        id="btn-confirm-topup"
      >
        {processing ? (
          "Processing..."
        ) : (
          <>
            Top up {finalAmount > 0 ? formatVND(finalAmount) : ""}
            <ArrowRight size={18} />
          </>
        )}
      </button>
    </div>
  );
}

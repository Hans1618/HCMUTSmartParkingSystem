import { useState } from "react";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { formatVND } from "../data/mockData";
import TransactionItem from "../components/TransactionItem";
import {
  Wallet,
  TrendingDown,
  TrendingUp,
  Plus,
  CreditCard,
  ArrowLeft,
  Smartphone,
  Building2,
  CheckCircle2,
  X,
} from "lucide-react";
import "./BillingPage.css";

const PAY_METHODS = [
  { key: "wallet", label: "HCMUT Wallet balance", icon: Wallet, tone: "primary" },
  { key: "momo", label: "MoMo", icon: Smartphone, tone: "tertiary" },
  { key: "card", label: "Credit / debit card", icon: CreditCard, tone: "secondary" },
  { key: "vnpay", label: "VNPay QR", icon: Building2, tone: "tertiary" },
];

export default function BillingPage() {
  const { balance, transactions, payAmount } = useApp();
  const navigate = useNavigate();
  const [payOpen, setPayOpen] = useState(false);
  const [payAmountInput, setPayAmountInput] = useState("");
  const [payMethod, setPayMethod] = useState("wallet");
  const [payError, setPayError] = useState("");
  const [paySuccess, setPaySuccess] = useState(null);

  const totalSpent = transactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const totalTopup = transactions
    .filter((t) => t.type === "topup")
    .reduce((sum, t) => sum + t.amount, 0);

  const handlePay = () => {
    setPayError("");
    const value = Math.max(0, Math.floor(Number(payAmountInput) || 0));
    if (value < 1000) {
      setPayError("Minimum amount is 1,000₫.");
      return;
    }
    const result = payAmount({
      amount: value,
      method: payMethod,
      description: "Parking payment",
    });
    if (!result.ok) {
      setPayError(result.error);
      return;
    }
    setPaySuccess({ amount: value, method: payMethod, id: result.txn.id });
  };

  const closePayModal = () => {
    setPayOpen(false);
    setPayAmountInput("");
    setPayMethod("wallet");
    setPayError("");
    setPaySuccess(null);
  };

  return (
    <div className="page-container" id="billing-page">
      <div className="billing-header animate-fade-in">
        <h1 className="headline-lg">Billing</h1>
      </div>

      <div className="billing-balance-card animate-fade-in-up">
        <div className="billing-balance-bg"></div>
        <div className="billing-balance-content">
          <span className="label-lg" style={{ color: "rgba(255,255,255,0.8)" }}>
            Current balance
          </span>
          <span className="display-md billing-balance-amount">
            {formatVND(balance)}
          </span>
          <div className="billing-balance-meta">
            <div className="billing-balance-meta-item">
              <TrendingDown size={14} />
              <span>{formatVND(totalSpent)} spent this month</span>
            </div>
            <div className="billing-balance-meta-item">
              <TrendingUp size={14} />
              <span>{formatVND(totalTopup)} topped up</span>
            </div>
          </div>
        </div>
      </div>

      <div className="billing-actions-grid animate-fade-in">
        <button
          className="billing-action-btn billing-action-primary"
          onClick={() => navigate("/topup")}
          id="btn-top-up"
        >
          <Plus size={18} />
          <span>Top up</span>
        </button>
        <button
          className="billing-action-btn billing-action-outline"
          onClick={() => setPayOpen(true)}
          id="btn-pay"
        >
          <CreditCard size={18} />
          <span>Pay</span>
        </button>
      </div>

      <div className="billing-section animate-fade-in">
        <h2 className="title-md billing-section-title">Transaction history</h2>
        <div className="billing-transactions">
          {transactions.map((txn, i) => (
            <TransactionItem key={txn.id} transaction={txn} index={i} />
          ))}
        </div>
      </div>

      <button
        className="btn btn-secondary btn-full billing-return-btn"
        onClick={() => navigate("/dashboard")}
        id="btn-return-dashboard"
      >
        <ArrowLeft size={18} />
        Back to dashboard
      </button>

      {payOpen && (
        <div
          className="billing-modal-backdrop"
          onClick={closePayModal}
          role="dialog"
        >
          <div
            className="billing-modal animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="billing-modal-close"
              onClick={closePayModal}
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {paySuccess ? (
              <div className="billing-pay-success">
                <div className="billing-pay-success-icon">
                  <CheckCircle2 size={48} strokeWidth={1.5} />
                </div>
                <h2 className="headline-sm">Payment successful</h2>
                <p className="body-md" style={{ color: "var(--on-surface-variant)" }}>
                  Paid {formatVND(paySuccess.amount)} via{" "}
                  {PAY_METHODS.find((m) => m.key === paySuccess.method)?.label}
                </p>
                <span className="label-sm">Transaction ID: {paySuccess.id}</span>
                <button
                  className="btn btn-primary btn-full"
                  onClick={closePayModal}
                  style={{ marginTop: "var(--space-md)" }}
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <h2 className="headline-sm">Pay</h2>
                <p className="body-sm" style={{ color: "var(--on-surface-variant)" }}>
                  Pay your parking fee or settle outstanding charges.
                </p>

                <div className="billing-modal-field">
                  <label className="input-label" htmlFor="pay-amount">
                    Amount (VND)
                  </label>
                  <input
                    id="pay-amount"
                    type="number"
                    className="input-field"
                    placeholder="e.g. 25,000"
                    value={payAmountInput}
                    onChange={(e) => setPayAmountInput(e.target.value)}
                  />
                </div>

                <div className="billing-modal-field">
                  <label className="input-label">Method</label>
                  <div className="billing-pay-methods">
                    {PAY_METHODS.map((m) => {
                      const Icon = m.icon;
                      const active = payMethod === m.key;
                      const subtitle =
                        m.key === "wallet"
                          ? `Available ${formatVND(balance)}`
                          : "Link & confirm in app";
                      return (
                        <button
                          key={m.key}
                          className={`billing-pay-method ${active ? "active" : ""}`}
                          onClick={() => setPayMethod(m.key)}
                          data-tone={m.tone}
                        >
                          <div className="billing-pay-method-icon">
                            <Icon size={16} />
                          </div>
                          <div className="billing-pay-method-text">
                            <span className="title-sm">{m.label}</span>
                            <span className="label-sm">{subtitle}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {payError && <div className="billing-modal-error">{payError}</div>}

                <button
                  className="btn btn-primary btn-full btn-lg"
                  onClick={handlePay}
                  id="btn-confirm-pay"
                >
                  Confirm payment
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Wallet,
  CreditCard,
  Banknote,
  Smartphone,
  CheckCircle2,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { formatVND, computeVisitorFee } from "../data/mockData";
import "./VisitorPaymentPage.css";

const paymentMethods = [
  {
    key: "momo",
    label: "MoMo e-wallet",
    sub: "Scan & approve inside the MoMo app",
    icon: Smartphone,
    tone: "primary",
  },
  {
    key: "card",
    label: "Credit / debit card",
    sub: "Visa, Mastercard, JCB, local ATM cards",
    icon: CreditCard,
    tone: "tertiary",
  },
  {
    key: "cash",
    label: "Pay at gate (cash)",
    sub: "Hand this ticket to the operator on exit",
    icon: Banknote,
    tone: "secondary",
  },
];

export default function VisitorPaymentPage() {
  const { visitorTicket, visitorReceipt, payVisitorTicket, resetVisitorFlow } =
    useApp();
  const navigate = useNavigate();

  const [method, setMethod] = useState("momo");
  const [processing, setProcessing] = useState(false);
  const [fee, setFee] = useState(() =>
    visitorTicket ? computeVisitorFee(visitorTicket, new Date()) : null
  );

  useEffect(() => {
    if (!visitorTicket || visitorReceipt) return;
    const id = setInterval(() => {
      setFee(computeVisitorFee(visitorTicket, new Date()));
    }, 1000);
    return () => clearInterval(id);
  }, [visitorTicket, visitorReceipt]);

  // Already paid — show receipt
  if (visitorReceipt) {
    return (
      <div className="page-container" id="visitor-payment-success">
        <div className="visitor-success animate-scale-in">
          <div className="visitor-success-icon">
            <CheckCircle2 size={56} strokeWidth={1.5} />
          </div>
          <h1 className="headline-lg">Payment complete</h1>
          <p className="body-md" style={{ color: "var(--on-surface-variant)" }}>
            Thank you for visiting HCMUT. The exit barrier will open shortly.
          </p>

          <div className="visitor-receipt card">
            <div className="visitor-receipt-row">
              <span className="label-md">Ticket</span>
              <span className="title-sm">{visitorReceipt.ticketId}</span>
            </div>
            <div className="visitor-receipt-row">
              <span className="label-md">Vehicle</span>
              <span className="title-sm">{visitorReceipt.licensePlate}</span>
            </div>
            <div className="visitor-receipt-row">
              <span className="label-md">Zone & Spot</span>
              <span className="title-sm">
                {visitorReceipt.zoneName} · {visitorReceipt.spot}
              </span>
            </div>
            <div className="visitor-receipt-row">
              <span className="label-md">Duration</span>
              <span className="title-sm">
                {visitorReceipt.hours}h {visitorReceipt.minutes}m
              </span>
            </div>
            <div className="visitor-receipt-row">
              <span className="label-md">Paid via</span>
              <span className="title-sm">
                {paymentMethods.find((m) => m.key === visitorReceipt.method)
                  ?.label || visitorReceipt.method}
              </span>
            </div>
            <div className="visitor-receipt-divider"></div>
            <div className="visitor-receipt-row">
              <span className="label-md">Amount paid</span>
              <span className="title-lg" style={{ color: "var(--primary)" }}>
                {formatVND(visitorReceipt.total)}
              </span>
            </div>
          </div>

          <div className="visitor-success-actions">
            <button
              className="btn btn-primary btn-full btn-lg"
              onClick={() => {
                resetVisitorFlow();
                navigate("/visitor/entry");
              }}
              id="btn-new-ticket"
            >
              <LogOut size={18} />
              Finish & exit
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!visitorTicket) {
    return (
      <div className="page-container" id="visitor-payment-empty">
        <div className="visitor-checkout-empty animate-fade-in">
          <h2 className="headline-sm">No ticket to pay for</h2>
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

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      payVisitorTicket({ method });
      setProcessing(false);
    }, 1100);
  };

  return (
    <div className="page-container" id="visitor-payment-page">
      <div className="visitor-payment-header animate-fade-in">
        <h1 className="headline-lg">Payment</h1>
        <p className="body-md" style={{ color: "var(--on-surface-variant)" }}>
          Choose how you would like to settle the ticket
        </p>
      </div>

      <div className="visitor-payment-amount animate-fade-in-up">
        <div className="visitor-payment-amount-bg"></div>
        <div className="visitor-payment-amount-inner">
          <span className="label-lg" style={{ color: "rgba(255,255,255,0.8)" }}>
            Amount due
          </span>
          <span className="display-md visitor-payment-amount-value">
            {formatVND(fee.total)}
          </span>
          <span className="label-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
            Ticket {visitorTicket.id} · {fee.hours}h {fee.minutes}m
          </span>
        </div>
      </div>

      <div className="visitor-payment-methods stagger-children">
        {paymentMethods.map((m) => {
          const Icon = m.icon;
          const active = method === m.key;
          return (
            <button
              key={m.key}
              className={`visitor-method ${active ? "active" : ""}`}
              onClick={() => setMethod(m.key)}
              id={`method-${m.key}`}
              data-tone={m.tone}
            >
              <div className="visitor-method-icon">
                <Icon size={20} />
              </div>
              <div className="visitor-method-text">
                <span className="title-sm">{m.label}</span>
                <span className="label-sm">{m.sub}</span>
              </div>
              <div className={`visitor-method-radio ${active ? "active" : ""}`}>
                {active && <span className="dot" />}
              </div>
            </button>
          );
        })}
      </div>

      <div className="visitor-payment-note animate-fade-in">
        <ShieldCheck size={14} />
        <span className="label-sm">
          Secured by HCMUT Gateway. Your ticket closes as soon as payment is
          confirmed.
        </span>
      </div>

      <button
        className={`btn btn-primary btn-full btn-lg ${processing ? "confirming" : ""}`}
        onClick={handlePay}
        disabled={processing}
        id="btn-pay-now"
      >
        {processing ? (
          "Processing payment..."
        ) : (
          <>
            <Wallet size={18} /> Pay {formatVND(fee.total)}
          </>
        )}
      </button>
    </div>
  );
}

import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { formatVND } from "../data/mockData";
import TransactionItem from "../components/TransactionItem";
import { Wallet, TrendingDown, ArrowLeft } from "lucide-react";
import "./BillingPage.css";

export default function BillingPage() {
  const { balance, transactions } = useApp();
  const navigate = useNavigate();

  const totalSpent = transactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return (
    <div className="page-container" id="billing-page">
      <div className="billing-header animate-fade-in">
        <h1 className="headline-lg">Billing</h1>
      </div>

      {/* Balance Card */}
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
              <span>
                {formatVND(totalSpent)} spent this month
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="billing-actions animate-fade-in">
        <button className="btn btn-outline btn-full" id="btn-top-up">
          <Wallet size={18} />
          Top up balance
        </button>
      </div>

      {/* Transaction History */}
      <div className="billing-section animate-fade-in">
        <h2 className="title-md billing-section-title">Transaction history</h2>
        <div className="billing-transactions">
          {transactions.map((txn, i) => (
            <TransactionItem key={txn.id} transaction={txn} index={i} />
          ))}
        </div>
      </div>

      {/* Return */}
      <button
        className="btn btn-secondary btn-full billing-return-btn"
        onClick={() => navigate("/dashboard")}
        id="btn-return-dashboard"
      >
        <ArrowLeft size={18} />
        Return to dashboard
      </button>
    </div>
  );
}

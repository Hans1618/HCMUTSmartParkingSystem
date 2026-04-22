import { formatVND } from "../data/mockData";
import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import "./TransactionItem.css";

export default function TransactionItem({ transaction, index }) {
  const isCredit = transaction.amount > 0;
  const bgClass = index % 2 === 0 ? "txn-bg-surface" : "txn-bg-lowest";

  return (
    <div className={`transaction-item ${bgClass}`} id={`txn-${transaction.id}`}>
      <div className="txn-icon-wrap">
        <div className={`txn-icon ${isCredit ? "txn-icon-credit" : "txn-icon-debit"}`}>
          {isCredit ? (
            <ArrowDownLeft size={16} />
          ) : (
            <ArrowUpRight size={16} />
          )}
        </div>
      </div>

      <div className="txn-details">
        <span className="title-sm">{transaction.zone}</span>
        <span className="label-sm">
          {transaction.date} · {transaction.time}
          {transaction.duration !== "—" && ` · ${transaction.duration}`}
        </span>
      </div>

      <div className="txn-amount">
        <span
          className={`title-lg ${isCredit ? "txn-amount-credit" : "txn-amount-debit"}`}
        >
          {isCredit ? "+" : "−"}{formatVND(transaction.amount)}
        </span>
      </div>
    </div>
  );
}

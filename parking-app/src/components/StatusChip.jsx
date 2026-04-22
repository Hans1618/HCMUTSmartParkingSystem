import "./StatusChip.css";

export default function StatusChip({ status, size = "md" }) {
  const statusLabels = {
    available: "Available",
    "nearly-full": "Nearly Full",
    full: "Full",
    active: "Active",
    completed: "Completed",
  };

  return (
    <span className={`chip chip-${status} chip-size-${size}`}>
      <span className="chip-dot"></span>
      {statusLabels[status] || status}
    </span>
  );
}

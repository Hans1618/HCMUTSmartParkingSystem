import {
  TrendingUp,
  Wallet,
  Receipt,
  Car,
  Bike,
  Truck,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Smartphone,
  CreditCard,
  Banknote,
} from "lucide-react";
import {
  formatVND,
  revenueWeekly,
  revenueByZone,
  revenueByVehicle,
  revenueRecentPayments,
} from "../data/mockData";
import "./AdminRevenuePage.css";

const VEHICLE_ICON = {
  motorcycle: Bike,
  car: Car,
  bicycle: Truck,
};

const METHOD_ICON = {
  MoMo: Smartphone,
  Card: CreditCard,
  VNPay: CreditCard,
  Wallet: Wallet,
  Cash: Banknote,
};

export default function AdminRevenuePage() {
  const todayRevenue = revenueWeekly[revenueWeekly.length - 1].revenue;
  const yesterdayRevenue = revenueWeekly[revenueWeekly.length - 2].revenue;
  const todaySessions = revenueWeekly[revenueWeekly.length - 1].sessions;
  const weekRevenue = revenueWeekly.reduce((sum, d) => sum + d.revenue, 0);
  const monthRevenue = weekRevenue * 4 + 1_240_000;
  const dailyAvg = Math.round(weekRevenue / revenueWeekly.length);

  const dayOverDay =
    yesterdayRevenue > 0
      ? Math.round(((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100)
      : 0;

  const maxDayRevenue = Math.max(...revenueWeekly.map((d) => d.revenue));

  const totalZoneRevenue = revenueByZone.reduce((s, z) => s + z.revenue, 0);

  return (
    <div className="page-container" id="admin-revenue">
      <div className="admin-revenue-header animate-fade-in">
        <span className="chip chip-active admin-role-chip">
          <TrendingUp size={12} />
          Revenue
        </span>
        <h1 className="headline-lg">Revenue overview</h1>
        <p className="body-md" style={{ color: "var(--on-surface-variant)" }}>
          Track revenue, transactions, and trends in real time.
        </p>
      </div>

      {/* Hero KPI */}
      <div className="revenue-hero animate-fade-in-up">
        <div className="revenue-hero-bg" />
        <div className="revenue-hero-inner">
          <span className="label-lg" style={{ color: "rgba(255,255,255,0.85)" }}>
            Revenue today
          </span>
          <span className="display-md revenue-hero-amount">
            {formatVND(todayRevenue)}
          </span>
          <div className="revenue-hero-meta">
            <div
              className={`revenue-trend ${dayOverDay >= 0 ? "up" : "down"}`}
            >
              {dayOverDay >= 0 ? (
                <ArrowUpRight size={14} />
              ) : (
                <ArrowDownRight size={14} />
              )}
              <span>
                {dayOverDay >= 0 ? "+" : ""}
                {dayOverDay}% vs yesterday
              </span>
            </div>
            <span className="label-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
              {todaySessions} transactions
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="revenue-kpis stagger-children">
        <div className="revenue-kpi card">
          <div className="revenue-kpi-icon kpi-tone-primary">
            <Calendar size={18} />
          </div>
          <div className="revenue-kpi-text">
            <span className="label-sm">This week</span>
            <span className="title-md">{formatVND(weekRevenue)}</span>
          </div>
        </div>
        <div className="revenue-kpi card">
          <div className="revenue-kpi-icon kpi-tone-secondary">
            <Wallet size={18} />
          </div>
          <div className="revenue-kpi-text">
            <span className="label-sm">This month</span>
            <span className="title-md">{formatVND(monthRevenue)}</span>
          </div>
        </div>
        <div className="revenue-kpi card">
          <div className="revenue-kpi-icon kpi-tone-tertiary">
            <Receipt size={18} />
          </div>
          <div className="revenue-kpi-text">
            <span className="label-sm">Avg / day</span>
            <span className="title-md">{formatVND(dailyAvg)}</span>
          </div>
        </div>
      </div>

      {/* Weekly bar chart */}
      <div className="admin-section animate-fade-in">
        <div className="admin-section-head">
          <h2 className="title-md admin-section-title">Past 7 days</h2>
          <span className="label-sm">Peak: {formatVND(maxDayRevenue)}</span>
        </div>

        <div className="revenue-chart card">
          {revenueWeekly.map((d) => {
            const heightPct = Math.round((d.revenue / maxDayRevenue) * 100);
            const isMax = d.revenue === maxDayRevenue;
            return (
              <div key={d.day} className="revenue-bar-col">
                <div className="revenue-bar-track">
                  <div
                    className={`revenue-bar-fill ${isMax ? "peak" : ""}`}
                    style={{ height: `${heightPct}%` }}
                    title={formatVND(d.revenue)}
                  />
                </div>
                <span className="label-sm revenue-bar-label">{d.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* By zone */}
      <div className="admin-section animate-fade-in">
        <h2 className="title-md admin-section-title">By zone</h2>
        <div className="revenue-zone-list stagger-children">
          {revenueByZone.map((z) => {
            const share = Math.round((z.revenue / totalZoneRevenue) * 100);
            return (
              <div key={z.zoneId} className="revenue-zone-card card">
                <div className="revenue-zone-badge">{z.zoneId}</div>
                <div className="revenue-zone-text">
                  <div className="revenue-zone-row">
                    <span className="title-sm">Zone {z.zoneId}</span>
                    <span className="title-sm">{formatVND(z.revenue)}</span>
                  </div>
                  <div className="revenue-zone-bar">
                    <div
                      className="revenue-zone-bar-fill"
                      style={{ width: `${share}%` }}
                    />
                  </div>
                  <div className="revenue-zone-row">
                    <span className="label-sm">
                      {z.sessions} sessions · {share}%
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* By vehicle */}
      <div className="admin-section animate-fade-in">
        <h2 className="title-md admin-section-title">By vehicle type</h2>
        <div className="revenue-vehicle-grid stagger-children">
          {revenueByVehicle.map((v) => {
            const Icon = VEHICLE_ICON[v.type] || Car;
            return (
              <div key={v.type} className="revenue-vehicle card">
                <div className="revenue-vehicle-icon">
                  <Icon size={18} />
                </div>
                <div className="revenue-vehicle-text">
                  <span className="label-sm">{v.label}</span>
                  <span className="title-sm">{formatVND(v.revenue)}</span>
                  <span className="label-sm">
                    {Math.round(v.share * 100)}% of total
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent payments */}
      <div className="admin-section animate-fade-in">
        <h2 className="title-md admin-section-title">Recent payments</h2>
        <div className="revenue-payment-list">
          {revenueRecentPayments.map((p) => {
            const Icon = METHOD_ICON[p.method] || Receipt;
            return (
              <div key={p.id} className="revenue-payment card">
                <div className="revenue-payment-icon">
                  <Icon size={16} />
                </div>
                <div className="revenue-payment-text">
                  <span className="title-sm">
                    {p.plate} · {p.zone}
                  </span>
                  <span className="label-sm">
                    {p.time} · {p.method} · {p.id}
                  </span>
                </div>
                <span className="title-sm" style={{ color: "var(--primary)" }}>
                  +{formatVND(p.amount)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

import { useApp } from "../context/AppContext";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Car,
  Receipt,
  ChevronLeft,
  UserRound,
  Ticket,
  LogOut,
  CreditCard,
  ShieldCheck,
  FileText,
  Sliders,
  Activity,
} from "lucide-react";
import "./Navbar.css";

export function TopBar() {
  const { user, activeSession, visitorTicket } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const isLoginPage = location.pathname === "/";
  if (isLoginPage || !user) return null;

  const homePath =
    user.role === "admin"
      ? "/admin"
      : user.role === "visitor"
        ? visitorTicket
          ? "/visitor/ticket"
          : "/visitor/entry"
        : "/dashboard";

  const showBack = location.pathname !== homePath && location.pathname !== "/";

  return (
    <header className="navbar glass" id="main-navbar">
      <div className="navbar-inner">
        <div className="navbar-left">
          {showBack ? (
            <button
              className="navbar-back"
              onClick={() => navigate(-1)}
              aria-label="Go back"
            >
              <ChevronLeft size={20} />
            </button>
          ) : (
            <div className="navbar-brand" onClick={() => navigate(homePath)}>
              <img
                src="/logo-hcmut.png"
                alt="HCMUT"
                className="navbar-logo-img"
              />
              <span className="title-sm">
                HCMUT {user.role === "admin" ? "Console" : "Park"}
              </span>
            </div>
          )}
        </div>

        <div className="navbar-right">
          {activeSession && user.role === "student" && (
            <div
              className="navbar-session-indicator"
              onClick={() => navigate("/session")}
            >
              <span className="chip-dot active-dot"></span>
              <span className="label-sm">Active</span>
            </div>
          )}
          {visitorTicket && user.role === "visitor" && (
            <div
              className="navbar-session-indicator"
              onClick={() => navigate("/visitor/ticket")}
            >
              <span className="chip-dot active-dot"></span>
              <span className="label-sm">Ticket</span>
            </div>
          )}
          <button
            className="navbar-avatar"
            onClick={() => navigate("/account")}
            title="Account"
          >
            <span>{user.name.charAt(0)}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

const STUDENT_NAV = [
  { path: "/dashboard", icon: LayoutDashboard, label: "Home" },
  { path: "/parking", icon: Car, label: "Park" },
  { path: "/billing", icon: Receipt, label: "Billing" },
  { path: "/account", icon: UserRound, label: "Account" },
];

const VISITOR_NAV_ENTRY = [
  { path: "/visitor/entry", icon: Ticket, label: "Entry" },
  { path: "/account", icon: UserRound, label: "Profile" },
  { path: "/", icon: LogOut, label: "Exit", isLogout: true },
];

const VISITOR_NAV_ACTIVE = [
  { path: "/visitor/ticket", icon: Ticket, label: "Ticket" },
  { path: "/visitor/checkout", icon: CreditCard, label: "Check-out" },
  { path: "/account", icon: UserRound, label: "Profile" },
];

const ADMIN_NAV = [
  { path: "/admin", icon: ShieldCheck, label: "Overview" },
  { path: "/admin/policies", icon: FileText, label: "Policies" },
  { path: "/admin/pricing", icon: Sliders, label: "Pricing" },
  { path: "/admin/logs", icon: Activity, label: "Logs" },
];

export function BottomNav() {
  const { user, visitorTicket, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const isLoginPage = location.pathname === "/";
  if (isLoginPage || !user) return null;

  let navItems = STUDENT_NAV;
  if (user.role === "admin") navItems = ADMIN_NAV;
  else if (user.role === "visitor")
    navItems = visitorTicket ? VISITOR_NAV_ACTIVE : VISITOR_NAV_ENTRY;

  return (
    <nav className="bottom-nav glass-strong" id="bottom-navigation">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        const handleClick = () => {
          if (item.isLogout) {
            logout();
            navigate("/");
          } else {
            navigate(item.path);
          }
        };
        return (
          <button
            key={item.path + item.label}
            className={`bottom-nav-item ${isActive ? "active" : ""}`}
            onClick={handleClick}
            id={`nav-${item.label.toLowerCase()}`}
          >
            <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
            <span className="label-sm">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default function Navbar() {
  return (
    <>
      <TopBar />
      <BottomNav />
    </>
  );
}

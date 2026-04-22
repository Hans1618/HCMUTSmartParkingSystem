import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { formatVND } from "../data/mockData";
import {
  User,
  Mail,
  Phone,
  CreditCard,
  Car,
  GraduationCap,
  Shield,
  LogOut,
  ChevronRight,
  Wallet,
  Bell,
  HelpCircle,
} from "lucide-react";
import "./AccountPage.css";

export default function AccountPage() {
  const { user, balance, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getRoleBadge = () => {
    switch (user?.role) {
      case "student":
        return { icon: GraduationCap, label: "University Member", color: "var(--primary)" };
      case "visitor":
        return { icon: User, label: "Visitor", color: "var(--tertiary)" };
      case "admin":
        return { icon: Shield, label: "Administrator", color: "var(--secondary)" };
      default:
        return { icon: User, label: "User", color: "var(--primary)" };
    }
  };

  const roleBadge = getRoleBadge();
  const RoleIcon = roleBadge.icon;

  return (
    <div className="page-container" id="account-page">
      {/* Profile Header */}
      <div className="account-header animate-fade-in">
        <div className="account-avatar-wrap">
          <div className="account-avatar">
            <span className="display-md">{user?.name?.charAt(0)}</span>
          </div>
          <div
            className="account-role-badge"
            style={{ background: roleBadge.color }}
          >
            <RoleIcon size={12} color="white" />
          </div>
        </div>
        <h1 className="headline-sm account-name">{user?.name}</h1>
        <span
          className="chip chip-active account-role-chip"
          style={{
            background: roleBadge.color + "1a",
            color: roleBadge.color,
          }}
        >
          <RoleIcon size={12} />
          {roleBadge.label}
        </span>
      </div>

      {/* Balance Card */}
      {user?.role === "student" && (
        <div className="account-balance card animate-fade-in-up">
          <div className="account-balance-left">
            <Wallet size={20} color="var(--primary)" />
            <div>
              <span className="label-md">Balance</span>
              <span className="title-lg">{formatVND(balance)}</span>
            </div>
          </div>
          <button
            className="btn btn-outline"
            onClick={() => navigate("/billing")}
            style={{ padding: "0.5rem 1rem", fontSize: "0.75rem" }}
          >
            Top up
          </button>
        </div>
      )}

      {/* Info Section */}
      <div className="account-section animate-fade-in">
        <h2 className="title-md account-section-title">Personal Information</h2>
        <div className="account-info-card card">
          <div className="account-info-row">
            <div className="account-info-icon">
              <User size={16} />
            </div>
            <div className="account-info-content">
              <span className="label-sm">Full Name</span>
              <span className="body-md">{user?.name}</span>
            </div>
          </div>

          <div className="account-info-row">
            <div className="account-info-icon">
              <Mail size={16} />
            </div>
            <div className="account-info-content">
              <span className="label-sm">Email</span>
              <span className="body-md">{user?.email}</span>
            </div>
          </div>

          <div className="account-info-row">
            <div className="account-info-icon">
              <Phone size={16} />
            </div>
            <div className="account-info-content">
              <span className="label-sm">Phone</span>
              <span className="body-md">{user?.phone}</span>
            </div>
          </div>

          {user?.studentId && (
            <div className="account-info-row">
              <div className="account-info-icon">
                <CreditCard size={16} />
              </div>
              <div className="account-info-content">
                <span className="label-sm">
                  {user.role === "admin" ? "Staff ID" : "Student ID"}
                </span>
                <span className="body-md">{user.studentId}</span>
              </div>
            </div>
          )}

          {user?.faculty && (
            <div className="account-info-row">
              <div className="account-info-icon">
                <GraduationCap size={16} />
              </div>
              <div className="account-info-content">
                <span className="label-sm">Faculty</span>
                <span className="body-md">{user.faculty}</span>
              </div>
            </div>
          )}

          <div className="account-info-row">
            <div className="account-info-icon">
              <Car size={16} />
            </div>
            <div className="account-info-content">
              <span className="label-sm">License Plate</span>
              <span className="body-md">{user?.licensePlate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="account-section animate-fade-in">
        <h2 className="title-md account-section-title">Settings</h2>
        <div className="account-menu card">
          <button className="account-menu-item" id="menu-notifications">
            <Bell size={18} color="var(--on-surface-variant)" />
            <span className="body-md">Notifications</span>
            <ChevronRight size={16} color="var(--outline)" />
          </button>
          <button className="account-menu-item" id="menu-help">
            <HelpCircle size={18} color="var(--on-surface-variant)" />
            <span className="body-md">Help & Support</span>
            <ChevronRight size={16} color="var(--outline)" />
          </button>
          <button className="account-menu-item" id="menu-privacy">
            <Shield size={18} color="var(--on-surface-variant)" />
            <span className="body-md">Privacy & Security</span>
            <ChevronRight size={16} color="var(--outline)" />
          </button>
        </div>
      </div>

      {/* Logout */}
      <button
        className="btn btn-danger btn-full account-logout"
        onClick={handleLogout}
        id="btn-logout"
      >
        <LogOut size={18} />
        Sign out
      </button>

      <p className="label-sm account-version">HCMUT Smart Parking v1.0.0</p>
    </div>
  );
}

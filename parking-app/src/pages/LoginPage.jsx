import { useState } from "react";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import {
  GraduationCap,
  UserRound,
  ShieldCheck,
  ArrowRight,
  Ticket,
  Settings,
} from "lucide-react";
import "./LoginPage.css";

const roles = [
  {
    key: "student",
    label: "University Member",
    desc: "Sign in with HCMUT SSO to access campus parking",
    icon: GraduationCap,
    color: "var(--primary)",
    bg: "var(--primary-light)",
    cta: "Sign in with HCMUT SSO",
  },
  {
    key: "visitor",
    label: "Visitor / Temporary",
    desc: "Quick entry without a university account",
    icon: Ticket,
    color: "var(--tertiary)",
    bg: "var(--tertiary-fixed)",
    cta: "Enter as visitor",
  },
  {
    key: "admin",
    label: "Administrator / Operator",
    desc: "System management, policies, and audit",
    icon: Settings,
    color: "var(--secondary)",
    bg: "var(--secondary-container)",
    cta: "Sign in as admin",
  },
];

export default function LoginPage() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("student");
  const [loggingIn, setLoggingIn] = useState(false);

  const activeRole = roles.find((r) => r.key === selectedRole);

  const handleLogin = () => {
    setLoggingIn(true);
    setTimeout(() => {
      login(selectedRole);
      if (selectedRole === "admin") navigate("/admin");
      else if (selectedRole === "visitor") navigate("/visitor/entry");
      else navigate("/dashboard");
    }, 600);
  };

  return (
    <div className="login-page" id="login-page">
      {/* Decorative background shapes */}
      <div className="login-bg-shape login-bg-shape-1"></div>
      <div className="login-bg-shape login-bg-shape-2"></div>

      <div className="login-content animate-fade-in-up">
        {/* Logo & Branding */}
        <div className="login-brand">
          <img
            src="/logo-hcmut.png"
            alt="HCMUT Logo"
            className="login-logo-img"
          />
          <h1 className="headline-lg login-title">
            HCMUT <span className="login-title-accent">Smart Parking</span>
          </h1>
          <p className="body-sm login-subtitle">
            Intelligent campus parking management
          </p>
        </div>

        {/* Role Selection */}
        <div className="login-roles">
          <p className="label-md login-roles-label">Select your role</p>
          <div className="login-roles-list stagger-children">
            {roles.map((role) => {
              const Icon = role.icon;
              const isActive = selectedRole === role.key;
              return (
                <button
                  key={role.key}
                  className={`login-role-card ${isActive ? "login-role-active" : ""}`}
                  onClick={() => setSelectedRole(role.key)}
                  id={`role-${role.key}`}
                  style={{
                    "--role-color": role.color,
                    "--role-bg": role.bg,
                  }}
                >
                  <div className="login-role-icon">
                    <Icon size={20} />
                  </div>
                  <div className="login-role-text">
                    <span className="title-sm">{role.label}</span>
                    <span className="label-sm">{role.desc}</span>
                  </div>
                  {isActive && (
                    <div className="login-role-check">
                      <ShieldCheck size={16} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <button
          className={`btn btn-primary btn-full btn-lg login-cta ${loggingIn ? "confirming" : ""}`}
          onClick={handleLogin}
          disabled={loggingIn}
          id="btn-login"
        >
          {loggingIn ? "Signing in..." : activeRole.cta}
          {!loggingIn && <ArrowRight size={18} />}
        </button>

        <p className="label-sm login-disclaimer">
          By signing in, you agree to the campus parking terms of service.
        </p>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import {
  GraduationCap,
  ShieldCheck,
  ArrowRight,
  Ticket,
  Settings,
  Lock,
  User,
  ArrowLeft,
  Eye,
  EyeOff,
  Info,
} from "lucide-react";
import { demoCredentials } from "../data/mockData";
import "./LoginPage.css";

const roles = [
  {
    key: "student",
    label: "University Member",
    desc: "Sign in with your HCMUT account to access campus parking",
    icon: GraduationCap,
    color: "var(--primary)",
    bg: "var(--primary-light)",
    cta: "Sign in with HCMUT account",
    requiresAuth: true,
  },
  {
    key: "visitor",
    label: "Visitor / Temporary",
    desc: "Quick entry without a university account",
    icon: Ticket,
    color: "var(--tertiary)",
    bg: "var(--tertiary-fixed)",
    cta: "Continue as visitor",
    requiresAuth: false,
  },
  {
    key: "admin",
    label: "Administrator / Operator",
    desc: "System management, policies, and audit",
    icon: Settings,
    color: "var(--secondary)",
    bg: "var(--secondary-container)",
    cta: "Sign in as administrator",
    requiresAuth: true,
  },
];

export default function LoginPage() {
  const { login } = useApp();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("student");
  const [step, setStep] = useState("role"); // "role" | "credentials"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [error, setError] = useState("");

  const activeRole = roles.find((r) => r.key === selectedRole);

  const handleRoleContinue = () => {
    setError("");
    if (!activeRole.requiresAuth) {
      setLoggingIn(true);
      setTimeout(() => {
        login(selectedRole);
        navigate("/visitor/entry");
      }, 500);
      return;
    }
    const demo = demoCredentials[selectedRole];
    setUsername(demo?.username || "");
    setPassword("");
    setStep("credentials");
  };

  const handleSubmitCredentials = (e) => {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password) {
      setError("Please enter your username and password.");
      return;
    }
    setLoggingIn(true);
    setTimeout(() => {
      const result = login(selectedRole, { username, password });
      if (!result.ok) {
        setError(result.error || "Sign-in failed.");
        setLoggingIn(false);
        return;
      }
      if (selectedRole === "admin") navigate("/admin");
      else navigate("/dashboard");
    }, 600);
  };

  const handleBackToRole = () => {
    setStep("role");
    setError("");
    setPassword("");
    setShowPassword(false);
    setLoggingIn(false);
  };

  return (
    <div className="login-page" id="login-page">
      <div className="login-bg-shape login-bg-shape-1"></div>
      <div className="login-bg-shape login-bg-shape-2"></div>

      <div
        className={`login-content animate-fade-in-up login-step-${step}`}
      >
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

        {step === "role" && (
          <>
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

            <button
              className={`btn btn-primary btn-full btn-lg login-cta ${loggingIn ? "confirming" : ""}`}
              onClick={handleRoleContinue}
              disabled={loggingIn}
              id="btn-login"
            >
              {loggingIn ? "Processing..." : activeRole.cta}
              {!loggingIn && <ArrowRight size={18} />}
            </button>

            <p className="label-sm login-disclaimer">
              By signing in, you agree to the campus parking terms of service.
            </p>
          </>
        )}

        {step === "credentials" && (
          <form
            className="login-credentials"
            onSubmit={handleSubmitCredentials}
            id="login-credentials-form"
          >
            <button
              type="button"
              className="login-back-btn"
              onClick={handleBackToRole}
              aria-label="Back to role selection"
            >
              <ArrowLeft size={16} />
              <span className="label-md">Change role</span>
            </button>

            <div
              className="login-role-summary"
              style={{
                "--role-color": activeRole.color,
                "--role-bg": activeRole.bg,
              }}
            >
              <div className="login-role-summary-icon">
                <activeRole.icon size={18} />
              </div>
              <div className="login-role-summary-text">
                <span className="title-sm">{activeRole.label}</span>
                <span className="label-sm">Sign in to continue</span>
              </div>
            </div>

            <div className="login-field">
              <label className="input-label" htmlFor="login-username">
                Username
              </label>
              <div className="login-input-wrap">
                <User size={16} className="login-input-icon" />
                <input
                  id="login-username"
                  className="input-field login-input"
                  type="text"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={
                    selectedRole === "admin"
                      ? "admin"
                      : "Student / staff ID"
                  }
                />
              </div>
            </div>

            <div className="login-field">
              <label className="input-label" htmlFor="login-password">
                Password
              </label>
              <div className="login-input-wrap">
                <Lock size={16} className="login-input-icon" />
                <input
                  id="login-password"
                  className="input-field login-input"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="login-eye-btn"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="login-error" role="alert">
                {error}
              </div>
            )}

            <div className="login-hint">
              <Info size={13} />
              <span>
                Demo:{" "}
                <strong>{demoCredentials[selectedRole]?.username}</strong> /{" "}
                <strong>{demoCredentials[selectedRole]?.password}</strong>
              </span>
            </div>

            <button
              type="submit"
              className={`btn btn-primary btn-full btn-lg login-cta ${loggingIn ? "confirming" : ""}`}
              disabled={loggingIn}
              id="btn-login-submit"
            >
              {loggingIn ? "Signing in..." : "Sign in"}
              {!loggingIn && <ArrowRight size={18} />}
            </button>

            <p className="label-sm login-disclaimer">
              Forgot your password? Contact HCMUT IT administration.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

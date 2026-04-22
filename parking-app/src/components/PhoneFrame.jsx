import "./PhoneFrame.css";

export default function PhoneFrame({ children }) {
  return (
    <div className="demo-shell">
      <div className="demo-phone">
        {/* Phone body (border/buttons) */}
        <div className="demo-phone-body" />

        {/* Screen */}
        <div className="demo-phone-screen">
          {/* Dynamic Island */}
          <div className="demo-phone-island" />

          {/* Scrollable app content */}
          <div className="demo-phone-content" id="phone-content">
            {children}
          </div>

          {/* Home indicator */}
          <div className="demo-phone-home" />
        </div>
      </div>

      <div className="demo-brand-bar">
        <span className="demo-brand-text">HCMUT Smart Parking MVP Demo</span>
      </div>
    </div>
  );
}

import { useNavigate } from "react-router-dom";
import {
  HelpCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  Ticket,
  CreditCard,
  ArrowRight,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import "./VisitorHelpPage.css";

const FAQS = [
  {
    icon: Ticket,
    title: "How to get a parking ticket",
    desc: "Tap 'Register entry' on the Entry screen, fill in your license plate and vehicle type to receive a temporary ticket.",
  },
  {
    icon: CreditCard,
    title: "Payment methods",
    desc: "We accept MoMo, debit/credit cards, and cash on exit at the gate.",
  },
  {
    icon: Clock,
    title: "Ticket validity",
    desc: "Tickets are valid for 8 hours. Beyond that, the daily cap applies automatically.",
  },
  {
    icon: MapPin,
    title: "Finding your zone",
    desc: "The system automatically assigns you to the zone with the most available spots when you take a ticket.",
  },
];

export default function VisitorHelpPage() {
  const navigate = useNavigate();
  const { visitorTicket } = useApp();

  return (
    <div className="page-container" id="visitor-help-page">
      <div className="visitor-help-header animate-fade-in">
        <div className="visitor-help-icon">
          <HelpCircle size={28} />
        </div>
        <h1 className="headline-lg">Visitor help</h1>
        <p className="body-md" style={{ color: "var(--on-surface-variant)" }}>
          A quick guide to using HCMUT temporary parking.
        </p>
      </div>

      <div className="visitor-help-section animate-fade-in">
        <h2 className="title-md visitor-help-section-title">Frequently asked questions</h2>
        <div className="visitor-help-list stagger-children">
          {FAQS.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="visitor-help-card card">
                <div className="visitor-help-card-icon">
                  <Icon size={18} />
                </div>
                <div className="visitor-help-card-text">
                  <span className="title-sm">{f.title}</span>
                  <span className="body-sm">{f.desc}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="visitor-help-section animate-fade-in">
        <h2 className="title-md visitor-help-section-title">Contact support</h2>
        <div className="visitor-help-contact card">
          <div className="visitor-help-contact-row">
            <Phone size={16} />
            <div>
              <span className="label-sm">Parking hotline</span>
              <span className="title-sm">028 3864 7256</span>
            </div>
          </div>
          <div className="visitor-help-contact-row">
            <Mail size={16} />
            <div>
              <span className="label-sm">Email</span>
              <span className="title-sm">parking@hcmut.edu.vn</span>
            </div>
          </div>
          <div className="visitor-help-contact-row">
            <MapPin size={16} />
            <div>
              <span className="label-sm">Office</span>
              <span className="title-sm">268 Ly Thuong Kiet, Dist. 10, HCMC</span>
            </div>
          </div>
        </div>
      </div>

      <button
        className="btn btn-primary btn-full btn-lg"
        onClick={() =>
          navigate(visitorTicket ? "/visitor/ticket" : "/visitor/entry")
        }
      >
        {visitorTicket ? "Back to ticket" : "Register entry"}
        <ArrowRight size={18} />
      </button>
    </div>
  );
}

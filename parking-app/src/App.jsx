import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
import { TopBar, BottomNav } from "./components/Navbar";
import PhoneFrame from "./components/PhoneFrame";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ParkingAvailabilityPage from "./pages/ParkingAvailabilityPage";
import CheckInPage from "./pages/CheckInPage";
import ActiveSessionPage from "./pages/ActiveSessionPage";
import CheckOutPage from "./pages/CheckOutPage";
import BillingPage from "./pages/BillingPage";
import AccountPage from "./pages/AccountPage";
import VisitorEntryPage from "./pages/VisitorEntryPage";
import VisitorTicketPage from "./pages/VisitorTicketPage";
import VisitorCheckoutPage from "./pages/VisitorCheckoutPage";
import VisitorPaymentPage from "./pages/VisitorPaymentPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminPoliciesPage from "./pages/AdminPoliciesPage";
import AdminPricingPage from "./pages/AdminPricingPage";
import AdminLogsPage from "./pages/AdminLogsPage";

function ProtectedRoute({ children, allow }) {
  const { user } = useApp();
  if (!user) return <Navigate to="/" replace />;
  if (allow && !allow.includes(user.role))
    return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  return (
    <>
      <TopBar />

      <Routes>
        <Route path="/" element={<LoginPage />} />

        {/* Student member routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allow={["student"]}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/parking"
          element={
            <ProtectedRoute allow={["student"]}>
              <ParkingAvailabilityPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkin/:zoneId"
          element={
            <ProtectedRoute allow={["student"]}>
              <CheckInPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/session"
          element={
            <ProtectedRoute allow={["student"]}>
              <ActiveSessionPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute allow={["student"]}>
              <CheckOutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/billing"
          element={
            <ProtectedRoute allow={["student"]}>
              <BillingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account"
          element={
            <ProtectedRoute>
              <AccountPage />
            </ProtectedRoute>
          }
        />

        {/* Visitor routes */}
        <Route
          path="/visitor/entry"
          element={
            <ProtectedRoute allow={["visitor"]}>
              <VisitorEntryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/visitor/ticket"
          element={
            <ProtectedRoute allow={["visitor"]}>
              <VisitorTicketPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/visitor/checkout"
          element={
            <ProtectedRoute allow={["visitor"]}>
              <VisitorCheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/visitor/payment"
          element={
            <ProtectedRoute allow={["visitor"]}>
              <VisitorPaymentPage />
            </ProtectedRoute>
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allow={["admin"]}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/policies"
          element={
            <ProtectedRoute allow={["admin"]}>
              <AdminPoliciesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/pricing"
          element={
            <ProtectedRoute allow={["admin"]}>
              <AdminPricingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/logs"
          element={
            <ProtectedRoute allow={["admin"]}>
              <AdminLogsPage />
            </ProtectedRoute>
          }
        />
      </Routes>

      <BottomNav />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <PhoneFrame>
          <AppRoutes />
        </PhoneFrame>
      </AppProvider>
    </BrowserRouter>
  );
}

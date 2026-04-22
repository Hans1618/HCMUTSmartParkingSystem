import { createContext, useContext, useState, useCallback } from "react";
import {
  mockUsers,
  parkingZones as mockZones,
  transactionHistory as mockTransactions,
  availableSpots as mockSpots,
  defaultPolicies,
  defaultPrivileges,
  defaultAuditLogs,
  issueVisitorTicket,
  computeVisitorFee,
} from "../data/mockData";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [zones, setZones] = useState(mockZones);
  const [transactions, setTransactions] = useState(mockTransactions);
  const [activeSession, setActiveSession] = useState(null);
  const [balance, setBalance] = useState(0);

  // Visitor flow
  const [visitorTicket, setVisitorTicket] = useState(null);
  const [visitorReceipt, setVisitorReceipt] = useState(null);

  // Admin flow
  const [policies, setPolicies] = useState(defaultPolicies);
  const [privileges, setPrivileges] = useState(defaultPrivileges);
  const [auditLogs, setAuditLogs] = useState(defaultAuditLogs);

  // Login with role selection
  const login = useCallback((role = "student") => {
    const selectedUser = mockUsers[role] || mockUsers.student;
    setUser(selectedUser);
    setBalance(selectedUser.balance);
    setVisitorTicket(null);
    setVisitorReceipt(null);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setActiveSession(null);
    setVisitorTicket(null);
    setVisitorReceipt(null);
  }, []);

  // Check in to a zone
  const checkIn = useCallback(
    (zoneId) => {
      const zone = zones.find((z) => z.id === zoneId);
      if (!zone || !user) return null;

      const spots = mockSpots[zoneId];
      if (!spots || spots.length === 0) return null;

      const assignedSpot = spots[0];

      const session = {
        id: `SES-${Date.now()}`,
        zoneId: zone.id,
        zoneName: `${zone.name} – ${zone.subtitle}`,
        spot: assignedSpot,
        licensePlate: user.licensePlate,
        checkInTime: new Date(),
        rate: zone.rate,
      };

      setActiveSession(session);

      setZones((prev) =>
        prev.map((z) =>
          z.id === zoneId ? { ...z, occupied: z.occupied + 1 } : z
        )
      );

      return session;
    },
    [zones, user]
  );

  // Check out — end session, calculate cost
  const checkOut = useCallback(() => {
    if (!activeSession) return null;

    const now = new Date();
    const durationMs = now - new Date(activeSession.checkInTime);
    const durationMinutes = Math.max(1, Math.ceil(durationMs / 60000));
    const durationHours = durationMinutes / 60;
    const cost = Math.ceil(durationHours * activeSession.rate);

    const completedSession = {
      ...activeSession,
      checkOutTime: now,
      durationMinutes,
      cost,
    };

    const newTransaction = {
      id: `TXN-${Date.now()}`,
      date: now.toISOString().split("T")[0],
      time: now.toTimeString().slice(0, 5),
      zone: activeSession.zoneName,
      duration: `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}m`,
      amount: -cost,
      type: "parking",
      status: "completed",
    };

    setTransactions((prev) => [newTransaction, ...prev]);
    setBalance((prev) => prev - cost);

    setZones((prev) =>
      prev.map((z) =>
        z.id === activeSession.zoneId
          ? { ...z, occupied: Math.max(0, z.occupied - 1) }
          : z
      )
    );

    setActiveSession(null);

    return completedSession;
  }, [activeSession]);

  // ─── Visitor flow actions ───
  const createVisitorTicket = useCallback(
    ({ licensePlate, vehicleType, phone }) => {
      const ticket = issueVisitorTicket({
        licensePlate,
        vehicleType,
        phone,
        zones,
      });
      if (ticket.zoneId) {
        setZones((prev) =>
          prev.map((z) =>
            z.id === ticket.zoneId ? { ...z, occupied: z.occupied + 1 } : z
          )
        );
      }
      setVisitorTicket(ticket);
      return ticket;
    },
    [zones]
  );

  const payVisitorTicket = useCallback(
    ({ method }) => {
      if (!visitorTicket) return null;
      const fee = computeVisitorFee(visitorTicket, new Date());
      const receipt = {
        ticketId: visitorTicket.id,
        licensePlate: visitorTicket.licensePlate,
        vehicleType: visitorTicket.vehicleType,
        zoneName: visitorTicket.zoneName,
        spot: visitorTicket.spot,
        issuedAt: visitorTicket.issuedAt,
        paidAt: new Date(),
        method,
        ...fee,
      };

      if (visitorTicket.zoneId) {
        setZones((prev) =>
          prev.map((z) =>
            z.id === visitorTicket.zoneId
              ? { ...z, occupied: Math.max(0, z.occupied - 1) }
              : z
          )
        );
      }

      setVisitorReceipt(receipt);
      setVisitorTicket(null);
      return receipt;
    },
    [visitorTicket]
  );

  const resetVisitorFlow = useCallback(() => {
    setVisitorTicket(null);
    setVisitorReceipt(null);
  }, []);

  // ─── Admin flow actions ───
  const togglePolicy = useCallback((policyId) => {
    setPolicies((prev) =>
      prev.map((p) =>
        p.id === policyId
          ? {
              ...p,
              enabled: !p.enabled,
              updatedAt: new Date().toISOString().split("T")[0],
            }
          : p
      )
    );
    const toggled = policies.find((p) => p.id === policyId);
    if (toggled) {
      setAuditLogs((prev) => [
        {
          id: `LOG-${Math.floor(Math.random() * 9999) + 2000}`,
          type: "audit",
          actor: "admin@hcmut.edu.vn",
          action: `${toggled.enabled ? "Disabled" : "Enabled"} policy ${toggled.id}`,
          severity: "info",
          timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
        },
        ...prev,
      ]);
    }
  }, [policies]);

  const updateZoneRate = useCallback((zoneId, newRate) => {
    const rate = Math.max(0, Number(newRate) || 0);
    setZones((prev) => prev.map((z) => (z.id === zoneId ? { ...z, rate } : z)));
    setAuditLogs((prev) => [
      {
        id: `LOG-${Math.floor(Math.random() * 9999) + 2000}`,
        type: "audit",
        actor: "admin@hcmut.edu.vn",
        action: `Updated rate of Zone ${zoneId} → ${rate.toLocaleString(
          "vi-VN"
        )}₫/hr`,
        severity: "info",
        timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
      },
      ...prev,
    ]);
  }, []);

  const updatePrivilege = useCallback((role, patch) => {
    setPrivileges((prev) => prev.map((p) => (p.role === role ? { ...p, ...patch } : p)));
    setAuditLogs((prev) => [
      {
        id: `LOG-${Math.floor(Math.random() * 9999) + 2000}`,
        type: "audit",
        actor: "admin@hcmut.edu.vn",
        action: `Updated privileges for role "${role}"`,
        severity: "info",
        timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
      },
      ...prev,
    ]);
  }, []);

  const acknowledgeLog = useCallback((logId) => {
    setAuditLogs((prev) =>
      prev.map((l) => (l.id === logId ? { ...l, acknowledged: true } : l))
    );
  }, []);

  const value = {
    user,
    zones,
    transactions,
    activeSession,
    balance,
    login,
    logout,
    checkIn,
    checkOut,
    // Visitor
    visitorTicket,
    visitorReceipt,
    createVisitorTicket,
    payVisitorTicket,
    resetVisitorFlow,
    // Admin
    policies,
    privileges,
    auditLogs,
    togglePolicy,
    updateZoneRate,
    updatePrivilege,
    acknowledgeLog,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}

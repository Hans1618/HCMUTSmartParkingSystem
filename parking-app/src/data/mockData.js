// ===================================================
// Mock Data — Campus Parking MVP
// All data is hardcoded for demonstration purposes
// ===================================================

// ─── User Accounts (by role) ───
export const mockUsers = {
  student: {
    id: 1,
    name: "Nguyen Van A",
    studentId: "2212345",
    email: "a.nguyen@hcmut.edu.vn",
    role: "student",
    roleLabel: "University Member",
    faculty: "Computer Science & Engineering",
    licensePlate: "59A-12345",
    balance: 150000,
    phone: "0901234567",
    avatar: null,
  },
  visitor: {
    id: 2,
    name: "Tran Thi B",
    studentId: null,
    email: "b.tran@gmail.com",
    role: "visitor",
    roleLabel: "Visitor",
    faculty: null,
    licensePlate: "51G-67890",
    balance: 0,
    phone: "0912345678",
    avatar: null,
  },
  admin: {
    id: 3,
    name: "Le Van C",
    studentId: "ADMIN-001",
    email: "c.le@hcmut.edu.vn",
    role: "admin",
    roleLabel: "Administrator",
    faculty: "Facility Management",
    licensePlate: "59B-11111",
    balance: 0,
    phone: "0923456789",
    avatar: null,
  },
};

// Default user for backwards compatibility
export const currentUser = mockUsers.student;

export const parkingZones = [
  {
    id: "A",
    name: "Zone A",
    subtitle: "Main Campus",
    description: "Near the main lecture halls and administration building",
    total: 120,
    occupied: 45,
    rate: 5000, // VND per hour
    openHours: "06:00 – 22:00",
    type: "motorcycle",
    floors: 1,
  },
  {
    id: "B",
    name: "Zone B",
    subtitle: "Library",
    description: "Adjacent to the central library and study areas",
    total: 80,
    occupied: 78,
    rate: 4000,
    openHours: "06:00 – 23:00",
    type: "motorcycle",
    floors: 1,
  },
  {
    id: "C",
    name: "Zone C",
    subtitle: "Engineering",
    description: "Engineering and laboratory complex parking",
    total: 200,
    occupied: 152,
    rate: 5000,
    openHours: "06:00 – 22:00",
    type: "motorcycle",
    floors: 2,
  },
];

export const transactionHistory = [
  {
    id: "TXN-001",
    date: "2026-04-17",
    time: "08:32",
    zone: "Zone A – Main Campus",
    duration: "2h 15m",
    amount: -11250,
    type: "parking",
    status: "completed",
  },
  {
    id: "TXN-002",
    date: "2026-04-16",
    time: "13:05",
    zone: "Zone B – Library",
    duration: "4h 30m",
    amount: -18000,
    type: "parking",
    status: "completed",
  },
  {
    id: "TXN-003",
    date: "2026-04-15",
    time: "09:00",
    zone: "Zone C – Engineering",
    duration: "6h 00m",
    amount: -18000,
    type: "parking",
    status: "completed",
  },
  {
    id: "TXN-004",
    date: "2026-04-14",
    time: "—",
    zone: "Account Top-up",
    duration: "—",
    amount: 200000,
    type: "topup",
    status: "completed",
  },
  {
    id: "TXN-005",
    date: "2026-04-13",
    time: "07:45",
    zone: "Zone A – Main Campus",
    duration: "3h 10m",
    amount: -15833,
    type: "parking",
    status: "completed",
  },
  {
    id: "TXN-006",
    date: "2026-04-12",
    time: "14:20",
    zone: "Zone B – Library",
    duration: "1h 45m",
    amount: -7000,
    type: "parking",
    status: "completed",
  },
];

// Available spots for check-in simulation
export const availableSpots = {
  A: ["A-012", "A-034", "A-056", "A-078", "A-091", "A-103"],
  B: ["B-079", "B-080"],
  C: ["C-048", "C-102", "C-153", "C-177"],
};

// Helper: get zone status
export function getZoneStatus(zone) {
  const occupancyRate = zone.occupied / zone.total;
  if (occupancyRate >= 1) return "full";
  if (occupancyRate >= 0.9) return "nearly-full";
  return "available";
}

// Helper: format VND currency
export function formatVND(amount) {
  const absAmount = Math.abs(amount);
  return new Intl.NumberFormat("vi-VN").format(absAmount) + "₫";
}

// Helper: format duration from minutes
export function formatDuration(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes}m`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}m`;
}

// ─── Visitor / Temporary Ticket Pricing ───
export const visitorRates = {
  motorcycle: {
    label: "Motorcycle",
    hourly: 8000,
    flatEntry: 3000,
    maxDaily: 30000,
  },
  car: {
    label: "Car",
    hourly: 25000,
    flatEntry: 10000,
    maxDaily: 120000,
  },
  bicycle: {
    label: "Bicycle",
    hourly: 2000,
    flatEntry: 0,
    maxDaily: 5000,
  },
};

// ─── Admin: Policies ───
export const defaultPolicies = [
  {
    id: "POL-001",
    name: "Free 15-minute grace period",
    category: "Pricing",
    description:
      "University members enjoy a 15-minute free window per session before the hourly rate kicks in.",
    scope: ["student", "staff"],
    enabled: true,
    updatedAt: "2026-04-12",
  },
  {
    id: "POL-002",
    name: "Visitor daily cap",
    category: "Pricing",
    description:
      "Visitor tickets are capped at the maximum daily rate, even if the duration exceeds the cap.",
    scope: ["visitor"],
    enabled: true,
    updatedAt: "2026-04-10",
  },
  {
    id: "POL-003",
    name: "Zone B — Library priority",
    category: "Access",
    description:
      "Zone B reserves 20% of spots for faculty and graduate students between 07:00–10:00.",
    scope: ["staff"],
    enabled: true,
    updatedAt: "2026-04-08",
  },
  {
    id: "POL-004",
    name: "After-hours surcharge",
    category: "Pricing",
    description:
      "A 25% surcharge applies for sessions that remain parked after 22:00.",
    scope: ["student", "visitor", "staff"],
    enabled: false,
    updatedAt: "2026-04-03",
  },
  {
    id: "POL-005",
    name: "Blacklist enforcement",
    category: "Security",
    description:
      "License plates flagged in the security blacklist are denied entry automatically at the gate.",
    scope: ["visitor"],
    enabled: true,
    updatedAt: "2026-03-27",
  },
];

// ─── Admin: Role Privileges ───
export const defaultPrivileges = [
  {
    role: "student",
    label: "University Member",
    discount: 0.4,
    monthlyCap: 300000,
    reservedWindow: "06:00 – 22:00",
  },
  {
    role: "staff",
    label: "Faculty / Staff",
    discount: 0.5,
    monthlyCap: 500000,
    reservedWindow: "All day",
  },
  {
    role: "visitor",
    label: "Visitor",
    discount: 0,
    monthlyCap: 0,
    reservedWindow: "06:00 – 22:00",
  },
];

// ─── Admin: Audit / Logs / Alerts ───
export const defaultAuditLogs = [
  {
    id: "LOG-1042",
    type: "audit",
    actor: "admin@hcmut.edu.vn",
    action: "Updated pricing for Zone C",
    severity: "info",
    timestamp: "2026-04-22 09:14",
  },
  {
    id: "LOG-1041",
    type: "alert",
    actor: "Gate A sensor",
    action: "Unrecognised plate detected at Gate A",
    severity: "warning",
    timestamp: "2026-04-22 08:52",
  },
  {
    id: "LOG-1040",
    type: "audit",
    actor: "operator-02@hcmut.edu.vn",
    action: "Enabled policy POL-003",
    severity: "info",
    timestamp: "2026-04-22 08:30",
  },
  {
    id: "LOG-1039",
    type: "alert",
    actor: "Zone B",
    action: "Occupancy crossed 95% threshold",
    severity: "critical",
    timestamp: "2026-04-22 07:58",
  },
  {
    id: "LOG-1038",
    type: "log",
    actor: "system",
    action: "Nightly audit snapshot stored",
    severity: "info",
    timestamp: "2026-04-22 00:00",
  },
  {
    id: "LOG-1037",
    type: "alert",
    actor: "Gate C camera",
    action: "Camera offline for 4 minutes",
    severity: "warning",
    timestamp: "2026-04-21 23:41",
  },
  {
    id: "LOG-1036",
    type: "audit",
    actor: "admin@hcmut.edu.vn",
    action: "Blacklisted plate 51C-99988",
    severity: "info",
    timestamp: "2026-04-21 18:12",
  },
  {
    id: "LOG-1035",
    type: "log",
    actor: "system",
    action: "Backup completed successfully",
    severity: "info",
    timestamp: "2026-04-21 04:00",
  },
];

// Issue a temporary ticket for visitors; assign the zone with the most available spots
export function issueVisitorTicket({ licensePlate, vehicleType, phone, zones }) {
  const rateInfo = visitorRates[vehicleType] || visitorRates.motorcycle;
  const zonePool = (zones || []).filter((z) => z.occupied < z.total);
  const assignedZone = zonePool.sort(
    (a, b) => b.total - b.occupied - (a.total - a.occupied)
  )[0];
  const spotList = assignedZone ? availableSpots[assignedZone.id] || [] : [];
  const spot =
    spotList[Math.floor(Math.random() * Math.max(1, spotList.length))] || "TEMP-01";

  const now = new Date();
  const ticketNumber = `T-${now.getFullYear().toString().slice(-2)}${String(
    now.getMonth() + 1
  ).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}-${Math.floor(
    1000 + Math.random() * 9000
  )}`;

  return {
    id: ticketNumber,
    licensePlate,
    vehicleType,
    phone,
    zoneId: assignedZone?.id,
    zoneName: assignedZone
      ? `${assignedZone.name} – ${assignedZone.subtitle}`
      : "Visitor overflow",
    spot,
    issuedAt: now,
    validUntil: new Date(now.getTime() + 8 * 60 * 60 * 1000),
    rate: rateInfo.hourly,
    entryFee: rateInfo.flatEntry,
    maxDaily: rateInfo.maxDaily,
    status: "active",
  };
}

// Calculate visitor fee (flat entry + hourly, capped at maxDaily)
export function computeVisitorFee(ticket, checkoutDate = new Date()) {
  if (!ticket) return { total: 0, hours: 0, minutes: 0, hourlyComponent: 0, entryFee: 0 };
  const rateInfo = visitorRates[ticket.vehicleType] || visitorRates.motorcycle;
  const issuedAt = new Date(ticket.issuedAt).getTime();
  const durationMs = Math.max(0, checkoutDate.getTime() - issuedAt);
  const durationMinutes = Math.max(1, Math.ceil(durationMs / 60000));
  const durationHours = durationMinutes / 60;
  const hourlyComponent = Math.ceil(durationHours * rateInfo.hourly);
  const gross = rateInfo.flatEntry + hourlyComponent;
  const total = Math.min(gross, rateInfo.maxDaily);
  return {
    total,
    durationMinutes,
    hours: Math.floor(durationMinutes / 60),
    minutes: durationMinutes % 60,
    hourlyComponent,
    entryFee: rateInfo.flatEntry,
    capped: gross >= rateInfo.maxDaily,
    rate: rateInfo.hourly,
  };
}

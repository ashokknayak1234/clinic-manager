import { DEMO_NOW, DEMO_TODAY } from "@/lib/demo-clock";
import type {
  Appointment,
  AppointmentStatus,
  Department,
  Doctor,
  Invoice,
  Prescription,
  TimeSlot,
} from "@/shared/apiTypes";

/**
 * Typed mock adapter.
 *
 * The FastAPI backend only exposes health and auth routes, so every clinical
 * screen reads from this frozen, fictional dataset. Each export carries the
 * endpoint it will eventually call. The values below are the canonical demo
 * dataset (§12.5) — every screen derives from them so counts agree.
 */

// TODO(api): replace with GET /departments
export const departments: Department[] = [
  { department_id: 1, name: "Cardiology", description: "Heart and vascular care", is_active: true },
  { department_id: 2, name: "Dermatology", description: "Skin, hair and nails", is_active: true },
  { department_id: 3, name: "Orthopaedics", description: "Bones, joints and mobility", is_active: true },
  { department_id: 4, name: "Paediatrics", description: "Care for children", is_active: true },
  { department_id: 5, name: "General Medicine", description: "Everyday adult care", is_active: true },
  { department_id: 6, name: "Neurology", description: "Brain and nervous system", is_active: true },
  { department_id: 7, name: "ENT", description: "Ear, nose and throat", is_active: true },
];

// TODO(api): replace with GET /doctors
export const doctors: Doctor[] = [
  {
    doctor_id: 1,
    user_id: 11,
    department_id: 1,
    full_name: "Dr. Aarav Menon",
    specialty: "Cardiology",
    profile_details: "Consultant cardiologist · 12 years of practice",
    consultation_fee: 800,
    is_active: true,
    department_name: "Cardiology",
    next_available: "Today · 10:30 AM",
  },
  {
    doctor_id: 2,
    user_id: 12,
    department_id: 2,
    full_name: "Dr. Leila Haddad",
    specialty: "Dermatology",
    profile_details: "Dermatologist · skin and laser care",
    consultation_fee: 650,
    is_active: true,
    department_name: "Dermatology",
    next_available: "Today · 2:00 PM",
  },
  {
    doctor_id: 3,
    user_id: 13,
    department_id: 3,
    full_name: "Dr. Tomas Reyes",
    specialty: "Orthopaedics",
    profile_details: "Orthopaedic surgeon · joint replacement",
    consultation_fee: 700,
    is_active: false,
    department_name: "Orthopaedics",
    next_available: "Mon 21 Nov · 9:00 AM",
  },
  {
    doctor_id: 4,
    user_id: 14,
    department_id: 4,
    full_name: "Dr. Priya Nair",
    specialty: "Paediatrics",
    profile_details: "Paediatrician · newborn and child health",
    consultation_fee: 600,
    is_active: true,
    department_name: "Paediatrics",
    next_available: "Today · 11:45 AM",
  },
  {
    doctor_id: 5,
    user_id: 15,
    department_id: 5,
    full_name: "Dr. Kenji Sato",
    specialty: "General Medicine",
    profile_details: "General physician · preventive care",
    consultation_fee: 500,
    is_active: true,
    department_name: "General Medicine",
    next_available: "Today · 12:15 PM",
  },
  {
    doctor_id: 6,
    user_id: 16,
    department_id: 6,
    full_name: "Dr. Sofia Almeida",
    specialty: "Neurology",
    profile_details: "Neurologist · headache and movement clinics",
    consultation_fee: 900,
    is_active: true,
    department_name: "Neurology",
    next_available: "Today · 1:10 PM",
  },
  {
    doctor_id: 7,
    user_id: 17,
    department_id: 7,
    full_name: "Dr. Marcus Bell",
    specialty: "ENT",
    profile_details: "ENT specialist · sinus and hearing care",
    consultation_fee: 550,
    is_active: true,
    department_name: "ENT",
    next_available: "Today · 3:30 PM",
  },
];

// TODO(api): replace with GET /doctors/:id
export function getDoctor(doctorId: number): Doctor | undefined {
  return doctors.find((doctor) => doctor.doctor_id === doctorId);
}

// TODO(api): replace with GET /care-team
export const careTeam = doctors.slice(0, 3);

export type DemoAppointment = Appointment & {
  patient_name: string;
  doctor_name: string;
  slot_date: string;
  start_time: string;
  end_time: string;
  department_name: string;
};

function appointment(
  id: number,
  patientName: string,
  doctorId: number,
  time: string,
  endTime: string,
  status: AppointmentStatus,
  date = DEMO_TODAY,
): DemoAppointment {
  const doctor = doctors.find((item) => item.doctor_id === doctorId) ?? doctors[0]!;
  return {
    appointment_id: id,
    patient_id: 100 + id,
    doctor_id: doctorId,
    slot_id: 500 + id,
    status,
    reason: status === "BOOKED" ? "New appointment request" : "Follow-up consultation",
    created_at: `${date}T08:00:00`,
    updated_at: `${date}T08:00:00`,
    patient_name: patientName,
    doctor_name: doctor.full_name,
    specialty: doctor.specialty ?? "General Medicine",
    slot_date: date,
    start_time: time,
    end_time: endTime,
    department_name: doctor.department_name ?? "General Medicine",
  };
}

// TODO(api): replace with GET /appointments
export const appointments: DemoAppointment[] = [
  appointment(1, "Demo Patient", 1, "09:00", "09:20", "COMPLETED"),
  appointment(2, "Asha Verma", 4, "09:20", "09:40", "COMPLETED"),
  appointment(3, "Asha Verma", 2, "09:40", "10:00", "COMPLETED"),
  appointment(4, "Neha Sharma", 5, "10:05", "10:20", "COMPLETED"),
  appointment(5, "Arjun Rao", 6, "10:20", "10:30", "COMPLETED"),
  appointment(6, "Ravi Kumar", 1, "10:30", "10:50", "CONFIRMED"),
  appointment(7, "Meera Iyer", 4, "11:15", "11:35", "CONFIRMED"),
  appointment(8, "Karan Singh", 5, "11:45", "12:05", "CONFIRMED"),
  appointment(9, "Diya Patel", 2, "12:15", "12:35", "CONFIRMED"),
  appointment(10, "Ishaan Gupta", 6, "12:40", "13:00", "BOOKED"),
  appointment(11, "Ananya Bose", 7, "13:10", "13:30", "BOOKED"),
  appointment(12, "Vikram Shah", 1, "14:00", "14:20", "BOOKED"),
  appointment(13, "Ravi Kumar", 1, "09:30", "09:50", "CONFIRMED", "2026-11-13"),
  appointment(14, "Meera Iyer", 2, "10:00", "10:20", "CONFIRMED", "2026-11-14"),
  appointment(15, "Karan Singh", 3, "11:00", "11:20", "CANCELLED", "2026-11-09"),
  appointment(16, "Diya Patel", 4, "12:00", "12:20", "NO_SHOW", "2026-11-06"),
  appointment(17, "Demo Patient", 1, "09:00", "09:20", "CONFIRMED", "2026-11-19"),
];

// TODO(api): replace with GET /appointments?date=today
export const todayAppointments = appointments.filter(
  (item) => item.slot_date === DEMO_TODAY,
);

// TODO(api): replace with GET /dashboard/summary
export const weeklyAppointments = [8, 11, 9, 12, 14, 6, 4] as const;
export const weekLabels = ["M", "T", "W", "T", "F", "S", "S"] as const;

export const appointmentsToday = todayAppointments.length;
export const registeredPatients = 24;
export const activeDoctors = doctors.filter((doctor) => doctor.is_active).length;
export const pendingRequests = appointments.filter(
  (item) => item.status === "BOOKED",
).length;

export function todaysStatusCounts() {
  const counts: Record<AppointmentStatus, number> = {
    BOOKED: 0,
    CONFIRMED: 0,
    COMPLETED: 0,
    CANCELLED: 0,
    NO_SHOW: 0,
  };
  for (const item of todayAppointments) counts[item.status] += 1;
  return counts;
}

export function completionPercent(): number {
  const counts = todaysStatusCounts();
  return Math.round((counts.COMPLETED / appointmentsToday) * 100);
}

// ---------------------------------------------------------------------------
// Owner-directed appointment workflow (2026-11-15):
//   PATIENT requests an appointment  -> row starts as BOOKED (pending)
//   DOCTOR/ADMIN/RECEPTIONIST confirm -> row becomes CONFIRMED
// The demo table lives in module memory, so new rows reset on a full reload.
// TODO(api): replace with POST /appointments
let nextAppointmentId = Math.max(...appointments.map((item) => item.appointment_id)) + 1;

export function requestAppointment(input: {
  doctor_id: number;
  slot: TimeSlot;
}): DemoAppointment {
  const doctor =
    doctors.find((item) => item.doctor_id === input.doctor_id) ?? doctors[0]!;
  const row: DemoAppointment = {
    appointment_id: nextAppointmentId++,
    patient_id: 52,
    doctor_id: input.doctor_id,
    slot_id: input.slot.slot_id,
    status: "BOOKED",
    reason: "New appointment request",
    created_at: `${input.slot.slot_date}T09:05:52`,
    updated_at: `${DEMO_NOW}`,
    patient_name: "Demo Patient",
    doctor_name: doctor.full_name,
    specialty: doctor.specialty ?? "General Medicine",
    slot_date: input.slot.slot_date,
    start_time: input.slot.start_time,
    end_time: input.slot.end_time,
    department_name: doctor.department_name ?? "General Medicine",
  };
  appointments.push(row);
  return row;
}

// TODO(api): replace with PATCH /appointments/:id (status -> CONFIRMED)
export function confirmAppointment(appointmentId: number): DemoAppointment | null {
  const row = appointments.find(
    (item) => item.appointment_id === appointmentId,
  );
  if (!row || row.status !== "BOOKED") return null;
  row.status = "CONFIRMED";
  row.updated_at = `${DEMO_NOW}`;
  return row;
}

// TODO(api): replace with GET /appointments/next
export const nextAppointment: DemoAppointment | null = todayAppointments.find(
  (item) => item.start_time >= "10:30",
) ?? null;

/** 10:30:00 − 09:05:52 is a frozen readout, not a ticking timer. */
export function countdownToNextAppointment(): string {
  const [hours = 0, minutes = 0] = (nextAppointment?.start_time ?? "10:30")
    .split(":")
    .map(Number);
  const target = new Date(DEMO_NOW);
  target.setHours(hours, minutes, 0, 0);
  const totalSeconds = Math.max(
    0,
    Math.floor((target.getTime() - DEMO_NOW.getTime()) / 1000),
  );
  const hh = Math.floor(totalSeconds / 3600);
  const mm = Math.floor((totalSeconds % 3600) / 60);
  const ss = totalSeconds % 60;
  return [hh, mm, ss].map((part) => String(part).padStart(2, "0")).join(":");
}

// TODO(api): replace with GET /prescriptions
export const prescriptions: Prescription[] = [
  {
    prescription_id: 1,
    appointment_id: 1,
    doctor_id: 1,
    notes: "Continue for 30 days. Review after the next visit.",
    created_at: "2026-11-12T09:20:00",
    patient_name: "Demo Patient",
    doctor_name: "Dr. Aarav Menon",
    items: [
      {
        prescription_item_id: 1,
        prescription_id: 1,
        medicine_id: 1,
        dosage: "10 mg",
        frequency: "1× daily",
        duration: "30 days",
        instructions: "Take after dinner",
        medicine_name: "Atorvastatin",
      },
      {
        prescription_item_id: 2,
        prescription_id: 1,
        medicine_id: 2,
        dosage: "75 mg",
        frequency: "1× daily",
        duration: "30 days",
        instructions: "Take with water",
        medicine_name: "Aspirin",
      },
    ],
  },
  {
    prescription_id: 2,
    appointment_id: 4,
    doctor_id: 5,
    notes: "Rest and hydration recommended.",
    created_at: "2026-11-10T10:20:00",
    patient_name: "Demo Patient",
    doctor_name: "Dr. Kenji Sato",
    items: [
      {
        prescription_item_id: 3,
        prescription_id: 2,
        medicine_id: 3,
        dosage: "500 mg",
        frequency: "2× daily",
        duration: "5 days",
        instructions: "After meals",
        medicine_name: "Paracetamol",
      },
    ],
  },
  {
    prescription_id: 3,
    appointment_id: 2,
    doctor_id: 4,
    notes: "Paediatric dose — confirm weight at visit.",
    created_at: "2026-11-08T09:40:00",
    patient_name: "Asha Verma",
    doctor_name: "Dr. Priya Nair",
    items: [
      {
        prescription_item_id: 4,
        prescription_id: 3,
        medicine_id: 4,
        dosage: "5 ml",
        frequency: "3× daily",
        duration: "7 days",
        instructions: "Shake well before use",
        medicine_name: "Amoxicillin syrup",
      },
    ],
  },
];

// TODO(api): replace with GET /invoices
export const invoices: Invoice[] = [
  {
    invoice_id: 1001,
    appointment_id: 1,
    status: "PAID",
    created_at: "2026-11-12T09:20:00",
    updated_at: "2026-11-12T09:25:00",
    total_amount: 1200,
    paid_amount: 1200,
    balance_amount: 0,
    patient_name: "Demo Patient",
    doctor_name: "Dr. Aarav Menon",
    service_name: "Cardiology consultation",
  },
  {
    invoice_id: 1002,
    appointment_id: 6,
    status: "UNPAID",
    created_at: "2026-11-12T10:50:00",
    updated_at: "2026-11-12T10:50:00",
    total_amount: 950,
    paid_amount: 0,
    balance_amount: 950,
    patient_name: "Ravi Kumar",
    doctor_name: "Dr. Aarav Menon",
    service_name: "ECG and consultation",
  },
  {
    invoice_id: 1003,
    appointment_id: 7,
    status: "PARTIAL",
    created_at: "2026-11-11T11:35:00",
    updated_at: "2026-11-11T11:40:00",
    total_amount: 800,
    paid_amount: 400,
    balance_amount: 400,
    patient_name: "Meera Iyer",
    doctor_name: "Dr. Priya Nair",
    service_name: "Paediatric review",
  },
  {
    invoice_id: 1004,
    appointment_id: 8,
    status: "UNPAID",
    created_at: "2026-11-12T12:05:00",
    updated_at: "2026-11-12T12:05:00",
    total_amount: 1100,
    paid_amount: 0,
    balance_amount: 1100,
    patient_name: "Karan Singh",
    doctor_name: "Dr. Kenji Sato",
    service_name: "General consultation",
  },
  {
    invoice_id: 1005,
    appointment_id: 2,
    status: "PAID",
    created_at: "2026-11-08T09:40:00",
    updated_at: "2026-11-08T09:45:00",
    total_amount: 500,
    paid_amount: 500,
    balance_amount: 0,
    patient_name: "Asha Verma",
    doctor_name: "Dr. Priya Nair",
    service_name: "Vaccination review",
  },
  {
    invoice_id: 1006,
    appointment_id: 10,
    status: "PARTIAL",
    created_at: "2026-11-05T13:00:00",
    updated_at: "2026-11-05T13:10:00",
    total_amount: 300,
    paid_amount: 200,
    balance_amount: 100,
    patient_name: "Ishaan Gupta",
    doctor_name: "Dr. Sofia Almeida",
    service_name: "Neurology follow-up",
  },
];

export const invoiceSummary = invoices.reduce(
  (summary, invoice) => {
    if (invoice.status === "VOID") return summary;
    summary.billed += invoice.total_amount;
    summary.paid += invoice.paid_amount;
    summary.outstanding += invoice.balance_amount;
    return summary;
  },
  { billed: 0, paid: 0, outstanding: 0 },
);

// TODO(api): replace with GET /doctors/:id/slots?date=
export function getSlots(doctorId: number): TimeSlot[] {
  const dates = ["2026-11-13", "2026-11-14", "2026-11-17", "2026-11-18", "2026-11-19"];
  const times = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30"];
  let id = 1;
  return dates.flatMap((date, dateIndex) =>
    times.map((start, timeIndex) => {
      const [hour = "09", minute = "00"] = start.split(":");
      const endHour =
        minute === "30" ? String(Number(hour) + 1).padStart(2, "0") : hour;
      const endMinute = minute === "30" ? "00" : "30";
      return {
        slot_id: id++,
        doctor_id: doctorId,
        slot_date: date,
        start_time: start,
        end_time: `${endHour}:${endMinute}`,
        is_available: (dateIndex + timeIndex) % 5 !== 0,
      };
    }),
  );
}

// TODO(api): replace with GET /staff/queue
export const staffQueue = [
  {
    id: 1,
    title: "Appointment requests",
    detail: "3 new requests waiting for review",
    count: 3,
    tone: "warning" as const,
  },
  {
    id: 2,
    title: "Unpaid invoices",
    detail: "₹2,550 outstanding across 4 invoices",
    count: 4,
    tone: "error" as const,
  },
  {
    id: 3,
    title: "Prescriptions to sign",
    detail: "2 draft prescriptions from today",
    count: 2,
    tone: "info" as const,
  },
];

// TODO(api): replace with GET /patients/directory
export const patientDirectory = [
  { patient_id: 101, name: "Demo Patient", last_visit: "Today", status: "Active" },
  { patient_id: 102, name: "Asha Verma", last_visit: "Today", status: "Active" },
  { patient_id: 103, name: "Ravi Kumar", last_visit: "Today", status: "Active" },
  { patient_id: 104, name: "Meera Iyer", last_visit: "11 Nov 2026", status: "Active" },
  { patient_id: 105, name: "Ishaan Gupta", last_visit: "05 Nov 2026", status: "Follow-up" },
];

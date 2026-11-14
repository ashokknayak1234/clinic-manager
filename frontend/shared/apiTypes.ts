export type Role = "ADMIN" | "DOCTOR" | "RECEPTIONIST" | "PATIENT";

export type AppointmentStatus =
  | "BOOKED"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED"
  | "NO_SHOW";

export type InvoiceStatus = "UNPAID" | "PARTIAL" | "PAID" | "VOID";

export type PaymentMethod = "CASH" | "CARD" | "UPI" | "OTHER";

export interface User {
  user_id: number;
  email: string;
  role: Role;
  is_active: boolean;
}

export interface Patient {
  patient_id: number;
  user_id: number;
  full_name: string;
  date_of_birth: string | null;
  phone: string | null;
  address: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  blood_group: string | null;
}

export interface Doctor {
  doctor_id: number;
  user_id: number;
  department_id: number;
  full_name: string;
  specialty: string | null;
  profile_details: string | null;
  consultation_fee: number;
  is_active: boolean;
  department_name?: string;
  next_available?: string;
}

export interface Department {
  department_id: number;
  name: string;
  description: string | null;
  is_active: boolean;
}

export interface TimeSlot {
  slot_id: number;
  doctor_id: number;
  slot_date: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  doctor_name?: string;
  department_name?: string;
}

export interface Appointment {
  appointment_id: number;
  patient_id: number;
  doctor_id: number;
  slot_id: number;
  status: AppointmentStatus;
  reason: string | null;
  created_at: string;
  updated_at: string;
  patient_name?: string;
  doctor_name?: string;
  specialty?: string;
  slot_date?: string;
  start_time?: string;
  end_time?: string;
  department_name?: string;
}

export interface Medicine {
  medicine_id: number;
  name: string;
  description: string | null;
  is_active: boolean;
}

export interface Prescription {
  prescription_id: number;
  appointment_id: number;
  doctor_id: number;
  notes: string | null;
  created_at: string;
  patient_name?: string;
  doctor_name?: string;
  items?: PrescriptionItem[];
}

export interface PrescriptionItem {
  prescription_item_id: number;
  prescription_id: number;
  medicine_id: number;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string | null;
  medicine_name?: string;
}

export interface Invoice {
  invoice_id: number;
  appointment_id: number;
  status: InvoiceStatus;
  created_at: string;
  updated_at: string;
  total_amount: number;
  paid_amount: number;
  balance_amount: number;
  patient_name?: string;
  doctor_name?: string;
  service_name?: string;
}

export interface InvoiceItem {
  invoice_item_id: number;
  invoice_id: number;
  description: string;
  quantity: number;
  unit_price: number;
  line_total: number;
}

export interface Payment {
  payment_id: number;
  invoice_id: number;
  amount: number;
  method: PaymentMethod;
  reference_note: string | null;
  received_by_user_id: number | null;
  paid_at: string;
}

export interface AuditLog {
  audit_id: number;
  actor_user_id: number | null;
  entity_name: string;
  entity_id: number;
  action_name: "INSERT" | "UPDATE" | "DELETE";
  old_values: Record<string, unknown> | null;
  new_values: Record<string, unknown> | null;
  occurred_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: { message: string } | null;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  date_of_birth?: string;
  phone?: string;
  address?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  blood_group?: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface HealthStatus {
  status: string;
}

export interface DatabaseHealth {
  status: string;
  version: string;
  database_name: string;
}

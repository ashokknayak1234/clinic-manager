export interface User {
  user_id: string;
  email: string;
  role: 'ADMIN' | 'DOCTOR' | 'RECEPTIONIST' | 'PATIENT';
  is_active: boolean;
}

export interface Patient {
  patient_id: string;
  user_id: string;
  full_name: string;
  date_of_birth: string | null;
  phone: string | null;
  address: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  blood_group: string | null;
}

export interface Doctor {
  doctor_id: string;
  user_id: string;
  department_id: string;
  full_name: string;
  specialty: string | null;
  profile_details: string | null;
  consultation_fee: number;
  is_active: boolean;
  department_name?: string;
}

export interface Department {
  department_id: string;
  name: string;
  description: string | null;
  is_active: boolean;
}

export interface TimeSlot {
  slot_id: string;
  doctor_id: string;
  slot_date: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  doctor_name?: string;
  department_name?: string;
}

export interface Appointment {
  appointment_id: string;
  patient_id: string;
  doctor_id: string;
  slot_id: string;
  status: 'BOOKED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  reason: string | null;
  created_at: string;
  updated_at: string;
  patient_name?: string;
  doctor_name?: string;
  slot_date?: string;
  start_time?: string;
  end_time?: string;
  department_name?: string;
}

export interface Medicine {
  medicine_id: string;
  name: string;
  description: string | null;
  is_active: boolean;
}

export interface Prescription {
  prescription_id: string;
  appointment_id: string;
  doctor_id: string;
  notes: string | null;
  created_at: string;
  items?: PrescriptionItem[];
}

export interface PrescriptionItem {
  prescription_item_id: string;
  prescription_id: string;
  medicine_id: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string | null;
  medicine_name?: string;
}

export interface Invoice {
  invoice_id: string;
  appointment_id: string;
  status: 'UNPAID' | 'PARTIAL' | 'PAID' | 'VOID';
  created_at: string;
  updated_at: string;
  total_amount?: number;
  paid_amount?: number;
  balance_amount?: number;
}

export interface InvoiceItem {
  invoice_item_id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  line_total: number;
}

export interface Payment {
  payment_id: string;
  invoice_id: string;
  amount: number;
  method: 'CASH' | 'CARD' | 'UPI' | 'OTHER';
  reference_note: string | null;
  received_by_user_id: string | null;
  paid_at: string;
}

export interface AuditLog {
  audit_id: string;
  actor_user_id: string | null;
  entity_name: string;
  entity_id: string;
  action_name: 'INSERT' | 'UPDATE' | 'DELETE';
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
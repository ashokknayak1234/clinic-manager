USE openclinic_db;

CREATE OR REPLACE VIEW v_daily_appointment_schedule AS
SELECT ts.slot_date, ts.start_time, ts.end_time, a.appointment_id, a.status,
       d.doctor_id, d.full_name AS doctor_name, dep.name AS department_name,
       p.patient_id, p.full_name AS patient_name
FROM appointments AS a
JOIN time_slots AS ts ON ts.slot_id = a.slot_id
JOIN doctors AS d ON d.doctor_id = a.doctor_id
JOIN departments AS dep ON dep.department_id = d.department_id
JOIN patients AS p ON p.patient_id = a.patient_id
WHERE a.status IN ('BOOKED','CONFIRMED');

CREATE OR REPLACE VIEW v_invoice_balances AS
SELECT i.invoice_id, i.appointment_id, i.status,
       COALESCE(items.total_amount, 0.00) AS total_amount,
       COALESCE(payments.paid_amount, 0.00) AS paid_amount,
       COALESCE(items.total_amount, 0.00) - COALESCE(payments.paid_amount, 0.00) AS balance_amount
FROM invoices AS i
LEFT JOIN (
  SELECT invoice_id, SUM(line_total) AS total_amount
  FROM invoice_items GROUP BY invoice_id
) AS items ON items.invoice_id = i.invoice_id
LEFT JOIN (
  SELECT invoice_id, SUM(amount) AS paid_amount
  FROM payments GROUP BY invoice_id
) AS payments ON payments.invoice_id = i.invoice_id;

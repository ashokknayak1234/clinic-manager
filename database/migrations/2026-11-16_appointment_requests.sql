-- Appointment requests are stored in MySQL instead of the frontend mock.
-- A request is PENDING; only staff confirmation reserves the slot.
USE openclinic_db;

ALTER TABLE appointments
  MODIFY COLUMN status ENUM('PENDING','BOOKED','CONFIRMED','COMPLETED','CANCELLED','NO_SHOW')
  NOT NULL DEFAULT 'PENDING';

-- Existing BOOKED rows were unconfirmed demo requests, so keep their meaning.
UPDATE appointments SET status = 'PENDING' WHERE status = 'BOOKED';

-- Only a confirmed appointment occupies a slot. Pending requests never do.
ALTER TABLE appointments DROP INDEX uq_appointments_active_slot;
ALTER TABLE appointments
  MODIFY COLUMN active_slot_id BIGINT UNSIGNED GENERATED ALWAYS AS (
    CASE WHEN status = 'CONFIRMED' THEN slot_id ELSE NULL END
  ) VIRTUAL;
ALTER TABLE appointments ADD UNIQUE KEY uq_appointments_active_slot (active_slot_id);

-- Demo slots for booking: the seeded slots all ended in early November.
INSERT IGNORE INTO time_slots (doctor_id, slot_date, start_time, end_time, is_available)
SELECT docs.doctor_id,
       DATE_ADD(CURDATE(), INTERVAL nums.n DAY) AS slot_date,
       times.start_time,
       times.end_time,
       1
FROM (
  SELECT 1 AS doctor_id UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5
) AS docs
CROSS JOIN (
  SELECT 0 AS n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3
  UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6
) AS nums
CROSS JOIN (
  SELECT '09:00:00' AS start_time, '10:00:00' AS end_time
  UNION ALL SELECT '10:00:00', '11:00:00'
  UNION ALL SELECT '11:00:00', '12:00:00'
  UNION ALL SELECT '14:00:00', '15:00:00'
  UNION ALL SELECT '15:00:00', '16:00:00'
  UNION ALL SELECT '16:00:00', '17:00:00'
) AS times;

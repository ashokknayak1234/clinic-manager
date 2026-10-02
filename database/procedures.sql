USE openclinic_db;
DELIMITER $$

DROP PROCEDURE IF EXISTS book_appointment$$
CREATE PROCEDURE book_appointment(
  IN p_patient_id BIGINT UNSIGNED,
  IN p_doctor_id BIGINT UNSIGNED,
  IN p_slot_id BIGINT UNSIGNED,
  IN p_reason VARCHAR(500)
)
BEGIN
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    ROLLBACK;
    RESIGNAL;
  END;

  START TRANSACTION;
  INSERT INTO appointments (patient_id, doctor_id, slot_id, status, reason)
  SELECT p_patient_id, p_doctor_id, ts.slot_id, 'BOOKED', p_reason
  FROM time_slots AS ts
  JOIN doctors AS d ON d.doctor_id = ts.doctor_id
  WHERE ts.slot_id = p_slot_id
    AND ts.doctor_id = p_doctor_id
    AND ts.is_available = TRUE
    AND d.is_active = TRUE
    AND ts.slot_date >= CURRENT_DATE();

  IF ROW_COUNT() <> 1 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Requested slot is unavailable';
  END IF;
  COMMIT;
END$$

DELIMITER ;

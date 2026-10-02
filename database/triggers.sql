USE openclinic_db;
DELIMITER $$

DROP TRIGGER IF EXISTS appointments_audit_insert$$
CREATE TRIGGER appointments_audit_insert AFTER INSERT ON appointments
FOR EACH ROW
BEGIN
  INSERT INTO audit_log (actor_user_id, entity_name, entity_id, action_name, new_values)
  VALUES (@openclinic_actor_user_id, 'appointments', NEW.appointment_id, 'INSERT',
          JSON_OBJECT('patient_id', NEW.patient_id, 'doctor_id', NEW.doctor_id,
                      'slot_id', NEW.slot_id, 'status', NEW.status));
END$$

DROP TRIGGER IF EXISTS appointments_audit_update$$
CREATE TRIGGER appointments_audit_update AFTER UPDATE ON appointments
FOR EACH ROW
BEGIN
  INSERT INTO audit_log (actor_user_id, entity_name, entity_id, action_name, old_values, new_values)
  VALUES (@openclinic_actor_user_id, 'appointments', NEW.appointment_id, 'UPDATE',
          JSON_OBJECT('status', OLD.status, 'slot_id', OLD.slot_id),
          JSON_OBJECT('status', NEW.status, 'slot_id', NEW.slot_id));
END$$

DELIMITER ;

-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: openclinic_db
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `appointments`
--

DROP TABLE IF EXISTS `appointments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appointments` (
  `appointment_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `patient_id` bigint unsigned NOT NULL,
  `doctor_id` bigint unsigned NOT NULL,
  `slot_id` bigint unsigned NOT NULL,
  `status` enum('BOOKED','CONFIRMED','COMPLETED','CANCELLED','NO_SHOW') NOT NULL DEFAULT 'BOOKED',
  `reason` varchar(500) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `test_gen` bigint unsigned GENERATED ALWAYS AS ((`patient_id` + 1)) VIRTUAL,
  `active_slot_id` bigint unsigned GENERATED ALWAYS AS ((case when (`status` in (_utf8mb4'BOOKED',_utf8mb4'CONFIRMED')) then `slot_id` else NULL end)) VIRTUAL,
  PRIMARY KEY (`appointment_id`),
  UNIQUE KEY `uq_appointments_active_slot` (`active_slot_id`),
  KEY `fk_appointments_slot` (`slot_id`),
  KEY `ix_appointments_patient_date` (`patient_id`,`created_at`),
  KEY `ix_appointments_doctor_status` (`doctor_id`,`status`,`created_at`),
  CONSTRAINT `fk_appointments_doctor` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`doctor_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_appointments_patient` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`patient_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_appointments_slot` FOREIGN KEY (`slot_id`) REFERENCES `time_slots` (`slot_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointments`
--

LOCK TABLES `appointments` WRITE;
/*!40000 ALTER TABLE `appointments` DISABLE KEYS */;
INSERT INTO `appointments` (`appointment_id`, `patient_id`, `doctor_id`, `slot_id`, `status`, `reason`, `created_at`, `updated_at`) VALUES (1,2,2,1,'CONFIRMED','Test booking','2026-10-02 15:12:32','2026-10-02 15:13:04');
/*!40000 ALTER TABLE `appointments` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `appointments_audit_insert` AFTER INSERT ON `appointments` FOR EACH ROW BEGIN
  INSERT INTO audit_log (actor_user_id, entity_name, entity_id, action_name, new_values)
  VALUES (@openclinic_actor_user_id, 'appointments', NEW.appointment_id, 'INSERT',
          JSON_OBJECT('patient_id', NEW.patient_id, 'doctor_id', NEW.doctor_id,
                      'slot_id', NEW.slot_id, 'status', NEW.status));
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `appointments_audit_update` AFTER UPDATE ON `appointments` FOR EACH ROW BEGIN
  INSERT INTO audit_log (actor_user_id, entity_name, entity_id, action_name, old_values, new_values)
  VALUES (@openclinic_actor_user_id, 'appointments', NEW.appointment_id, 'UPDATE',
          JSON_OBJECT('status', OLD.status, 'slot_id', OLD.slot_id),
          JSON_OBJECT('status', NEW.status, 'slot_id', NEW.slot_id));
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `audit_log`
--

DROP TABLE IF EXISTS `audit_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_log` (
  `audit_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `actor_user_id` bigint unsigned DEFAULT NULL,
  `entity_name` varchar(64) NOT NULL,
  `entity_id` bigint unsigned NOT NULL,
  `action_name` enum('INSERT','UPDATE','DELETE') NOT NULL,
  `old_values` json DEFAULT NULL,
  `new_values` json DEFAULT NULL,
  `occurred_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`audit_id`),
  KEY `ix_audit_entity_time` (`entity_name`,`entity_id`,`occurred_at`),
  KEY `ix_audit_actor_time` (`actor_user_id`,`occurred_at`),
  CONSTRAINT `fk_audit_actor` FOREIGN KEY (`actor_user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_log`
--

LOCK TABLES `audit_log` WRITE;
/*!40000 ALTER TABLE `audit_log` DISABLE KEYS */;
INSERT INTO `audit_log` VALUES (1,NULL,'appointments',1,'INSERT',NULL,'{\"status\": \"BOOKED\", \"slot_id\": 1, \"doctor_id\": 2, \"patient_id\": 2}','2026-10-02 15:12:32'),(2,1,'appointments',1,'UPDATE','{\"status\": \"BOOKED\", \"slot_id\": 1}','{\"status\": \"CONFIRMED\", \"slot_id\": 1}','2026-10-02 15:13:04');
/*!40000 ALTER TABLE `audit_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departments` (
  `department_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`department_id`),
  UNIQUE KEY `uq_departments_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` VALUES (1,'Family Medicine','Fictional demonstration department',1,'2026-10-02 15:09:15','2026-10-02 15:09:15'),(2,'Dermatology','Fictional demonstration department',1,'2026-10-02 15:09:15','2026-10-02 15:09:15'),(3,'Pediatrics','Fictional demonstration department',1,'2026-10-02 15:09:15','2026-10-02 15:09:15');
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctor_availability`
--

DROP TABLE IF EXISTS `doctor_availability`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctor_availability` (
  `availability_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `doctor_id` bigint unsigned NOT NULL,
  `weekday` tinyint unsigned NOT NULL COMMENT 'Monday=0 through Sunday=6',
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `slot_duration_minutes` smallint unsigned NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`availability_id`),
  KEY `ix_availability_doctor_weekday` (`doctor_id`,`weekday`,`is_active`),
  CONSTRAINT `fk_availability_doctor` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`doctor_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `ck_availability_duration` CHECK ((`slot_duration_minutes` between 5 and 240)),
  CONSTRAINT `ck_availability_range` CHECK ((`end_time` > `start_time`)),
  CONSTRAINT `ck_availability_weekday` CHECK ((`weekday` between 0 and 6))
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctor_availability`
--

LOCK TABLES `doctor_availability` WRITE;
/*!40000 ALTER TABLE `doctor_availability` DISABLE KEYS */;
INSERT INTO `doctor_availability` VALUES (7,4,0,'09:00:00','17:00:00',30,1,'2026-10-02 16:18:40'),(8,4,1,'09:00:00','17:00:00',30,1,'2026-10-02 16:18:40'),(9,4,2,'09:00:00','17:00:00',30,1,'2026-10-02 16:18:40'),(10,4,3,'09:00:00','17:00:00',30,1,'2026-10-02 16:18:40'),(11,4,4,'09:00:00','13:00:00',30,1,'2026-10-02 16:18:40');
/*!40000 ALTER TABLE `doctor_availability` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctors`
--

DROP TABLE IF EXISTS `doctors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctors` (
  `doctor_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `department_id` bigint unsigned NOT NULL,
  `full_name` varchar(120) NOT NULL,
  `specialty` varchar(120) DEFAULT NULL,
  `profile_details` text,
  `consultation_fee` decimal(10,2) NOT NULL DEFAULT '0.00',
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`doctor_id`),
  UNIQUE KEY `uq_doctors_user` (`user_id`),
  KEY `ix_doctors_department_active` (`department_id`,`is_active`),
  CONSTRAINT `fk_doctors_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`department_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_doctors_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `ck_doctors_fee` CHECK ((`consultation_fee` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctors`
--

LOCK TABLES `doctors` WRITE;
/*!40000 ALTER TABLE `doctors` DISABLE KEYS */;
INSERT INTO `doctors` VALUES (1,1,1,'Dr. Test',NULL,NULL,100.00,1,'2026-10-02 15:12:18','2026-10-02 15:12:18'),(2,2,1,'Dr. Real',NULL,NULL,150.00,1,'2026-10-02 15:12:32','2026-10-02 15:12:32'),(4,8,1,'Dr. Demo Doctor','Family Medicine','Demo doctor for testing purposes',150.00,1,'2026-10-02 16:18:40','2026-10-02 16:18:40');
/*!40000 ALTER TABLE `doctors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoice_items`
--

DROP TABLE IF EXISTS `invoice_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invoice_items` (
  `invoice_item_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `invoice_id` bigint unsigned NOT NULL,
  `description` varchar(255) NOT NULL,
  `quantity` decimal(10,2) NOT NULL DEFAULT '1.00',
  `unit_price` decimal(10,2) NOT NULL,
  `line_total` decimal(12,2) GENERATED ALWAYS AS ((`quantity` * `unit_price`)) STORED,
  PRIMARY KEY (`invoice_item_id`),
  KEY `ix_invoice_items_invoice` (`invoice_id`),
  CONSTRAINT `fk_invoice_items_invoice` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`invoice_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `ck_invoice_items_price` CHECK ((`unit_price` >= 0)),
  CONSTRAINT `ck_invoice_items_quantity` CHECK ((`quantity` > 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoice_items`
--

LOCK TABLES `invoice_items` WRITE;
/*!40000 ALTER TABLE `invoice_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `invoice_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoices`
--

DROP TABLE IF EXISTS `invoices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invoices` (
  `invoice_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `appointment_id` bigint unsigned NOT NULL,
  `status` enum('UNPAID','PARTIAL','PAID','VOID') NOT NULL DEFAULT 'UNPAID',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`invoice_id`),
  UNIQUE KEY `uq_invoices_appointment` (`appointment_id`),
  CONSTRAINT `fk_invoices_appointment` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`appointment_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoices`
--

LOCK TABLES `invoices` WRITE;
/*!40000 ALTER TABLE `invoices` DISABLE KEYS */;
/*!40000 ALTER TABLE `invoices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medicines`
--

DROP TABLE IF EXISTS `medicines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medicines` (
  `medicine_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(160) NOT NULL,
  `description` varchar(500) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`medicine_id`),
  UNIQUE KEY `uq_medicines_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medicines`
--

LOCK TABLES `medicines` WRITE;
/*!40000 ALTER TABLE `medicines` DISABLE KEYS */;
INSERT INTO `medicines` VALUES (1,'Demo Medicine A','Fictional catalog item for software demonstrations',1),(2,'Demo Medicine B','Fictional catalog item for software demonstrations',1),(3,'Demo Medicine C','Fictional catalog item for software demonstrations',1);
/*!40000 ALTER TABLE `medicines` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patients`
--

DROP TABLE IF EXISTS `patients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patients` (
  `patient_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `full_name` varchar(120) NOT NULL,
  `date_of_birth` date DEFAULT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `emergency_contact_name` varchar(120) DEFAULT NULL,
  `emergency_contact_phone` varchar(30) DEFAULT NULL,
  `blood_group` varchar(3) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`patient_id`),
  UNIQUE KEY `uq_patients_user` (`user_id`),
  KEY `ix_patients_name` (`full_name`),
  KEY `ix_patients_phone` (`phone`),
  CONSTRAINT `fk_patients_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `ck_patients_blood_group` CHECK (((`blood_group` is null) or (`blood_group` in (_utf8mb4'A+',_utf8mb4'A-',_utf8mb4'B+',_utf8mb4'B-',_utf8mb4'AB+',_utf8mb4'AB-',_utf8mb4'O+',_utf8mb4'O-'))))
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patients`
--

LOCK TABLES `patients` WRITE;
/*!40000 ALTER TABLE `patients` DISABLE KEYS */;
INSERT INTO `patients` VALUES (1,1,'Test Patient',NULL,NULL,NULL,NULL,NULL,NULL,'2026-10-02 15:12:18','2026-10-02 15:12:18'),(2,3,'Test Patient',NULL,NULL,NULL,NULL,NULL,NULL,'2026-10-02 15:12:32','2026-10-02 15:12:32'),(4,9,'Demo Patient','1990-01-15','+1-555-0101','123 Main St, Demo City, DC 12345','Emergency Contact','+1-555-0102','O+','2026-10-02 16:18:40','2026-10-02 16:18:40'),(5,10,'New Test Patient','1995-06-15','+1-555-0200','456 Oak Ave, Test City','Emergency Contact','+1-555-0201','A+','2026-10-02 16:32:26','2026-10-02 16:32:26');
/*!40000 ALTER TABLE `patients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `payment_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `invoice_id` bigint unsigned NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `method` enum('CASH','CARD','UPI','OTHER') NOT NULL,
  `reference_note` varchar(255) DEFAULT NULL,
  `received_by_user_id` bigint unsigned DEFAULT NULL,
  `paid_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`payment_id`),
  KEY `fk_payments_receiver` (`received_by_user_id`),
  KEY `ix_payments_invoice_date` (`invoice_id`,`paid_at`),
  CONSTRAINT `fk_payments_invoice` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`invoice_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_payments_receiver` FOREIGN KEY (`received_by_user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `ck_payments_amount` CHECK ((`amount` > 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prescription_items`
--

DROP TABLE IF EXISTS `prescription_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prescription_items` (
  `prescription_item_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `prescription_id` bigint unsigned NOT NULL,
  `medicine_id` bigint unsigned NOT NULL,
  `dosage` varchar(120) NOT NULL,
  `frequency` varchar(120) NOT NULL,
  `duration` varchar(120) NOT NULL,
  `instructions` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`prescription_item_id`),
  KEY `fk_prescription_items_prescription` (`prescription_id`),
  KEY `ix_prescription_items_medicine` (`medicine_id`),
  CONSTRAINT `fk_prescription_items_medicine` FOREIGN KEY (`medicine_id`) REFERENCES `medicines` (`medicine_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_prescription_items_prescription` FOREIGN KEY (`prescription_id`) REFERENCES `prescriptions` (`prescription_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prescription_items`
--

LOCK TABLES `prescription_items` WRITE;
/*!40000 ALTER TABLE `prescription_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `prescription_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prescriptions`
--

DROP TABLE IF EXISTS `prescriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prescriptions` (
  `prescription_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `appointment_id` bigint unsigned NOT NULL,
  `doctor_id` bigint unsigned NOT NULL,
  `notes` varchar(1000) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`prescription_id`),
  KEY `fk_prescriptions_doctor` (`doctor_id`),
  KEY `ix_prescriptions_appointment` (`appointment_id`),
  CONSTRAINT `fk_prescriptions_appointment` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`appointment_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_prescriptions_doctor` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`doctor_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prescriptions`
--

LOCK TABLES `prescriptions` WRITE;
/*!40000 ALTER TABLE `prescriptions` DISABLE KEYS */;
/*!40000 ALTER TABLE `prescriptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `role_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `role_name` varchar(30) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`role_id`),
  UNIQUE KEY `uq_roles_name` (`role_name`),
  CONSTRAINT `ck_roles_name` CHECK ((`role_name` in (_utf8mb4'ADMIN',_utf8mb4'DOCTOR',_utf8mb4'RECEPTIONIST',_utf8mb4'PATIENT')))
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'ADMIN','2026-10-02 15:09:15'),(2,'DOCTOR','2026-10-02 15:09:15'),(3,'RECEPTIONIST','2026-10-02 15:09:15'),(4,'PATIENT','2026-10-02 15:09:15');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `time_slots`
--

DROP TABLE IF EXISTS `time_slots`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `time_slots` (
  `slot_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `doctor_id` bigint unsigned NOT NULL,
  `slot_date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `is_available` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`slot_id`),
  UNIQUE KEY `uq_slots_doctor_datetime` (`doctor_id`,`slot_date`,`start_time`),
  KEY `ix_slots_date_available` (`slot_date`,`is_available`,`doctor_id`),
  CONSTRAINT `fk_slots_doctor` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`doctor_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `ck_slots_time` CHECK ((`end_time` > `start_time`))
) ENGINE=InnoDB AUTO_INCREMENT=201 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `time_slots`
--

LOCK TABLES `time_slots` WRITE;
/*!40000 ALTER TABLE `time_slots` DISABLE KEYS */;
INSERT INTO `time_slots` VALUES (1,2,'2026-10-02','10:00:00','10:30:00',1,'2026-10-02 15:12:32'),(41,4,'2026-10-02','09:00:00','09:30:00',1,'2026-10-02 16:18:40'),(42,4,'2026-10-02','09:30:00','10:00:00',1,'2026-10-02 16:18:40'),(43,4,'2026-10-02','10:00:00','10:30:00',1,'2026-10-02 16:18:40'),(44,4,'2026-10-02','10:30:00','11:00:00',1,'2026-10-02 16:18:40'),(45,4,'2026-10-02','11:00:00','11:30:00',1,'2026-10-02 16:18:40'),(46,4,'2026-10-02','11:30:00','12:00:00',1,'2026-10-02 16:18:40'),(47,4,'2026-10-02','12:00:00','12:30:00',1,'2026-10-02 16:18:40'),(48,4,'2026-10-02','12:30:00','13:00:00',1,'2026-10-02 16:18:40'),(49,4,'2026-10-02','13:00:00','13:30:00',1,'2026-10-02 16:18:40'),(50,4,'2026-10-02','13:30:00','14:00:00',1,'2026-10-02 16:18:40'),(51,4,'2026-10-02','14:00:00','14:30:00',1,'2026-10-02 16:18:40'),(52,4,'2026-10-02','14:30:00','15:00:00',1,'2026-10-02 16:18:40'),(53,4,'2026-10-02','15:00:00','15:30:00',1,'2026-10-02 16:18:40'),(54,4,'2026-10-02','15:30:00','16:00:00',1,'2026-10-02 16:18:40'),(55,4,'2026-10-02','16:00:00','16:30:00',1,'2026-10-02 16:18:40'),(56,4,'2026-10-02','16:30:00','17:00:00',1,'2026-10-02 16:18:40'),(57,4,'2026-10-05','09:00:00','09:30:00',1,'2026-10-02 16:18:40'),(58,4,'2026-10-05','09:30:00','10:00:00',1,'2026-10-02 16:18:40'),(59,4,'2026-10-05','10:00:00','10:30:00',1,'2026-10-02 16:18:40'),(60,4,'2026-10-05','10:30:00','11:00:00',1,'2026-10-02 16:18:40'),(61,4,'2026-10-05','11:00:00','11:30:00',1,'2026-10-02 16:18:40'),(62,4,'2026-10-05','11:30:00','12:00:00',1,'2026-10-02 16:18:40'),(63,4,'2026-10-05','12:00:00','12:30:00',1,'2026-10-02 16:18:40'),(64,4,'2026-10-05','12:30:00','13:00:00',1,'2026-10-02 16:18:40'),(65,4,'2026-10-05','13:00:00','13:30:00',1,'2026-10-02 16:18:40'),(66,4,'2026-10-05','13:30:00','14:00:00',1,'2026-10-02 16:18:40'),(67,4,'2026-10-05','14:00:00','14:30:00',1,'2026-10-02 16:18:40'),(68,4,'2026-10-05','14:30:00','15:00:00',1,'2026-10-02 16:18:40'),(69,4,'2026-10-05','15:00:00','15:30:00',1,'2026-10-02 16:18:40'),(70,4,'2026-10-05','15:30:00','16:00:00',1,'2026-10-02 16:18:40'),(71,4,'2026-10-05','16:00:00','16:30:00',1,'2026-10-02 16:18:40'),(72,4,'2026-10-05','16:30:00','17:00:00',1,'2026-10-02 16:18:40'),(73,4,'2026-10-06','09:00:00','09:30:00',1,'2026-10-02 16:18:40'),(74,4,'2026-10-06','09:30:00','10:00:00',1,'2026-10-02 16:18:40'),(75,4,'2026-10-06','10:00:00','10:30:00',1,'2026-10-02 16:18:40'),(76,4,'2026-10-06','10:30:00','11:00:00',1,'2026-10-02 16:18:40'),(77,4,'2026-10-06','11:00:00','11:30:00',1,'2026-10-02 16:18:40'),(78,4,'2026-10-06','11:30:00','12:00:00',1,'2026-10-02 16:18:40'),(79,4,'2026-10-06','12:00:00','12:30:00',1,'2026-10-02 16:18:40'),(80,4,'2026-10-06','12:30:00','13:00:00',1,'2026-10-02 16:18:40'),(81,4,'2026-10-06','13:00:00','13:30:00',1,'2026-10-02 16:18:40'),(82,4,'2026-10-06','13:30:00','14:00:00',1,'2026-10-02 16:18:40'),(83,4,'2026-10-06','14:00:00','14:30:00',1,'2026-10-02 16:18:40'),(84,4,'2026-10-06','14:30:00','15:00:00',1,'2026-10-02 16:18:40'),(85,4,'2026-10-06','15:00:00','15:30:00',1,'2026-10-02 16:18:40'),(86,4,'2026-10-06','15:30:00','16:00:00',1,'2026-10-02 16:18:40'),(87,4,'2026-10-06','16:00:00','16:30:00',1,'2026-10-02 16:18:40'),(88,4,'2026-10-06','16:30:00','17:00:00',1,'2026-10-02 16:18:40'),(89,4,'2026-10-07','09:00:00','09:30:00',1,'2026-10-02 16:18:40'),(90,4,'2026-10-07','09:30:00','10:00:00',1,'2026-10-02 16:18:40'),(91,4,'2026-10-07','10:00:00','10:30:00',1,'2026-10-02 16:18:40'),(92,4,'2026-10-07','10:30:00','11:00:00',1,'2026-10-02 16:18:40'),(93,4,'2026-10-07','11:00:00','11:30:00',1,'2026-10-02 16:18:40'),(94,4,'2026-10-07','11:30:00','12:00:00',1,'2026-10-02 16:18:40'),(95,4,'2026-10-07','12:00:00','12:30:00',1,'2026-10-02 16:18:40'),(96,4,'2026-10-07','12:30:00','13:00:00',1,'2026-10-02 16:18:40'),(97,4,'2026-10-07','13:00:00','13:30:00',1,'2026-10-02 16:18:40'),(98,4,'2026-10-07','13:30:00','14:00:00',1,'2026-10-02 16:18:40'),(99,4,'2026-10-07','14:00:00','14:30:00',1,'2026-10-02 16:18:40'),(100,4,'2026-10-07','14:30:00','15:00:00',1,'2026-10-02 16:18:40'),(101,4,'2026-10-07','15:00:00','15:30:00',1,'2026-10-02 16:18:40'),(102,4,'2026-10-07','15:30:00','16:00:00',1,'2026-10-02 16:18:40'),(103,4,'2026-10-07','16:00:00','16:30:00',1,'2026-10-02 16:18:40'),(104,4,'2026-10-07','16:30:00','17:00:00',1,'2026-10-02 16:18:40'),(105,4,'2026-10-08','09:00:00','09:30:00',1,'2026-10-02 16:18:40'),(106,4,'2026-10-08','09:30:00','10:00:00',1,'2026-10-02 16:18:40'),(107,4,'2026-10-08','10:00:00','10:30:00',1,'2026-10-02 16:18:40'),(108,4,'2026-10-08','10:30:00','11:00:00',1,'2026-10-02 16:18:40'),(109,4,'2026-10-08','11:00:00','11:30:00',1,'2026-10-02 16:18:40'),(110,4,'2026-10-08','11:30:00','12:00:00',1,'2026-10-02 16:18:40'),(111,4,'2026-10-08','12:00:00','12:30:00',1,'2026-10-02 16:18:40'),(112,4,'2026-10-08','12:30:00','13:00:00',1,'2026-10-02 16:18:40'),(113,4,'2026-10-08','13:00:00','13:30:00',1,'2026-10-02 16:18:40'),(114,4,'2026-10-08','13:30:00','14:00:00',1,'2026-10-02 16:18:40'),(115,4,'2026-10-08','14:00:00','14:30:00',1,'2026-10-02 16:18:40'),(116,4,'2026-10-08','14:30:00','15:00:00',1,'2026-10-02 16:18:40'),(117,4,'2026-10-08','15:00:00','15:30:00',1,'2026-10-02 16:18:40'),(118,4,'2026-10-08','15:30:00','16:00:00',1,'2026-10-02 16:18:40'),(119,4,'2026-10-08','16:00:00','16:30:00',1,'2026-10-02 16:18:40'),(120,4,'2026-10-08','16:30:00','17:00:00',1,'2026-10-02 16:18:40'),(121,4,'2026-10-09','09:00:00','09:30:00',1,'2026-10-02 16:18:40'),(122,4,'2026-10-09','09:30:00','10:00:00',1,'2026-10-02 16:18:40'),(123,4,'2026-10-09','10:00:00','10:30:00',1,'2026-10-02 16:18:40'),(124,4,'2026-10-09','10:30:00','11:00:00',1,'2026-10-02 16:18:40'),(125,4,'2026-10-09','11:00:00','11:30:00',1,'2026-10-02 16:18:40'),(126,4,'2026-10-09','11:30:00','12:00:00',1,'2026-10-02 16:18:40'),(127,4,'2026-10-09','12:00:00','12:30:00',1,'2026-10-02 16:18:40'),(128,4,'2026-10-09','12:30:00','13:00:00',1,'2026-10-02 16:18:40'),(129,4,'2026-10-09','13:00:00','13:30:00',1,'2026-10-02 16:18:40'),(130,4,'2026-10-09','13:30:00','14:00:00',1,'2026-10-02 16:18:40'),(131,4,'2026-10-09','14:00:00','14:30:00',1,'2026-10-02 16:18:40'),(132,4,'2026-10-09','14:30:00','15:00:00',1,'2026-10-02 16:18:40'),(133,4,'2026-10-09','15:00:00','15:30:00',1,'2026-10-02 16:18:40'),(134,4,'2026-10-09','15:30:00','16:00:00',1,'2026-10-02 16:18:40'),(135,4,'2026-10-09','16:00:00','16:30:00',1,'2026-10-02 16:18:40'),(136,4,'2026-10-09','16:30:00','17:00:00',1,'2026-10-02 16:18:40'),(137,4,'2026-10-12','09:00:00','09:30:00',1,'2026-10-02 16:18:40'),(138,4,'2026-10-12','09:30:00','10:00:00',1,'2026-10-02 16:18:40'),(139,4,'2026-10-12','10:00:00','10:30:00',1,'2026-10-02 16:18:40'),(140,4,'2026-10-12','10:30:00','11:00:00',1,'2026-10-02 16:18:40'),(141,4,'2026-10-12','11:00:00','11:30:00',1,'2026-10-02 16:18:40'),(142,4,'2026-10-12','11:30:00','12:00:00',1,'2026-10-02 16:18:40'),(143,4,'2026-10-12','12:00:00','12:30:00',1,'2026-10-02 16:18:40'),(144,4,'2026-10-12','12:30:00','13:00:00',1,'2026-10-02 16:18:40'),(145,4,'2026-10-12','13:00:00','13:30:00',1,'2026-10-02 16:18:40'),(146,4,'2026-10-12','13:30:00','14:00:00',1,'2026-10-02 16:18:40'),(147,4,'2026-10-12','14:00:00','14:30:00',1,'2026-10-02 16:18:40'),(148,4,'2026-10-12','14:30:00','15:00:00',1,'2026-10-02 16:18:40'),(149,4,'2026-10-12','15:00:00','15:30:00',1,'2026-10-02 16:18:40'),(150,4,'2026-10-12','15:30:00','16:00:00',1,'2026-10-02 16:18:40'),(151,4,'2026-10-12','16:00:00','16:30:00',1,'2026-10-02 16:18:40'),(152,4,'2026-10-12','16:30:00','17:00:00',1,'2026-10-02 16:18:40'),(153,4,'2026-10-13','09:00:00','09:30:00',1,'2026-10-02 16:18:40'),(154,4,'2026-10-13','09:30:00','10:00:00',1,'2026-10-02 16:18:40'),(155,4,'2026-10-13','10:00:00','10:30:00',1,'2026-10-02 16:18:40'),(156,4,'2026-10-13','10:30:00','11:00:00',1,'2026-10-02 16:18:40'),(157,4,'2026-10-13','11:00:00','11:30:00',1,'2026-10-02 16:18:40'),(158,4,'2026-10-13','11:30:00','12:00:00',1,'2026-10-02 16:18:40'),(159,4,'2026-10-13','12:00:00','12:30:00',1,'2026-10-02 16:18:40'),(160,4,'2026-10-13','12:30:00','13:00:00',1,'2026-10-02 16:18:40'),(161,4,'2026-10-13','13:00:00','13:30:00',1,'2026-10-02 16:18:40'),(162,4,'2026-10-13','13:30:00','14:00:00',1,'2026-10-02 16:18:40'),(163,4,'2026-10-13','14:00:00','14:30:00',1,'2026-10-02 16:18:40'),(164,4,'2026-10-13','14:30:00','15:00:00',1,'2026-10-02 16:18:40'),(165,4,'2026-10-13','15:00:00','15:30:00',1,'2026-10-02 16:18:40'),(166,4,'2026-10-13','15:30:00','16:00:00',1,'2026-10-02 16:18:40'),(167,4,'2026-10-13','16:00:00','16:30:00',1,'2026-10-02 16:18:40'),(168,4,'2026-10-13','16:30:00','17:00:00',1,'2026-10-02 16:18:40'),(169,4,'2026-10-14','09:00:00','09:30:00',1,'2026-10-02 16:18:40'),(170,4,'2026-10-14','09:30:00','10:00:00',1,'2026-10-02 16:18:40'),(171,4,'2026-10-14','10:00:00','10:30:00',1,'2026-10-02 16:18:40'),(172,4,'2026-10-14','10:30:00','11:00:00',1,'2026-10-02 16:18:40'),(173,4,'2026-10-14','11:00:00','11:30:00',1,'2026-10-02 16:18:40'),(174,4,'2026-10-14','11:30:00','12:00:00',1,'2026-10-02 16:18:40'),(175,4,'2026-10-14','12:00:00','12:30:00',1,'2026-10-02 16:18:40'),(176,4,'2026-10-14','12:30:00','13:00:00',1,'2026-10-02 16:18:40'),(177,4,'2026-10-14','13:00:00','13:30:00',1,'2026-10-02 16:18:40'),(178,4,'2026-10-14','13:30:00','14:00:00',1,'2026-10-02 16:18:40'),(179,4,'2026-10-14','14:00:00','14:30:00',1,'2026-10-02 16:18:40'),(180,4,'2026-10-14','14:30:00','15:00:00',1,'2026-10-02 16:18:40'),(181,4,'2026-10-14','15:00:00','15:30:00',1,'2026-10-02 16:18:40'),(182,4,'2026-10-14','15:30:00','16:00:00',1,'2026-10-02 16:18:40'),(183,4,'2026-10-14','16:00:00','16:30:00',1,'2026-10-02 16:18:40'),(184,4,'2026-10-14','16:30:00','17:00:00',1,'2026-10-02 16:18:40'),(185,4,'2026-10-15','09:00:00','09:30:00',1,'2026-10-02 16:18:40'),(186,4,'2026-10-15','09:30:00','10:00:00',1,'2026-10-02 16:18:40'),(187,4,'2026-10-15','10:00:00','10:30:00',1,'2026-10-02 16:18:40'),(188,4,'2026-10-15','10:30:00','11:00:00',1,'2026-10-02 16:18:40'),(189,4,'2026-10-15','11:00:00','11:30:00',1,'2026-10-02 16:18:40'),(190,4,'2026-10-15','11:30:00','12:00:00',1,'2026-10-02 16:18:40'),(191,4,'2026-10-15','12:00:00','12:30:00',1,'2026-10-02 16:18:40'),(192,4,'2026-10-15','12:30:00','13:00:00',1,'2026-10-02 16:18:40'),(193,4,'2026-10-15','13:00:00','13:30:00',1,'2026-10-02 16:18:40'),(194,4,'2026-10-15','13:30:00','14:00:00',1,'2026-10-02 16:18:40'),(195,4,'2026-10-15','14:00:00','14:30:00',1,'2026-10-02 16:18:40'),(196,4,'2026-10-15','14:30:00','15:00:00',1,'2026-10-02 16:18:40'),(197,4,'2026-10-15','15:00:00','15:30:00',1,'2026-10-02 16:18:40'),(198,4,'2026-10-15','15:30:00','16:00:00',1,'2026-10-02 16:18:40'),(199,4,'2026-10-15','16:00:00','16:30:00',1,'2026-10-02 16:18:40'),(200,4,'2026-10-15','16:30:00','17:00:00',1,'2026-10-02 16:18:40');
/*!40000 ALTER TABLE `time_slots` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `role_id` bigint unsigned NOT NULL,
  `email` varchar(254) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `uq_users_email` (`email`),
  KEY `ix_users_role_active` (`role_id`,`is_active`),
  CONSTRAINT `fk_users_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,4,'test@example.com','hash',1,'2026-10-02 15:12:18','2026-10-02 15:12:18'),(2,2,'doctor@test.com','hash',1,'2026-10-02 15:12:32','2026-10-02 15:12:32'),(3,4,'patient@test.com','hash',1,'2026-10-02 15:12:32','2026-10-02 15:12:32'),(7,1,'admin@demo.com','$2b$12$pQZ4ZvU61hrtaVqmYIDFUO9hLM7Ckgs1nVV43geMUbWIT/svrTVL2',1,'2026-10-02 16:18:40','2026-10-02 16:18:40'),(8,2,'doctor@demo.com','$2b$12$tD7ZSsdhdPCnnC29R/4hne/GxEUvnbHMMBP4bUTE6TXNiXB.fZZ82',1,'2026-10-02 16:18:40','2026-10-02 16:18:40'),(9,4,'patient@demo.com','$2b$12$oIylVZd6qFeTnk90LwcLLuIIGCOMS4fSjsbc17uuUzSCzieBFSHGG',1,'2026-10-02 16:18:40','2026-10-02 16:18:40'),(10,4,'newpatient@demo.com','$2b$12$.fdvyurTZ69YCsP1RJVKyeHFyGt9lF2FTNT6cSspcCUDnUzCG5wp2',1,'2026-10-02 16:32:26','2026-10-02 16:32:26');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `v_daily_appointment_schedule`
--

DROP TABLE IF EXISTS `v_daily_appointment_schedule`;
/*!50001 DROP VIEW IF EXISTS `v_daily_appointment_schedule`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_daily_appointment_schedule` AS SELECT 
 1 AS `slot_date`,
 1 AS `start_time`,
 1 AS `end_time`,
 1 AS `appointment_id`,
 1 AS `status`,
 1 AS `doctor_id`,
 1 AS `doctor_name`,
 1 AS `department_name`,
 1 AS `patient_id`,
 1 AS `patient_name`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `v_invoice_balances`
--

DROP TABLE IF EXISTS `v_invoice_balances`;
/*!50001 DROP VIEW IF EXISTS `v_invoice_balances`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_invoice_balances` AS SELECT 
 1 AS `invoice_id`,
 1 AS `appointment_id`,
 1 AS `status`,
 1 AS `total_amount`,
 1 AS `paid_amount`,
 1 AS `balance_amount`*/;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `v_daily_appointment_schedule`
--

/*!50001 DROP VIEW IF EXISTS `v_daily_appointment_schedule`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_daily_appointment_schedule` AS select `ts`.`slot_date` AS `slot_date`,`ts`.`start_time` AS `start_time`,`ts`.`end_time` AS `end_time`,`a`.`appointment_id` AS `appointment_id`,`a`.`status` AS `status`,`d`.`doctor_id` AS `doctor_id`,`d`.`full_name` AS `doctor_name`,`dep`.`name` AS `department_name`,`p`.`patient_id` AS `patient_id`,`p`.`full_name` AS `patient_name` from ((((`appointments` `a` join `time_slots` `ts` on((`ts`.`slot_id` = `a`.`slot_id`))) join `doctors` `d` on((`d`.`doctor_id` = `a`.`doctor_id`))) join `departments` `dep` on((`dep`.`department_id` = `d`.`department_id`))) join `patients` `p` on((`p`.`patient_id` = `a`.`patient_id`))) where (`a`.`status` in ('BOOKED','CONFIRMED')) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `v_invoice_balances`
--

/*!50001 DROP VIEW IF EXISTS `v_invoice_balances`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_invoice_balances` AS select `i`.`invoice_id` AS `invoice_id`,`i`.`appointment_id` AS `appointment_id`,`i`.`status` AS `status`,coalesce(`items`.`total_amount`,0.00) AS `total_amount`,coalesce(`payments`.`paid_amount`,0.00) AS `paid_amount`,(coalesce(`items`.`total_amount`,0.00) - coalesce(`payments`.`paid_amount`,0.00)) AS `balance_amount` from ((`invoices` `i` left join (select `invoice_items`.`invoice_id` AS `invoice_id`,sum(`invoice_items`.`line_total`) AS `total_amount` from `invoice_items` group by `invoice_items`.`invoice_id`) `items` on((`items`.`invoice_id` = `i`.`invoice_id`))) left join (select `payments`.`invoice_id` AS `invoice_id`,sum(`payments`.`amount`) AS `paid_amount` from `payments` group by `payments`.`invoice_id`) `payments` on((`payments`.`invoice_id` = `i`.`invoice_id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-01 20:52:15

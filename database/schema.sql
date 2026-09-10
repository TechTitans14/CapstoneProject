CREATE DATABASE  IF NOT EXISTS `healthcaredb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `healthcaredb`;
-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: healthcaredb
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admins` (
  `AdminID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Contact` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `PasswordHash` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`AdminID`),
  UNIQUE KEY `IX_Admins_Username` (`Username`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES (1,'System Administrator','0812345678','admin','$2a$11$U5WxxB9Zjy6DOUGCJ9BhTOaqVH.hkJfJTWDmqVxbLlyix1naLLsl2');
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `appointments`
--

DROP TABLE IF EXISTS `appointments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appointments` (
  `AppointmentID` int NOT NULL AUTO_INCREMENT,
  `PatientID` int NOT NULL,
  `DoctorID` int NOT NULL,
  `BookedBy` int NOT NULL,
  `BookedDate` datetime(6) DEFAULT NULL,
  `AppointmentDate` datetime(6) NOT NULL,
  `AppointmentTime` time(6) NOT NULL,
  `Status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'Scheduled',
  `Reason` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`AppointmentID`),
  KEY `IX_Appointments_AppointmentDate` (`AppointmentDate`),
  KEY `IX_Appointments_BookedBy` (`BookedBy`),
  KEY `IX_Appointments_DoctorID` (`DoctorID`),
  KEY `IX_Appointments_PatientID` (`PatientID`),
  KEY `IX_Appointments_Status` (`Status`),
  CONSTRAINT `FK_Appointments_Doctors_DoctorID` FOREIGN KEY (`DoctorID`) REFERENCES `doctors` (`DoctorID`) ON DELETE RESTRICT,
  CONSTRAINT `FK_Appointments_Patients_PatientID` FOREIGN KEY (`PatientID`) REFERENCES `patients` (`PatientID`) ON DELETE RESTRICT,
  CONSTRAINT `FK_Appointments_Receptionists_BookedBy` FOREIGN KEY (`BookedBy`) REFERENCES `receptionists` (`StaffID`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointments`
--

LOCK TABLES `appointments` WRITE;
/*!40000 ALTER TABLE `appointments` DISABLE KEYS */;
INSERT INTO `appointments` VALUES (1,1,1,1,'2026-09-04 00:00:00.000000','2026-09-04 00:00:00.000000','09:00:00.000000','Scheduled','Regular checkup - blood pressure monitoring'),(2,2,1,1,'2026-09-04 00:00:00.000000','2026-09-04 00:00:00.000000','10:00:00.000000','Scheduled','Asthma follow-up consultation'),(3,3,1,1,'2026-09-04 00:00:00.000000','2026-09-04 00:00:00.000000','11:00:00.000000','Scheduled','Diabetes management review'),(4,4,1,1,'2026-09-04 00:00:00.000000','2026-09-04 00:00:00.000000','14:00:00.000000','Scheduled','Post-surgery follow-up'),(5,5,1,1,'2026-09-03 00:00:00.000000','2026-09-03 00:00:00.000000','09:30:00.000000','Completed','Annual physical examination'),(6,6,1,1,'2026-09-03 00:00:00.000000','2026-09-03 00:00:00.000000','10:30:00.000000','Completed','Heart checkup'),(7,1,1,1,'2026-09-04 00:00:00.000000','2026-09-07 00:00:00.000000','09:00:00.000000','Scheduled','Follow-up - blood pressure check'),(8,2,1,1,'2026-09-04 00:00:00.000000','2026-09-24 00:00:00.000000','11:30:00.000000','Rescheduled','Asthma medication review'),(9,3,1,1,'2026-09-04 00:00:00.000000','2026-09-09 00:00:00.000000','11:00:00.000000','Scheduled','Diabetes follow-up'),(10,4,1,1,'2026-09-04 00:00:00.000000','2026-09-09 00:00:00.000000','14:00:00.000000','Cancelled','Surgical wound check'),(11,5,1,1,'2026-09-01 00:00:00.000000','2026-09-03 00:00:00.000000','15:00:00.000000','Cancelled','Patient requested cancellation'),(12,1,1,1,NULL,'2026-09-05 00:00:00.000000','09:00:00.000000','Scheduled','Regular checkup'),(13,2,1,1,NULL,'2026-09-05 00:00:00.000000','10:00:00.000000','Scheduled','Asthma follow-up'),(14,3,1,1,NULL,'2026-09-05 00:00:00.000000','11:00:00.000000','Scheduled','Diabetes review'),(15,10,1,1,'2026-09-08 12:14:17.197950','2026-09-08 00:00:00.000000','09:00:00.000000','Scheduled','Blood works'),(16,14,3,1,'2026-09-08 12:44:01.290067','2026-09-24 00:00:00.000000','14:30:00.000000','Rescheduled','fftfty');
/*!40000 ALTER TABLE `appointments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctors`
--

DROP TABLE IF EXISTS `doctors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctors` (
  `DoctorID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Specialization` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Availability` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'Available',
  `Username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `PasswordHash` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`DoctorID`),
  UNIQUE KEY `IX_Doctors_Username` (`Username`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctors`
--

LOCK TABLES `doctors` WRITE;
/*!40000 ALTER TABLE `doctors` DISABLE KEYS */;
INSERT INTO `doctors` VALUES (1,'Dr. John Smith','Cardiology','Available','drjohn','$2a$11$k5RAJlXn3kblFSOSNU5IT.Z3hdGjk.l6vHsLGfuL70XYJ7rpkL2Gy'),(2,'Dr. Sarah Johnson','Pediatrics','Available','drsarah','$2a$11$dqe9MPAjw5KGJZCJXPZq1e0mleBxbijKTGFEQY6yiuF/445cecnZ6'),(3,'Dr. Michael Brown','Orthopedics','Available','drmichael','$2a$11$szYTtmMiWLaPScnbq4NjB.ubyxj7LOFuY75xGgelUrlEybw3BvXhG');
/*!40000 ALTER TABLE `doctors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `medicalrecords`
--

DROP TABLE IF EXISTS `medicalrecords`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medicalrecords` (
  `RecordID` int NOT NULL AUTO_INCREMENT,
  `PatientID` int NOT NULL,
  `DoctorID` int NOT NULL,
  `appointmentID` int DEFAULT NULL,
  `Diagnosis` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Treatment` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `VisitDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`RecordID`),
  UNIQUE KEY `IX_MedicalRecords_AppointmentID` (`appointmentID`),
  KEY `IX_MedicalRecords_DoctorID` (`DoctorID`),
  KEY `IX_MedicalRecords_PatientID` (`PatientID`),
  CONSTRAINT `FK_MedicalRecords_Appointments_AppointmentID` FOREIGN KEY (`appointmentID`) REFERENCES `appointments` (`AppointmentID`) ON DELETE RESTRICT,
  CONSTRAINT `FK_MedicalRecords_Doctors_DoctorID` FOREIGN KEY (`DoctorID`) REFERENCES `doctors` (`DoctorID`) ON DELETE RESTRICT,
  CONSTRAINT `FK_MedicalRecords_Patients_PatientID` FOREIGN KEY (`PatientID`) REFERENCES `patients` (`PatientID`) ON DELETE RESTRICT
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medicalrecords`
--

LOCK TABLES `medicalrecords` WRITE;
/*!40000 ALTER TABLE `medicalrecords` DISABLE KEYS */;
INSERT INTO `medicalrecords` VALUES (1,1,1,1,'Hypertension','Prescribed medication','2026-09-07 00:00:00.000000'),(6,3,1,3,'bd','bbhj','2026-09-07 18:47:28.807000'),(8,6,1,NULL,'Initial consultation','No treatment needed','2026-09-04 21:02:14.000000'),(9,4,1,NULL,'Initial consultation','No treatment needed','2026-08-12 21:02:14.000000'),(10,2,1,NULL,'Initial consultation','No treatment needed','2026-08-10 21:02:14.000000'),(11,5,1,NULL,'Initial consultation','No treatment needed','2026-09-02 21:02:14.000000'),(15,6,1,NULL,'Follow-up consultation','Prescribed medication','2026-09-07 21:02:14.000000'),(16,4,1,NULL,'Follow-up consultation','Prescribed medication','2026-08-31 21:02:14.000000'),(17,2,1,NULL,'Follow-up consultation','Prescribed medication','2026-08-31 21:02:14.000000'),(19,2,1,2,'eqwe','ewe','2026-09-07 19:15:53.597000'),(20,4,1,4,'fsffrf','ee','2026-09-07 19:16:40.278000');
/*!40000 ALTER TABLE `medicalrecords` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patients`
--

DROP TABLE IF EXISTS `patients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patients` (
  `PatientID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `IDNumber` varchar(13) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Contact` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `MedicalHistory` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `DateRegistered` datetime(6) NOT NULL,
  `Gender` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `DateOfBirth` datetime(6) DEFAULT NULL,
  `Email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`PatientID`),
  UNIQUE KEY `IX_Patients_Email` (`Email`),
  UNIQUE KEY `IX_Patients_IDNumber` (`IDNumber`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patients`
--

LOCK TABLES `patients` WRITE;
/*!40000 ALTER TABLE `patients` DISABLE KEYS */;
INSERT INTO `patients` VALUES (1,'Alice Johnson','9001011234567','0834567890','No known allergies. History of hypertension.','2026-09-04 00:00:00.000000','Female','1990-01-15 00:00:00.000000','alice.johnson@email.com'),(2,'Bob Smith','8902022345678','0845678901','Asthma, seasonal allergies.','2026-09-04 00:00:00.000000','Male','1989-02-20 00:00:00.000000','bob.smith@email.com'),(3,'Carol Davis','9503033456789','0856789012','Diabetes Type 2, controlled with medication.','2026-09-04 00:00:00.000000','Female','1995-03-25 00:00:00.000000','carol.davis@email.com'),(4,'David Wilson','8804044567890','0867890123','Previous surgery: appendectomy (2015).','2026-09-04 00:00:00.000000','Male','1988-04-10 00:00:00.000000','david.wilson@email.com'),(5,'Emma Brown','9205055678901','0878901234','No significant medical history.','2026-09-04 00:00:00.000000','Female','1992-05-05 00:00:00.000000','emma.brown@email.com'),(6,'Frank Miller','8506066789012','0889012345','Heart disease, takes blood thinners.','2026-09-04 00:00:00.000000','Male','1985-06-15 00:00:00.000000','frank.miller@email.com'),(10,'Andile Duze','0323456655555','0755646255','HIstory of family Diabetes and stuff','2026-09-08 11:40:05.609165','Male','2002-06-04 00:00:00.000000','aneleduze502@gmail.com'),(14,'Owami','1564645656256','0215456565','trerterter','2026-09-08 12:43:17.595102','Male','2003-06-17 00:00:00.000000','aneleduze102@gmail.com');
/*!40000 ALTER TABLE `patients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prescriptions`
--

DROP TABLE IF EXISTS `prescriptions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prescriptions` (
  `PrescriptionID` int NOT NULL AUTO_INCREMENT,
  `RecordID` int NOT NULL,
  `Medication` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Dosage` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Duration` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `instructions` varchar(500) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`PrescriptionID`),
  KEY `IX_Prescriptions_RecordID` (`RecordID`),
  CONSTRAINT `FK_Prescriptions_MedicalRecords_RecordID` FOREIGN KEY (`RecordID`) REFERENCES `medicalrecords` (`RecordID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prescriptions`
--

LOCK TABLES `prescriptions` WRITE;
/*!40000 ALTER TABLE `prescriptions` DISABLE KEYS */;
INSERT INTO `prescriptions` VALUES (1,1,'Panado','300mg','7 Days','','2026-09-07 19:12:59'),(2,20,'Panado','300mg','7 Days','','2026-09-07 19:17:02');
/*!40000 ALTER TABLE `prescriptions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `receptionists`
--

DROP TABLE IF EXISTS `receptionists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `receptionists` (
  `StaffID` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Contact` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `PasswordHash` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`StaffID`),
  UNIQUE KEY `IX_Receptionists_Username` (`Username`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `receptionists`
--

LOCK TABLES `receptionists` WRITE;
/*!40000 ALTER TABLE `receptionists` DISABLE KEYS */;
INSERT INTO `receptionists` VALUES (1,'Jane Receptionist','0823456789','receptionist','$2a$11$WYsVuNotp6OoqvADFM0LU.K6U/zuJkYeFTI4HA99toNsYNyaDr7IS');
/*!40000 ALTER TABLE `receptionists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reports`
--

DROP TABLE IF EXISTS `reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reports` (
  `ReportID` int NOT NULL AUTO_INCREMENT,
  `GeneratedBy` int NOT NULL,
  `Type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `GeneratedAt` datetime(6) DEFAULT NULL,
  `Summary` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`ReportID`),
  KEY `IX_Reports_GeneratedBy` (`GeneratedBy`),
  CONSTRAINT `FK_Reports_Admins_GeneratedBy` FOREIGN KEY (`GeneratedBy`) REFERENCES `admins` (`AdminID`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reports`
--

LOCK TABLES `reports` WRITE;
/*!40000 ALTER TABLE `reports` DISABLE KEYS */;
/*!40000 ALTER TABLE `reports` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-10 23:00:59

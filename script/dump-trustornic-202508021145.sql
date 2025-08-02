-- MySQL dump 10.13  Distrib 9.3.0, for macos15.4 (arm64)
--
-- Host: nj-cdb-686m7tin.sql.tencentcdb.com    Database: trustornic
-- ------------------------------------------------------
-- Server version	8.0.30-txsql

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
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '2b213503-6f50-11f0-88b5-6c92bf64c30c:1-19';

--
-- Table structure for table `dex`
--

DROP TABLE IF EXISTS `dex`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dex` (
  `address` varchar(100) NOT NULL,
  `platform` varchar(20) NOT NULL,
  `point` int NOT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dex`
--

LOCK TABLES `dex` WRITE;
/*!40000 ALTER TABLE `dex` DISABLE KEYS */;
/*!40000 ALTER TABLE `dex` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `gamefi`
--

DROP TABLE IF EXISTS `gamefi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `gamefi` (
  `address` varchar(100) DEFAULT NULL,
  `platform` varchar(20) DEFAULT NULL,
  `point` int DEFAULT NULL,
  `id` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `gamefi`
--

LOCK TABLES `gamefi` WRITE;
/*!40000 ALTER TABLE `gamefi` DISABLE KEYS */;
/*!40000 ALTER TABLE `gamefi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lauchpad`
--

DROP TABLE IF EXISTS `lauchpad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lauchpad` (
  `address` varchar(100) DEFAULT NULL,
  `platform` varchar(20) DEFAULT NULL,
  `point` int DEFAULT NULL,
  `id` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lauchpad`
--

LOCK TABLES `lauchpad` WRITE;
/*!40000 ALTER TABLE `lauchpad` DISABLE KEYS */;
/*!40000 ALTER TABLE `lauchpad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lsd`
--

DROP TABLE IF EXISTS `lsd`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lsd` (
  `address` varchar(100) DEFAULT NULL,
  `platform` varchar(20) DEFAULT NULL,
  `point` int DEFAULT NULL,
  `id` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lsd`
--

LOCK TABLES `lsd` WRITE;
/*!40000 ALTER TABLE `lsd` DISABLE KEYS */;
/*!40000 ALTER TABLE `lsd` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nft`
--

DROP TABLE IF EXISTS `nft`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nft` (
  `address` varchar(100) DEFAULT NULL,
  `platform` varchar(20) DEFAULT NULL,
  `point` int DEFAULT NULL,
  `id` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nft`
--

LOCK TABLES `nft` WRITE;
/*!40000 ALTER TABLE `nft` DISABLE KEYS */;
/*!40000 ALTER TABLE `nft` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `socialfi`
--

DROP TABLE IF EXISTS `socialfi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `socialfi` (
  `address` varchar(100) DEFAULT NULL,
  `platform` varchar(20) DEFAULT NULL,
  `point` int DEFAULT NULL,
  `id` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `socialfi`
--

LOCK TABLES `socialfi` WRITE;
/*!40000 ALTER TABLE `socialfi` DISABLE KEYS */;
/*!40000 ALTER TABLE `socialfi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'trustornic'
--

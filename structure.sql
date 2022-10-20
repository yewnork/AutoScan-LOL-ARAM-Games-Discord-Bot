-- --------------------------------------------------------
-- Host:                         localhost
-- Server version:               10.4.21-MariaDB-log - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             11.3.0.6295
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for discord_aram
CREATE DATABASE IF NOT EXISTS `discord_aram` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `discord_aram`;

-- Dumping structure for table discord_aram.discord_summoners
CREATE TABLE IF NOT EXISTS `discord_summoners` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `LOL_summonerName` varchar(50) NOT NULL,
  `LOL_encryptedSummonerId` varchar(50) NOT NULL,
  `monitorYN` tinyint(1) NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `LOL_encryptedSummonerId` (`LOL_encryptedSummonerId`),
  UNIQUE KEY `LOL_summonerName` (`LOL_summonerName`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

-- Dumping structure for table discord_aram.lol_games
CREATE TABLE IF NOT EXISTS `lol_games` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `gameId` bigint(20) NOT NULL DEFAULT 0,
  `gameType` varchar(50) NOT NULL,
  `imageCreatedYN` tinyint(1) NOT NULL DEFAULT 0,
  `summonerName` varchar(50) NOT NULL,
  `imageName` varchar(50) NOT NULL,
  `date` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`ID`) USING BTREE,
  UNIQUE KEY `gameId` (`gameId`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- Data exporting was unselected.

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;

-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 04, 2024 at 02:51 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `jobjett`
--

-- --------------------------------------------------------

--
-- Table structure for table `application`
--

CREATE TABLE `application` (
  `ApplicationID` int(11) NOT NULL,
  `CandidateID` int(11) DEFAULT NULL,
  `CV_ID` int(11) DEFAULT NULL,
  `JobOfferID` int(11) DEFAULT NULL,
  `Description` text DEFAULT NULL,
  `Status` enum('Pending','Accepted','Rejected') DEFAULT NULL,
  `DateApplied` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `candidate`
--

CREATE TABLE `candidate` (
  `CandidateID` int(11) NOT NULL,
  `UserID` int(11) DEFAULT NULL,
  `FirstName` varchar(100) DEFAULT NULL,
  `LastName` varchar(100) DEFAULT NULL,
  `DateOfBirth` date DEFAULT NULL,
  `Phone` varchar(20) DEFAULT NULL,
  `Address` varchar(255) DEFAULT NULL,
  `Country` varchar(100) DEFAULT NULL,
  `State` varchar(100) DEFAULT NULL,
  `CV_ID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `candidate`
--

INSERT INTO `candidate` (`CandidateID`, `UserID`, `FirstName`, `LastName`, `DateOfBirth`, `Phone`, `Address`, `Country`, `State`, `CV_ID`) VALUES
(9, 10, 'mimi', 'mimi', '2004-05-22', '2837482374', 'uaudfijweoif jqwoeij2o3i4j 2o3i4j asdf ', NULL, NULL, NULL),
(16, 29, 'ena', 'ena', '2002-10-30', '26782952', 'kfm wqlkemfwfe ', NULL, NULL, 5);

-- --------------------------------------------------------

--
-- Table structure for table `certification`
--

CREATE TABLE `certification` (
  `CertificationID` int(11) NOT NULL,
  `CandidateID` int(11) NOT NULL,
  `CV_ID` int(11) DEFAULT NULL,
  `Certification` varchar(255) DEFAULT NULL,
  `DateIssued` date DEFAULT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `certification`
--

INSERT INTO `certification` (`CertificationID`, `CandidateID`, `CV_ID`, `Certification`, `DateIssued`, `description`) VALUES
(1, 16, 5, 'oiqwejr oqwejr lkqwmner ', '2024-04-01', 'oqwieher oiwqejr oiqwejr oiwqejr oiwqejr ');

-- --------------------------------------------------------

--
-- Table structure for table `cv`
--

CREATE TABLE `cv` (
  `CV_ID` int(11) NOT NULL,
  `CandidateID` int(11) DEFAULT NULL,
  `Summary` text DEFAULT NULL,
  `Skills` varchar(500) DEFAULT NULL,
  `Searchable` enum('true','false') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cv`
--

INSERT INTO `cv` (`CV_ID`, `CandidateID`, `Summary`, `Skills`, `Searchable`) VALUES
(5, 16, 'adsf kiwjenf jqwenr kqwjenr qwer ijn', 'asdasdf;asdfasdf;adsf;asdf', 'true');

-- --------------------------------------------------------

--
-- Table structure for table `education`
--

CREATE TABLE `education` (
  `EducationID` int(11) NOT NULL,
  `CandidateID` int(11) NOT NULL,
  `CV_ID` int(11) DEFAULT NULL,
  `Level` varchar(100) DEFAULT NULL,
  `FieldOfStudy` varchar(255) DEFAULT NULL,
  `School` varchar(255) DEFAULT NULL,
  `TimePeriod` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `education`
--

INSERT INTO `education` (`EducationID`, `CandidateID`, `CV_ID`, `Level`, `FieldOfStudy`, `School`, `TimePeriod`) VALUES
(1, 16, 5, 'asdlkfjj', 'ejrlqkwen', 'wewrkqwer', '2222-09_Present');

-- --------------------------------------------------------

--
-- Table structure for table `employer`
--

CREATE TABLE `employer` (
  `EmployerID` int(11) NOT NULL,
  `UserID` int(11) DEFAULT NULL,
  `CompanyName` varchar(255) DEFAULT NULL,
  `Industry` varchar(100) DEFAULT NULL,
  `Phone` varchar(20) DEFAULT NULL,
  `Address` varchar(255) DEFAULT NULL,
  `Country` varchar(100) DEFAULT NULL,
  `State` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employer`
--

INSERT INTO `employer` (`EmployerID`, `UserID`, `CompanyName`, `Industry`, `Phone`, `Address`, `Country`, `State`) VALUES
(2, 11, 'mimi', 'mimi', '234234234', 'mimi', NULL, NULL),
(7, 19, 'sarra', 'sarra', '2384782374', '23482734872348', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `joboffer`
--

CREATE TABLE `joboffer` (
  `JobOfferID` int(11) NOT NULL,
  `EmployerID` int(11) DEFAULT NULL,
  `Title` varchar(255) DEFAULT NULL,
  `Description` text DEFAULT NULL,
  `Requirements` text DEFAULT NULL,
  `Salary` decimal(10,2) DEFAULT NULL,
  `Location` varchar(255) DEFAULT NULL,
  `DatePosted` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `offer`
--

CREATE TABLE `offer` (
  `OfferID` int(11) NOT NULL,
  `EmployerID` int(11) DEFAULT NULL,
  `CandidateID` int(11) DEFAULT NULL,
  `JobOfferID` int(11) DEFAULT NULL,
  `Title` varchar(255) DEFAULT NULL,
  `Description` text DEFAULT NULL,
  `Status` enum('Pending','Accepted','Rejected') DEFAULT NULL,
  `DateSent` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `UserID` int(11) NOT NULL,
  `Username` varchar(255) NOT NULL,
  `Email` varchar(255) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `UserType` enum('Candidate','Employer') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`UserID`, `Username`, `Email`, `Password`, `UserType`) VALUES
(10, 'mimi', 'mimi@mail', '$2b$10$RiUlQKcVzM7e3owP9j6Hl.hVkp3L1k5/kC6N8tzrSIhea1OBVKQUC', 'Candidate'),
(11, 'mimi', 'mimi2@mail', '$2b$10$2dCjYqWNxW4X8Q4Zw6cEYeyQqfUeuA/fHiKSWXu/ia/.SYEjwaEqO', 'Employer'),
(19, 'sarra', 'sarra@mail', '$2b$10$PcrbnUgaukT5Q1oy74UmxuovXZWHxISz.DJxMt6lgIlh1fWz3LVDO', 'Employer'),
(20, 'boumba', 'boumba@mail', '$2b$10$uJrh1zahyUC/MENQ4u7KAuFMAWO3PcBPsWzfFRDkXmKCBIcWEknSK', 'Employer'),
(29, 'ena', 'ena@mail', '$2b$10$QnVTi/mpdJ9LKmMh0HU9g.q24IwfqbfAn.B.NRUtSUaS9Z9GH8vIy', 'Candidate');

-- --------------------------------------------------------

--
-- Table structure for table `work_experience`
--

CREATE TABLE `work_experience` (
  `WorkExperienceID` int(11) NOT NULL,
  `CandidateID` int(11) NOT NULL,
  `CV_ID` int(11) DEFAULT NULL,
  `JobTitle` varchar(255) DEFAULT NULL,
  `Company` varchar(255) DEFAULT NULL,
  `TimePeriod` varchar(100) DEFAULT NULL,
  `Description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `work_experience`
--

INSERT INTO `work_experience` (`WorkExperienceID`, `CandidateID`, `CV_ID`, `JobTitle`, `Company`, `TimePeriod`, `Description`) VALUES
(1, 16, 5, 'ads sdaf qwlnker ', 'lqwkermm lqwekrm ', '2222-09_Present', 'qjwiehr iuqwuejr jnkqewr nwqer');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `application`
--
ALTER TABLE `application`
  ADD KEY `application_ibfk_4` (`CandidateID`),
  ADD KEY `application_ibfk_5` (`CV_ID`),
  ADD KEY `application_ibfk_6` (`JobOfferID`);

--
-- Indexes for table `candidate`
--
ALTER TABLE `candidate`
  ADD PRIMARY KEY (`CandidateID`),
  ADD UNIQUE KEY `UserID` (`UserID`),
  ADD KEY `candidate_ibfk_2` (`CV_ID`);

--
-- Indexes for table `certification`
--
ALTER TABLE `certification`
  ADD PRIMARY KEY (`CertificationID`),
  ADD KEY `certifications_ibfk_1` (`CandidateID`),
  ADD KEY `certification_ibfk_2` (`CV_ID`);

--
-- Indexes for table `cv`
--
ALTER TABLE `cv`
  ADD PRIMARY KEY (`CV_ID`),
  ADD KEY `cv_ibfk_1` (`CandidateID`);

--
-- Indexes for table `education`
--
ALTER TABLE `education`
  ADD PRIMARY KEY (`EducationID`),
  ADD KEY `education_ibfk_1` (`CandidateID`),
  ADD KEY `education_ibfk_2` (`CV_ID`);

--
-- Indexes for table `employer`
--
ALTER TABLE `employer`
  ADD PRIMARY KEY (`EmployerID`),
  ADD UNIQUE KEY `UserID` (`UserID`);

--
-- Indexes for table `joboffer`
--
ALTER TABLE `joboffer`
  ADD PRIMARY KEY (`JobOfferID`),
  ADD KEY `EmployerID` (`EmployerID`);

--
-- Indexes for table `offer`
--
ALTER TABLE `offer`
  ADD PRIMARY KEY (`OfferID`),
  ADD KEY `EmployerID` (`EmployerID`),
  ADD KEY `CandidateID` (`CandidateID`),
  ADD KEY `JobOfferID` (`JobOfferID`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`UserID`),
  ADD UNIQUE KEY `Email` (`Email`);

--
-- Indexes for table `work_experience`
--
ALTER TABLE `work_experience`
  ADD PRIMARY KEY (`WorkExperienceID`),
  ADD KEY `work_experience_ibfk_1` (`CandidateID`),
  ADD KEY `work_experience_ibfk_2` (`CV_ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `candidate`
--
ALTER TABLE `candidate`
  MODIFY `CandidateID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `certification`
--
ALTER TABLE `certification`
  MODIFY `CertificationID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `cv`
--
ALTER TABLE `cv`
  MODIFY `CV_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `education`
--
ALTER TABLE `education`
  MODIFY `EducationID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `employer`
--
ALTER TABLE `employer`
  MODIFY `EmployerID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `joboffer`
--
ALTER TABLE `joboffer`
  MODIFY `JobOfferID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `offer`
--
ALTER TABLE `offer`
  MODIFY `OfferID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `UserID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `work_experience`
--
ALTER TABLE `work_experience`
  MODIFY `WorkExperienceID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `application`
--
ALTER TABLE `application`
  ADD CONSTRAINT `application_ibfk_4` FOREIGN KEY (`CandidateID`) REFERENCES `candidate` (`CandidateID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `application_ibfk_5` FOREIGN KEY (`CV_ID`) REFERENCES `cv` (`CV_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `application_ibfk_6` FOREIGN KEY (`JobOfferID`) REFERENCES `joboffer` (`JobOfferID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `candidate`
--
ALTER TABLE `candidate`
  ADD CONSTRAINT `candidate_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `candidate_ibfk_2` FOREIGN KEY (`CV_ID`) REFERENCES `cv` (`CV_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `certification`
--
ALTER TABLE `certification`
  ADD CONSTRAINT `certification_ibfk_1` FOREIGN KEY (`CandidateID`) REFERENCES `candidate` (`CandidateID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `certification_ibfk_2` FOREIGN KEY (`CV_ID`) REFERENCES `cv` (`CV_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `cv`
--
ALTER TABLE `cv`
  ADD CONSTRAINT `cv_ibfk_1` FOREIGN KEY (`CandidateID`) REFERENCES `candidate` (`CandidateID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `education`
--
ALTER TABLE `education`
  ADD CONSTRAINT `education_ibfk_1` FOREIGN KEY (`CandidateID`) REFERENCES `candidate` (`CandidateID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `education_ibfk_2` FOREIGN KEY (`CV_ID`) REFERENCES `cv` (`CV_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `employer`
--
ALTER TABLE `employer`
  ADD CONSTRAINT `employer_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `joboffer`
--
ALTER TABLE `joboffer`
  ADD CONSTRAINT `joboffer_ibfk_1` FOREIGN KEY (`EmployerID`) REFERENCES `employer` (`EmployerID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `offer`
--
ALTER TABLE `offer`
  ADD CONSTRAINT `offer_ibfk_1` FOREIGN KEY (`EmployerID`) REFERENCES `employer` (`EmployerID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `offer_ibfk_2` FOREIGN KEY (`CandidateID`) REFERENCES `candidate` (`CandidateID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `offer_ibfk_3` FOREIGN KEY (`JobOfferID`) REFERENCES `joboffer` (`JobOfferID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `work_experience`
--
ALTER TABLE `work_experience`
  ADD CONSTRAINT `work_experience_ibfk_1` FOREIGN KEY (`CandidateID`) REFERENCES `candidate` (`CandidateID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `work_experience_ibfk_2` FOREIGN KEY (`CV_ID`) REFERENCES `cv` (`CV_ID`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

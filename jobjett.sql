-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 13, 2024 at 05:44 PM
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

--
-- Dumping data for table `application`
--

INSERT INTO `application` (`ApplicationID`, `CandidateID`, `CV_ID`, `JobOfferID`, `Description`, `Status`, `DateApplied`) VALUES
(6, 21, 10, 4, 'qewrkjn qwerkjn qwkejrn qkwerne', 'Pending', '2024-04-07'),
(0, 27, 16, 6, 'Today iam going to represent myself i dont speak english very good but i speak 50 50 i want work with you me very good worker', 'Pending', '2024-04-11');

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
  `State` varchar(100) DEFAULT NULL,
  `Country` varchar(100) DEFAULT NULL,
  `Address` varchar(255) DEFAULT NULL,
  `CV_ID` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `candidate`
--

INSERT INTO `candidate` (`CandidateID`, `UserID`, `FirstName`, `LastName`, `DateOfBirth`, `Phone`, `State`, `Country`, `Address`, `CV_ID`) VALUES
(21, 39, 'can', 'can', '2002-10-30', '234920834', 'Tunis', 'Tunisia', 'qwejkrnqwerqwkerl', 10),
(27, 47, 'Fedi', 'Floppa', '2009-03-22', '50357278', 'Manouba', 'Tunisia', 'Hay el chabab, Douar Hicher', 16),
(29, 49, 'Faten', 'Merteh', '1968-09-25', '96206994', 'Ben Arous', 'Tunisia', 'Residence Soumaya, El mourouj 5', 18);

-- --------------------------------------------------------

--
-- Table structure for table `certification`
--

CREATE TABLE `certification` (
  `CertificationID` int(11) NOT NULL,
  `CandidateID` int(11) NOT NULL,
  `CV_ID` int(11) DEFAULT NULL,
  `certification` varchar(255) DEFAULT NULL,
  `DateIssued` varchar(10) DEFAULT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `certification`
--

INSERT INTO `certification` (`CertificationID`, `CandidateID`, `CV_ID`, `certification`, `DateIssued`, `description`) VALUES
(165, 21, 10, '1234', '2023-01', 'Description for AWS certification'),
(166, 21, 10, '12341234', '2023-03', 'Description for Google certification'),
(174, 27, 16, 'Certifie en l3ou9', '2024-01', 'Jai le 3ou9');

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
(10, 21, 'ahla summary', 'qwer;qwer;qwer;werq', 'true'),
(16, 27, 'Bonjour je suis l3ou9, jarrive a cette blasa pour cherche travaille', 'Dhkey;Dhhort fel team of the year;99 pace;3andk boost fel basss', ''),
(18, 29, ' Passionate and\ndetermined, I invest 100% in everything I\nundertake because I enjoy learning, facing\nchallenges, and pushing myself to excel.\n', '', 'true');

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
(88, 21, 10, 'Bachelor', 'Computer Science', 'University of Science', '2018-10_Present'),
(89, 21, 10, 'Master', 'Data Science', 'University of Technology', '2022-08_Present'),
(98, 27, 16, 'College', 'General', 'Ibn Sina Oued Ellil', '2021-09_Present'),
(99, 29, 18, 'Bac', 'Lettres', 'Lycee Kelibia', '1986-09_Present'),
(100, 29, 18, 'Licence', 'Comptabilite', 'ISC Tunis', '1990-09_1993-05');

-- --------------------------------------------------------

--
-- Table structure for table `employer`
--

CREATE TABLE `employer` (
  `EmployerID` int(11) NOT NULL,
  `UserID` int(11) DEFAULT NULL,
  `FirstName` varchar(100) DEFAULT NULL,
  `LastName` varchar(100) DEFAULT NULL,
  `DateOfBirth` date DEFAULT NULL,
  `CompanyName` varchar(255) DEFAULT NULL,
  `Industry` varchar(100) DEFAULT NULL,
  `NumberOfEmployees` int(11) DEFAULT NULL,
  `Phone` varchar(20) DEFAULT NULL,
  `State` varchar(100) DEFAULT NULL,
  `Country` varchar(100) DEFAULT NULL,
  `Address` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employer`
--

INSERT INTO `employer` (`EmployerID`, `UserID`, `FirstName`, `LastName`, `DateOfBirth`, `CompanyName`, `Industry`, `NumberOfEmployees`, `Phone`, `State`, `Country`, `Address`) VALUES
(11, 35, NULL, NULL, NULL, 'test', 'test', NULL, '324234', 'Tunis', 'Tunisia', 'wqwerwqerpok '),
(13, 46, NULL, NULL, NULL, 'Mazz Company', 'Antitechnologie', NULL, '26782952', 'Tunis', 'Tunisia', 'El Mourouj, Tunis'),
(17, 54, 'mail', 'mail', '2002-12-10', 'qwer', 'technology', 4, '12121212', 'qwer', 'Afghanistan', 'qwer');

-- --------------------------------------------------------

--
-- Table structure for table `joboffer`
--

CREATE TABLE `joboffer` (
  `JobOfferID` int(11) NOT NULL,
  `EmployerID` int(11) DEFAULT NULL,
  `Title` varchar(255) DEFAULT NULL,
  `Description` text DEFAULT NULL,
  `Type` varchar(255) DEFAULT NULL,
  `Salary` varchar(255) DEFAULT NULL,
  `Location` varchar(255) DEFAULT NULL,
  `DatePosted` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `joboffer`
--

INSERT INTO `joboffer` (`JobOfferID`, `EmployerID`, `Title`, `Description`, `Type`, `Salary`, `Location`, `DatePosted`) VALUES
(4, 11, 'qweirj qwelrkj ', 'uh iguvo8v7tlvutyvhgjvkg\n', 'Contract', 'Maximum amount_kugukkj_per week', 'In-person, within a limited area', '2024-04-04'),
(6, 13, 'RH', 'Bonjour je veut un Rh pour ma company', 'Internship', 'Starting amount_1000_per month', 'Fully remote: no on-site work required', '2024-04-11');

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
  `Email` varchar(255) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `UserType` enum('Candidate','Employer') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`UserID`, `Email`, `Password`, `UserType`) VALUES
(35, 'test@mail', '$2b$10$6vEoyVZpMjyRFwTHeE9yzugSzWQDqNw/wc5KJzH3SSfQ79cxUtrba', 'Employer'),
(39, 'can@mail', '$2b$10$dBQhEk8aNGFhdoExgviBP.IQPygCxhFnOlux97kBc33qLyeSPCS7G', 'Candidate'),
(46, 'mazz@mail.com', '$2b$10$2o9m.ZoQqya3.3fSIGMOE.2M7ue8befQ3S7aDTtqIRG2mALKSTDku', 'Employer'),
(47, 'fedifloppa@mail.com', '$2b$10$gl48Tmeana69r1.B49hBRudv9kPsGB754hnsIL8i01jazGv19t10W', 'Candidate'),
(49, 'fatenmerteh@mail.com', '$2b$10$URiIU6ngZJLdMvWmGuGCUuOur2gFdSDD6C3ZFJ2qhWADXD1wkMLKm', 'Candidate'),
(54, 'qwer@mail', '$2b$10$9Ri9wLik5B6hRD2ZL6yvrOGPovvjUENQ7W08nW3xaxuvvlmVXuAim', 'Employer');

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
(69, 21, 10, 'Software Engineer', 'Tech Company X', '2018-10_Present', 'Description for Software Engineer role'),
(77, 27, 16, 'Basssas', 'Dar 5altek houda', '2009-03_2024-01', 'Nboss 3lihom kol lila'),
(78, 29, 18, 'Teacher', 'Public', '1994-09_1995-06', 'Arab and French teacher'),
(79, 29, 18, 'Cabinet d\'expert comptable', 'Rue d\'Autriche', '2024-01_Present', NULL);

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
  MODIFY `CandidateID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `certification`
--
ALTER TABLE `certification`
  MODIFY `CertificationID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=175;

--
-- AUTO_INCREMENT for table `cv`
--
ALTER TABLE `cv`
  MODIFY `CV_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `education`
--
ALTER TABLE `education`
  MODIFY `EducationID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=101;

--
-- AUTO_INCREMENT for table `employer`
--
ALTER TABLE `employer`
  MODIFY `EmployerID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `joboffer`
--
ALTER TABLE `joboffer`
  MODIFY `JobOfferID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `offer`
--
ALTER TABLE `offer`
  MODIFY `OfferID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `UserID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT for table `work_experience`
--
ALTER TABLE `work_experience`
  MODIFY `WorkExperienceID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=80;

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

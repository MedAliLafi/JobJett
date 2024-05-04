-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 04, 2024 at 08:44 PM
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
  `Status` varchar(100) DEFAULT NULL,
  `DateApplied` date DEFAULT NULL,
  `Type` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `application`
--

INSERT INTO `application` (`ApplicationID`, `CandidateID`, `CV_ID`, `JobOfferID`, `Description`, `Status`, `DateApplied`, `Type`) VALUES
(1, 21, 10, 4, 'adsfasdfasdf', 'Interview Cancelled', '2024-04-25', 'Applied'),
(34, 21, 10, 4, 'adsfasdfasdf', 'Interview Cancelled', '2024-04-25', 'Offered');

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
(21, 39, 'canaa', 'cana', '2002-10-30', '234920834', 'Tunis', 'Tunisia', 'qwejkrnqwerqwkerl', 10);

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
(184, 21, 10, 'qwerqwerqwer', '2024-11', 'qwerqwerqwer');

-- --------------------------------------------------------

--
-- Table structure for table `cv`
--

CREATE TABLE `cv` (
  `CV_ID` int(11) NOT NULL,
  `CandidateID` int(11) DEFAULT NULL,
  `Summary` text DEFAULT NULL,
  `Skills` varchar(500) DEFAULT NULL,
  `Searchable` enum('true','false') DEFAULT NULL,
  `SoftSkills` varchar(500) DEFAULT NULL,
  `Domain` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cv`
--

INSERT INTO `cv` (`CV_ID`, `CandidateID`, `Summary`, `Skills`, `Searchable`, `SoftSkills`, `Domain`) VALUES
(10, 21, 'ahla summaryakdsjnf kjjasdnf lkasdfmlkasmdf alskmdflkasmdf laksdmflk samdflk smdflkqwekrj nqwerk lqwlerm qwlekrmqlwekrm qlwekrm lwkerm lwqkerm lkwfmdlkasmdfl askdmfl kqwmer lqwkemr lkwfm alskdmf lasdkmf lwkerm qlwekr mwdfm laskdmfalskdmf qlwekrm qwelr', 'qwer;code;werq;code;asdfjoisadj;code;asdfasdf', 'true', 'asdf;code;asdf;code;sadf;code;asdf', 'Occupational Therapist');

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
(110, 21, 10, 'On-the-Job Training', 'qwer', 'qwer', '2024-10_Present');

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
  `Address` varchar(255) DEFAULT NULL,
  `Logo` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employer`
--

INSERT INTO `employer` (`EmployerID`, `UserID`, `FirstName`, `LastName`, `DateOfBirth`, `CompanyName`, `Industry`, `NumberOfEmployees`, `Phone`, `State`, `Country`, `Address`, `Logo`) VALUES
(11, 35, 'Ahmed', 'Hajjem', '2002-10-30', 'test', 'test', 3, '324234', 'Tunis', 'Tunisia', 'wqwerwqerpok ', '/logos/logo-1714583360075-918751769.png');

-- --------------------------------------------------------

--
-- Table structure for table `interview`
--

CREATE TABLE `interview` (
  `InterviewID` int(11) NOT NULL,
  `ApplicationID` int(11) DEFAULT NULL,
  `JobOfferId` int(11) DEFAULT NULL,
  `CandidateID` int(11) DEFAULT NULL,
  `EmployerID` int(11) DEFAULT NULL,
  `InterviewDateTime` datetime DEFAULT NULL,
  `Message` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `DatePosted` date DEFAULT NULL,
  `Department` varchar(255) DEFAULT NULL,
  `Schedule` varchar(255) DEFAULT NULL,
  `ReqEducation` varchar(255) DEFAULT NULL,
  `ReqExperience` varchar(255) DEFAULT NULL,
  `ReqSkills` text DEFAULT NULL,
  `ReqSoftSkills` text DEFAULT NULL,
  `additionalQuestions` text DEFAULT NULL,
  `Status` varchar(50) DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `joboffer`
--

INSERT INTO `joboffer` (`JobOfferID`, `EmployerID`, `Title`, `Description`, `Type`, `Salary`, `Location`, `DatePosted`, `Department`, `Schedule`, `ReqEducation`, `ReqExperience`, `ReqSkills`, `ReqSoftSkills`, `additionalQuestions`, `Status`) VALUES
(4, 11, 'qweirj qwelrkj ', 'uh iguvo8v7tlvutyvhgjvk\r\ng\r\nd\r\ndf\r\nsdf\r\nsdf\r\nsdf\r\nsdf\r\nsdf\r\nsdf\r\ndsf\r\nsdf\r\nsdf\r\nsdf\r\nsdf\r\nsdf\r\n', 'Temporary', 'Maximum amount_kugukkj_per week', 'In-person, within a limited area', '2024-04-04', 'Administration', '4 hour shift', 'Associate\'s Degree', '3-5 years', 'qwer;qwer;wqer', 'wqerioiwer;wenr weior', NULL, 'Active'),
(38, 11, 'Software Engineer', 'We are seeking a highly skilled software engineer to join our dynamic team.', 'Full-time', 'Competitive salary', 'Remote', '2024-04-18', 'Engineering', 'Full-time', 'Bachelor\'s Degree in Computer Science or related field', '3+ years of experience in software development', 'JavaScript, React, Node.js', 'Strong problem-solving skills, teamwork', NULL, 'Active'),
(39, 11, 'Marketing Specialist', 'Join our marketing team and help us promote our products to a wider audience.', 'Part-time', 'Hourly rate', 'New York City', '2024-04-18', 'Marketing', 'Part-time', 'Bachelor\'s Degree in Marketing or related field', '2+ years of experience in marketing', 'Social media marketing, SEO, Google Analytics', 'Excellent communication skills, creativity', NULL, 'Active'),
(40, 11, 'Customer Service Representative', 'Provide exceptional customer service to our clients and assist them with their inquiries.', 'Full-time', 'Annual salary', 'Los Angeles', '2024-04-18', 'Customer Service', 'Rotating shifts', 'High School Diploma or equivalent', '1-2 years of experience in customer service', 'Communication skills, problem-solving', 'Patience, empathy', NULL, 'Active'),
(41, 11, 'Data Analyst', 'Analyze data and provide insights to drive business decisions.', 'Full-time', 'Competitive salary', 'Remote', '2024-04-18', 'Analytics', 'Full-time', 'Bachelor\'s Degree in Statistics, Mathematics, or related field', '2-3 years of experience in data analysis', 'SQL, Python, Excel', 'Analytical mindset, attention to detail', NULL, 'Active'),
(42, 11, 'Graphic Designer', 'Create visually appealing designs for marketing materials and websites.', 'Part-time', 'Hourly rate', 'Chicago', '2024-04-18', 'Design', 'Part-time', 'Bachelor\'s Degree in Graphic Design or related field', '1-2 years of experience in graphic design', 'Adobe Creative Suite, Photoshop, Illustrator', 'Creativity, attention to detail', NULL, 'Active'),
(43, 11, 'Financial Analyst', 'Analyze financial data and prepare reports to support decision-making processes.', 'Full-time', 'Annual salary', 'San Francisco', '2024-04-18', 'Finance', 'Full-time', 'Bachelor\'s Degree in Finance, Accounting, or related field', '3-5 years of experience in financial analysis', 'Financial modeling, Excel, PowerPoint', 'Analytical skills, attention to detail', NULL, 'Active'),
(44, 11, 'Content Writer', 'Create engaging and informative content for websites, blogs, and social media.', 'Freelance', 'Per project basis', 'Remote', '2024-04-18', 'Content', 'Flexible', 'Bachelor\'s Degree in English, Journalism, or related field', '2+ years of experience in content writing', 'SEO, Copywriting', 'Excellent writing skills, creativity', NULL, 'Active'),
(45, 11, 'Human Resources Manager', 'Manage HR functions including recruitment, employee relations, and performance management.', 'Full-time', 'Competitive salary', 'New York City', '2024-04-18', 'Human Resources', 'Full-time', 'Bachelor\'s Degree in Human Resources Management or related field', '5+ years of experience in HR management', 'Recruitment, Employee Relations', 'Leadership skills, interpersonal skills', NULL, 'Active'),
(46, 11, 'Sales Representative', 'Promote and sell company products or services to potential customers.', 'Commission-based', 'Commission-based', 'Remote', '2024-04-18', 'Sales', 'Flexible', 'High School Diploma or equivalent', '1-2 years of experience in sales', 'Sales techniques, Communication skills', 'Negotiation skills, Persuasion', NULL, 'Active'),
(47, 11, 'Project Manager', 'Plan, execute, and oversee projects to ensure they are completed on time and within budget.', 'Full-time', 'Competitive salary', 'Los Angeles', '2024-04-18', 'Project Management', 'Full-time', 'Bachelor\'s Degree in Project Management or related field', '3-5 years of experience in project management', 'Project management tools, Leadership', 'Organizational skills, Time management', NULL, 'Active'),
(48, 11, 'Software Developer', 'Design, develop, and test software applications to meet business requirements.', 'Full-time', 'Competitive salary', 'Remote', '2024-04-18', 'Engineering', 'Full-time', 'Bachelor\'s Degree in Computer Science or related field', '3+ years of experience in software development', 'Java, Spring Boot, MySQL', 'Problem-solving skills, Teamwork', NULL, 'Active'),
(49, 11, 'Marketing Manager', 'Develop and implement marketing strategies to promote products or services.', 'Full-time', 'Competitive salary', 'San Francisco', '2024-04-18', 'Marketing', 'Full-time', 'Bachelor\'s Degree in Marketing or related field', '5+ years of experience in marketing', 'Digital marketing, Social media', 'Strategic thinking, Leadership', NULL, 'Active'),
(50, 11, 'Customer Support Specialist', 'Assist customers with inquiries, complaints, and issues regarding products or services.', 'Full-time', 'Hourly rate', 'Chicago', '2024-04-18', 'Customer Service', 'Full-time', 'High School Diploma or equivalent', '1-2 years of experience in customer service', 'Communication skills, Problem-solving', 'Patience, Empathy', NULL, 'Active'),
(51, 11, 'Quality Assurance Analyst', 'Test software applications to ensure they meet quality standards and requirements.', 'Full-time', 'Competitive salary', 'Remote', '2024-04-18', 'Quality Assurance', 'Full-time', 'Bachelor\'s Degree in Computer Science or related field', '2-3 years of experience in QA testing', 'Automated testing tools, Bug tracking systems', 'Attention to detail, Analytical skills', NULL, 'Active'),
(52, 11, 'UX/UI Designer', 'Design user interfaces and experiences for digital products and websites.', 'Full-time', 'Competitive salary', 'New York City', '2024-04-18', 'Design', 'Full-time', 'Bachelor\'s Degree in Design or related field', '3-5 years of experience in UX/UI design', 'Sketch, Figma, Adobe XD', 'User-centric design, Problem-solving', NULL, 'Active'),
(53, 11, 'Business Analyst', 'Analyze business processes and requirements to identify opportunities for improvement.', 'Full-time', 'Competitive salary', 'San Francisco', '2024-04-18', 'Business Analysis', 'Full-time', 'Bachelor\'s Degree in Business Administration or related field', '3-5 years of experience in business analysis', 'Business process modeling, Requirements gathering', 'Analytical skills, Communication skills', NULL, 'Active'),
(54, 11, 'Network Engineer', 'Design, implement, and maintain network infrastructure to ensure smooth operations.', 'Full-time', 'Competitive salary', 'Remote', '2024-04-18', 'Engineering', 'Full-time', 'Bachelor\'s Degree in Computer Science or related field', '3+ years of experience in network engineering', 'Cisco, Routing, Switching', 'Problem-solving skills, Attention to detail', NULL, 'Active'),
(55, 11, 'Digital Marketing Specialist', 'Plan and execute digital marketing campaigns to drive online traffic and conversions.', 'Full-time', 'Competitive salary', 'Chicago', '2024-04-18', 'Marketing', 'Full-time', 'Bachelor\'s Degree in Marketing or related field', '2-3 years of experience in digital marketing', 'SEO, SEM, Social media advertising', 'Analytical skills, Creativity', NULL, 'Active'),
(56, 11, 'Operations Manager', 'Oversee day-to-day operations to ensure efficiency and productivity.', 'Full-time', 'Competitive salary', 'Los Angeles', '2024-04-18', 'Operations', 'Full-time', 'Bachelor\'s Degree in Business Administration or related field', '5+ years of experience in operations management', 'Process improvement, Budget management', 'Leadership skills, Problem-solving', NULL, 'Active'),
(57, 11, 'Technical Support Engineer', 'Provide technical assistance and support to customers experiencing software or hardware issues.', 'Full-time', 'Competitive salary', 'Remote', '2024-04-18', 'Technical Support', 'Full-time', 'Bachelor\'s Degree in Computer Science or related field', '2-3 years of experience in technical support', 'Troubleshooting, Customer service', 'Communication skills, Problem-solving', NULL, 'Active'),
(58, 11, 'Accountant', 'Prepare and maintain financial records and reports for the organization.', 'Full-time', 'Competitive salary', 'New York City', '2024-04-18', 'Finance', 'Full-time', 'Bachelor\'s Degree in Accounting or related field', '3-5 years of experience in accounting', 'GAAP, Financial analysis', 'Attention to detail, Analytical skills', NULL, 'Active'),
(59, 11, 'Social Media Manager', 'Manage social media accounts and content to engage audiences and increase brand awareness.', 'Full-time', 'Competitive salary', 'San Francisco', '2024-04-18', 'Marketing', 'Full-time', 'Bachelor\'s Degree in Marketing or related field', '2-3 years of experience in social media management', 'Social media platforms, Content creation', 'Creativity, Communication skills', NULL, 'Active'),
(60, 11, 'IT Support Specialist', 'Provide technical support and troubleshooting for hardware and software issues.', 'Full-time', 'Competitive salary', 'Remote', '2024-04-18', 'Technical Support', 'Full-time', 'Bachelor\'s Degree in Information Technology or related field', '2-3 years of experience in IT support', 'Hardware troubleshooting, Software installation', 'Problem-solving skills, Customer service', NULL, 'Active'),
(61, 11, 'Legal Assistant', 'Assist lawyers and legal professionals with administrative tasks and research.', 'Full-time', 'Competitive salary', 'Chicago', '2024-04-18', 'Legal', 'Full-time', 'Bachelor\'s Degree in Legal Studies or related field', '1-2 years of experience in legal assistance', 'Legal research, Document drafting', 'Attention to detail, Organizational skills', NULL, 'Active'),
(62, 11, 'Web Developer', 'Design and develop websites and web applications to meet client specifications.', 'Full-time', 'Competitive salary', 'Los Angeles', '2024-04-18', 'Engineering', 'Full-time', 'Bachelor\'s Degree in Computer Science or related field', '3+ years of experience in web development', 'HTML, CSS, JavaScript', 'Problem-solving skills, Teamwork', NULL, 'Active'),
(63, 11, 'Customer Success Manager', 'Build and maintain strong relationships with customers to ensure satisfaction and retention.', 'Full-time', 'Competitive salary', 'New York City', '2024-04-18', 'Customer Success', 'Full-time', 'Bachelor\'s Degree in Business Administration or related field', '2-3 years of experience in customer success', 'Account management, Customer service', 'Communication skills, Problem-solving', NULL, 'Active'),
(64, 11, 'Database Administrator', 'Manage and maintain databases to ensure data integrity, security, and availability.', 'Full-time', 'Competitive salary', 'San Francisco', '2024-04-18', 'Database Administration', 'Full-time', 'Bachelor\'s Degree in Computer Science or related field', '3-5 years of experience in database administration', 'SQL, Database management systems', 'Analytical skills, Attention to detail', NULL, 'Active'),
(65, 11, 'Public Relations Specialist', 'Develop and execute public relations campaigns to enhance brand reputation and awareness.', 'Full-time', 'Competitive salary', 'Remote', '2024-04-18', 'Public Relations', 'Full-time', 'Bachelor\'s Degree in Public Relations or related field', '2-3 years of experience in public relations', 'Media relations, Press releases', 'Communication skills, Creativity', NULL, 'Active'),
(66, 11, 'Systems Analyst', 'Analyze business requirements and design information systems to meet organizational needs.', 'Full-time', 'Competitive salary', 'Chicago', '2024-04-18', 'Systems Analysis', 'Full-time', 'Bachelor\'s Degree in Computer Science or related field', '3-5 years of experience in systems analysis', 'System design, Requirements gathering', 'Analytical skills, Problem-solving', NULL, 'Active'),
(67, 11, 'Technical Writer', 'Create technical documentation and user manuals for software products and systems.', 'Full-time', 'Competitive salary', 'Los Angeles', '2024-04-18', 'Technical Writing', 'Full-time', 'Bachelor\'s Degree in Technical Writing or related field', '2-3 years of experience in technical writing', 'Technical writing tools, Documentation standards', 'Writing skills, Attention to detail', NULL, 'Active'),
(68, 11, 'Healthcare Administrator', 'Oversee administrative functions in healthcare facilities to ensure efficient operations.', 'Full-time', 'Competitive salary', 'New York City', '2024-04-18', 'Healthcare Administration', 'Full-time', 'Bachelor\'s Degree in Healthcare Administration or related field', '3-5 years of experience in healthcare administration', 'Healthcare regulations, Budget management', 'Leadership skills, Problem-solving', NULL, 'Active'),
(69, 11, 'UI Designer', 'Design user interfaces for digital products and applications to enhance user experience.', 'Full-time', 'Competitive salary', 'San Francisco', '2024-04-18', 'Design', 'Full-time', 'Bachelor\'s Degree in Design or related field', '3+ years of experience in UI design', 'Sketch, Adobe XD', 'User-centric design, Problem-solving', NULL, 'Active'),
(70, 11, 'ahmed hajjem', 'QWOEJIRIJQW', 'Full-time', 'Start_1000_per week', 'Fully remote: no on-site work required', '2024-04-18', 'Supply Chain/Logistics', '4 hour shift', 'Master\'s Degree or Higher', '3-5 years', 'qwerqwer;qwerqwer', 'asdfkljjn;welerjnjww', NULL, 'Active'),
(71, 11, 'bonjour ', 'bonjour', 'Full-time', '_100-1000_per week', 'In-person, within a limited area', '2024-04-19', 'Public Relations', '4 hour shift', 'Bachelor\'s Degree', '5-10 years', 'qwer;.qewr', 'qwer;qwer', 'qoweirj;qewrqwer', 'Active'),
(73, 11, 'Software Developer', 'opikasjdfoijqwer iouqweroijwqeori jqwr', 'Full-time', 'Range_100-1100_per year', 'Fully remote: no on-site work required', '2024-04-20', 'Legal', '8 hour shift', 'High School Diploma or Equivalent', '1-2 years', 'qweuiyrhuqw]qw;qwer;qwer', 'qweerqwe;rqwe;r', '', 'Active');

-- --------------------------------------------------------

--
-- Table structure for table `notification`
--

CREATE TABLE `notification` (
  `NotificationID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `Message` varchar(255) DEFAULT NULL,
  `DateTime` datetime DEFAULT NULL,
  `Read` tinyint(1) DEFAULT 0,
  `Link` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notification`
--

INSERT INTO `notification` (`NotificationID`, `UserID`, `Message`, `DateTime`, `Read`, `Link`) VALUES
(36, 35, 'Your interview has been cancelled.', '2024-05-04 16:57:05', 1, '/employer/interviews');

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
(35, 'test@mail', '$2b$10$bPXlJI3yyAGwftLkeYClL.eHqQg5hSNyGX1SnsPOGiAfmi13KFc0O', 'Employer'),
(39, 'can@mail', '$2b$10$/XqiS6zpyxuAxvs5QiXOD.y8ezO8BGtMSWcGQ9IxXDaukDb7QSWBS', 'Candidate'),
(57, 'sarra@mail', '$2b$10$5c8.Rh2vhqzMio2z8ygn9epwwnUevAlypJlvFlUjjxuxp.d00Y8uS', 'Candidate');

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
(91, 21, 10, 'qwerqwer', 'qwerqwer', '2024-10_Present', 'qwerqwerqwer');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `application`
--
ALTER TABLE `application`
  ADD PRIMARY KEY (`ApplicationID`),
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
-- Indexes for table `interview`
--
ALTER TABLE `interview`
  ADD PRIMARY KEY (`InterviewID`),
  ADD KEY `application_fk` (`ApplicationID`),
  ADD KEY `candidate_fk` (`CandidateID`),
  ADD KEY `employer_fk` (`EmployerID`),
  ADD KEY `interview_ibfk_1` (`JobOfferId`);

--
-- Indexes for table `joboffer`
--
ALTER TABLE `joboffer`
  ADD PRIMARY KEY (`JobOfferID`),
  ADD KEY `EmployerID` (`EmployerID`);

--
-- Indexes for table `notification`
--
ALTER TABLE `notification`
  ADD PRIMARY KEY (`NotificationID`),
  ADD KEY `UserID` (`UserID`);

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
-- AUTO_INCREMENT for table `application`
--
ALTER TABLE `application`
  MODIFY `ApplicationID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT for table `candidate`
--
ALTER TABLE `candidate`
  MODIFY `CandidateID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `certification`
--
ALTER TABLE `certification`
  MODIFY `CertificationID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=185;

--
-- AUTO_INCREMENT for table `cv`
--
ALTER TABLE `cv`
  MODIFY `CV_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `education`
--
ALTER TABLE `education`
  MODIFY `EducationID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=111;

--
-- AUTO_INCREMENT for table `employer`
--
ALTER TABLE `employer`
  MODIFY `EmployerID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `interview`
--
ALTER TABLE `interview`
  MODIFY `InterviewID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT for table `joboffer`
--
ALTER TABLE `joboffer`
  MODIFY `JobOfferID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=74;

--
-- AUTO_INCREMENT for table `notification`
--
ALTER TABLE `notification`
  MODIFY `NotificationID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `offer`
--
ALTER TABLE `offer`
  MODIFY `OfferID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `UserID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- AUTO_INCREMENT for table `work_experience`
--
ALTER TABLE `work_experience`
  MODIFY `WorkExperienceID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=92;

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
-- Constraints for table `interview`
--
ALTER TABLE `interview`
  ADD CONSTRAINT `application_fk` FOREIGN KEY (`ApplicationID`) REFERENCES `application` (`ApplicationID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `candidate_fk` FOREIGN KEY (`CandidateID`) REFERENCES `candidate` (`CandidateID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `employer_fk` FOREIGN KEY (`EmployerID`) REFERENCES `employer` (`EmployerID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `interview_ibfk_1` FOREIGN KEY (`JobOfferId`) REFERENCES `joboffer` (`JobOfferID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `joboffer`
--
ALTER TABLE `joboffer`
  ADD CONSTRAINT `joboffer_ibfk_1` FOREIGN KEY (`EmployerID`) REFERENCES `employer` (`EmployerID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `notification`
--
ALTER TABLE `notification`
  ADD CONSTRAINT `notification_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `user` (`UserID`) ON DELETE CASCADE ON UPDATE CASCADE;

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

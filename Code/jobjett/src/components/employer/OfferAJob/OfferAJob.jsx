import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../NavBar/EmployerNavbar.jsx";

const OfferAJob = () => {
  const { candidateID } = useParams();
  const navigate = useNavigate();
  const [jobOffers, setJobOffers] = useState([]);
  const [selectedJobOffer, setSelectedJobOffer] = useState("");
  const [note, setNote] = useState("");
  const [interviewDateTime, setInterviewDateTime] = useState("");
  const [showDateTimeInput, setShowDateTimeInput] = useState(false);
  const [message, setMessage] = useState("");
  const [showMessageInput, setShowMessageInput] = useState(false);
  const [showSubmitButton, setShowSubmitButton] = useState(false);
  const [score, setScore] = useState(0);
  const points = {
    jobTitle: 10,
    education: {
      "High School Diploma or Equivalent": 5,
      "Associate's Degree": 10,
      "Bachelor's Degree": 15,
      "Master's Degree or Higher": 20,
      "Vocational Training and Certifications": 10,
      "On-the-Job Training": 5
    },
    experience: {
      "Less than 1 year": 5,
      "1-2 years": 10,
      "3-5 years": 15,
      "5-10 years": 20,
      "More than 10 years": 25
    },
    departmentMatch: 10,
    skills: 7,
    softSkills: 5,
    countryMatch: 10,
    stateMatch: 5
  };

  useEffect(() => {
    const fetchJobOffers = async () => {
      try {
        const joboffersResponse = await fetch("http://localhost:9000/Employer/JobOffer/joboffers", {
          credentials: "include",
        });
        if (joboffersResponse.ok) {
          const data = await joboffersResponse.json();
          setJobOffers(data);
        } else {
          console.error("Failed to fetch job offers");
        }
      } catch (error) {
        console.error("Error fetching job offers:", error);
      }
    };

    fetchJobOffers();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!interviewDateTime) {
      alert('Please select an interview date and time.');
      return;
  }
  if (!message) {
      alert('Please provide a message for the interview.');
      return;
  }
    try {
        const response = await fetch(`http://localhost:9000/Employer/Interview/offer`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            interviewDateTime: interviewDateTime,
            message: message,
            CandidateID: candidateID,
            JobOfferID: selectedJobOffer,
            note: note,
            score: score
          }),
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          const { interviewID } = data;
          console.log("Interview scheduled successfully");
          setShowSubmitButton(true); // Show the submit button after interview setup
          navigate("/employer/interviews");
        } else {
          console.error("Failed to schedule interview");
        }
      } catch (error) {
        console.error("Error scheduling interview:", error);
      }
    };

  const calculateExperienceYears = (workExperiencesData) => {
    let totalExperienceYears = 0;
  
    // Iterate over each work experience
    workExperiencesData.forEach((experience) => {
        // Extract start and end dates from the TimePeriod field
        const [startDate, endDate] = experience.TimePeriod.split("_");
  
        // Calculate the duration of the experience in years
        const startYear = new Date(startDate).getFullYear();
        const endYear = endDate === "Present" ? new Date().getFullYear() : new Date(endDate).getFullYear();
        const experienceYears = endYear - startYear;
  
        // Add the duration to the total experience
        totalExperienceYears += experienceYears;
    });
  
    return totalExperienceYears;
  };
  
  const calculateRequiredExperienceYears = (requiredExperience) => {
    // Extract minimum and maximum years of experience from the requiredExperience field
    const [minYearsStr, maxYearsStr] = requiredExperience.split("-");
    const minYears = parseInt(minYearsStr.replace("More than", "").trim()) || 0;
    const maxYears = parseInt(maxYearsStr.replace("years", "").trim()) || Infinity;
  
    // Calculate the average of minimum and maximum years
    const avgYears = (minYears + maxYears) / 2;
  
    return avgYears;
  };   
  
  const calculateInitialScore = (candidateData, educationData, workExperiencesData, certificatesData, offerData) => {
    let initialScore = 0;
  
    // Calculate the initial score based on job title match
    if (
      candidateData.skills.includes(offerData.Title) ||
      candidateData.summary.includes(offerData.Title) ||
      candidateData.domain.includes(offerData.Title) ||
      workExperiencesData.some((exp) => exp.JobTitle.includes(offerData.Title)) ||
      certificatesData.some((cert) => cert.certification.includes(offerData.Title)) ||
      educationData.some((edu) => edu.FieldOfStudy.includes(offerData.Title))
    ) {
      initialScore += points.jobTitle;
    }
  
    // Calculate the initial score based on education match
    if (
      educationData.some(
        (edu) => edu.Level === offerData.ReqEducation
      )
    ) {
      initialScore += points.education[offerData.ReqEducation];
    }
  
    // Calculate the initial score based on experience match
    const candidateExperienceYears = calculateExperienceYears(workExperiencesData);
    const requiredExperienceYears = calculateRequiredExperienceYears(offerData.ReqExperience);
    if (candidateExperienceYears >= requiredExperienceYears) {
      initialScore += points.experience[offerData.ReqExperience];
    }
  
    // Calculate the initial score based on department match
    if (
      candidateData.skills.includes(offerData.Department) ||
      candidateData.softskills.includes(offerData.Department) ||
      candidateData.domain.includes(offerData.Department) ||
      workExperiencesData.some((exp) => exp.JobTitle.includes(offerData.Department)) ||
      certificatesData.some((cert) => cert.certification.includes(offerData.Department)) ||
      educationData.some((edu) => edu.FieldOfStudy.includes(offerData.Department))
    ) {
      initialScore += points.departmentMatch;
    }
  
    // Calculate the initial score based on skills match
    const offerSkills = offerData.ReqSkills.split(";code;");
    const offerSoftSkills = offerData.ReqSoftSkills.split(";code;");
    for (const skill of offerSkills) {
      if (candidateData.skills.includes(skill) || candidateData.softskills.includes(skill)) {
        initialScore += points.skills;
      }
    }
  
    // Calculate the initial score based on soft skills match
    for (const softSkill of offerSoftSkills) {
      if (candidateData.skills.includes(softSkill) || candidateData.softskills.includes(softSkill)) {
        initialScore += points.softSkills;
      }
    }
  
    // Calculate score based on location match
    if (offerData.Location !== "Fully remote: no on-site work required") {
      if (candidateData.country === offerData.Country) {
        initialScore += points.countryMatch;
      }
      if (candidateData.state === offerData.State) {
        initialScore += points.stateMatch;
      }
    }
    setScore(initialScore);
  };
  
      
  const handleSetInterview = async () => {
    if (!selectedJobOffer) {
        alert('Please select a job offer.');
        return;
    }
    if (!note) {
        alert('Please provide a note.');
        return;
    }
    setShowMessageInput(true);
    setShowDateTimeInput(true);
    setShowSubmitButton(true);
    try {
      const offerResponse = await fetch(`  http://localhost:9000/Employer/JobOffer/${selectedJobOffer}`, {
        credentials: 'include'
      });
      const candidateResponse = await fetch(`  http://localhost:9000/Employer/JobOffer/candidate/${candidateID}/candidate-cv`, {
        credentials: 'include'
      });
      const workExperienceResponse = await fetch(`http://localhost:9000/Employer/JobOffer/candidate/${candidateID}/work_experience`, {
        credentials: 'include'
      });
      const certificatesResponse = await fetch(`http://localhost:9000/Employer/JobOffer/candidate/${candidateID}/certificates`, {
          credentials: 'include'
      });
      const educationResponse = await fetch(`http://localhost:9000/Employer/JobOffer/candidate/${candidateID}/education`, {
          credentials: 'include'
      });
      if (candidateResponse.ok && workExperienceResponse.ok && certificatesResponse.ok && educationResponse.ok && offerResponse.ok) {
        const candidateData = await candidateResponse.json();
        const workExperiencesData = await workExperienceResponse.json();
        const certificatesData = await certificatesResponse.json();
        const educationData = await educationResponse.json();
        const offerData = await offerResponse.json();   
        console.log(candidateData);
        console.log(offerData);
        console.log(educationData);
        console.log(workExperiencesData);
        console.log(certificatesData);
        calculateInitialScore(candidateData, educationData, workExperiencesData, certificatesData, offerData);
      } else {
          console.error(`Failed to fetch data`);
      }
    }
    
    catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto mt-8">
        <h2 className="text-2xl font-semibold mb-4 text-blueColor">Offer a Job</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label htmlFor="jobOffer" className="block text-sm font-medium text-gray-700">Select a job offer:</label>
          <select
            id="jobOffer"
            name="jobOffer"
            value={selectedJobOffer}
            onChange={(e) => setSelectedJobOffer(e.target.value)}
            className="block w-full border-gray-300 shadow-sm focus:border-blueColor focus:ring focus:ring-blueColor focus:ring-opacity-50 rounded-md"
          >
            <option value="">Select</option>
            {jobOffers.map((offer) => (
              <option key={offer.JobOfferID} value={offer.JobOfferID}>
                {offer.Title}
              </option>
            ))}
          </select>
          
          <label htmlFor="note" className="block text-sm font-medium text-gray-700">Note:</label>
          <textarea
            id="note"
            name="note"
            rows="4"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="block w-full border border-gray-300 shadow-sm focus:border-blueColor focus:ring focus:ring-blueColor focus:ring-opacity-50 rounded-md"
          ></textarea>
          
          {/* Modify the condition for displaying the "Set up interview" button */}
          {selectedJobOffer && (
            <>
              <button type="button" onClick={handleSetInterview} className="inline-block py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blueColor hover:bg-darkBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blueColor">
                Set up interview
              </button>
              {/* Add interview section */}
              {showDateTimeInput && showMessageInput && (
                <div>
                  <label htmlFor="interviewDateTime" className="block text-sm font-medium text-gray-700">Interview Date & Time:</label>
                  <input
                    type="datetime-local"
                    id="interviewDateTime"
                    value={interviewDateTime}
                    onChange={(e) => setInterviewDateTime(e.target.value)}
                    className="border rounded px-4 py-2 mr-4"                  />
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message:</label>
                  <textarea
                    type="text"
                    id="message"
                    value={message}
                    rows="4"
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter Message"
                    className="block w-full border border-gray-300 shadow-sm focus:border-blueColor focus:ring focus:ring-blueColor focus:ring-opacity-50 rounded-md"
                  />
                </div>
              )}
              {/* Only show the submit button if interview setup is done */}
              {showSubmitButton && (
                <button type="submit" className="inline-block py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blueColor hover:bg-darkBlue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blueColor">
                  Submit Offer
                </button>
              )}
            </>
          )}
        </form>
      </div>
    </>
  );
};

export default OfferAJob;

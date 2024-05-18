import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../NavBar/CandidateNavbar.jsx";

const Application = () => {
  const navigate = useNavigate();
  const jobofferId = new URLSearchParams(window.location.search).get("jobofferId");
  const [additionalQuestions, setAdditionalQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [missingSkills, setMissingSkills] = useState([]);
  const [missingSoftSkills, setMissingSoftSkills] = useState([]);
  const [score, setScore] = useState(0);
  const [checkedSkills, setCheckedSkills] = useState([]);
  const [checkedSoftSkills, setCheckedSoftSkills] = useState([]);

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
    const fetchData = async () => {
        try {
            const candidateResponse = await fetch(`http://localhost:9000/Candidate/candidateInfo`, {
                credentials: 'include'
            });
            const workExperienceResponse = await fetch(`http://localhost:9000/Candidate/cv/getWorkExperience`, {
                credentials: 'include'
            });
            const certificatesResponse = await fetch(`http://localhost:9000/Candidate/cv/getCertificate`, {
                credentials: 'include'
            });
            const educationResponse = await fetch(`http://localhost:9000/Candidate/cv/getEducation`, {
                credentials: 'include'
            });
            const offerResponse = await fetch(`http://localhost:9000/Candidate/JobOffer/${jobofferId}`, {
                credentials: 'include'
            });

            if (candidateResponse.ok && workExperienceResponse.ok && certificatesResponse.ok && educationResponse.ok && offerResponse.ok) {
                const candidateData = await candidateResponse.json();
                const workExperiencesData = await workExperienceResponse.json();
                const certificatesData = await certificatesResponse.json();
                const educationData = await educationResponse.json();
                const offerData = await offerResponse.json();   
                candidateData.dateOfBirth = new Date(candidateData.dateOfBirth).toLocaleDateString("en-GB");
                offerData.additionalQuestions = offerData.additionalQuestions.split(";code;");
                setAdditionalQuestions(offerData.additionalQuestions);
                calculateInitialScore(candidateData, educationData, workExperiencesData, certificatesData, offerData);
            } else {
                console.error(`Failed to fetch data`);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    fetchData();
}, [jobofferId]);

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
  let missingskills = [];
  let missingsoftskills = [];

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
    } else {
      missingskills.push(skill);
    }
  }

  // Calculate the initial score based on soft skills match
  for (const softSkill of offerSoftSkills) {
    if (candidateData.skills.includes(softSkill) || candidateData.softskills.includes(softSkill)) {
      initialScore += points.softSkills;
    } else {
      missingsoftskills.push(softSkill);
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
  setMissingSkills(missingskills);
  setMissingSoftSkills(missingsoftskills);
  setScore(initialScore);
};

const handleAnswerChange = (questionId, answer) => {
  setAnswers({ ...answers, [questionId]: answer });
};

const handleCheckboxChange1 = (skill, isChecked) => {
  setCheckedSkills(prevState => ({ ...prevState, [skill]: isChecked }));
};

const handleCheckboxChange2 = (softskill, isChecked) => {
  setCheckedSoftSkills(prevState => ({ ...prevState, [softskill]: isChecked }));
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const answersCombined = Object.values(answers).join(';code;');
  const description = event.target.description.value.trim();
  let formErrors = {};

  if (description === "") {
    formErrors.description = "Please enter a description for your application.";
  }

  additionalQuestions.forEach((question, index) => {
    if (!answers[index] || answers[index].trim() === "") {
      formErrors[`question-${index}`] = "This question is required.";
    }
  });

  if (Object.keys(formErrors).length > 0) {
    setErrors(formErrors);
    return;
  }
  
  let additionalPoints = 0;
  for (const skill in checkedSkills) {
    if (checkedSkills[skill]) {
      additionalPoints += points.skills;
    }
  }

  for (const softSkill in checkedSoftSkills) {
    if (checkedSoftSkills[softSkill]) {
      additionalPoints += points.softSkills;
    }
  }

  const newScore = score + additionalPoints;
  setScore(prevScore => {
    const newScore = prevScore + additionalPoints;
    console.log(newScore); // Log the new score
    return newScore;
  });

  try {
    const response = await fetch(
      `http://localhost:9000/Candidate/JobOffer/${jobofferId}/apply`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description,
          answers: answersCombined,
          score: newScore
        }),
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to submit application");
    }

    alert("Application submitted successfully");
    navigate("/candidate/profile");
  } catch (error) {
    console.error("Error submitting application:", error);
    alert("An error occurred while submitting your application");
  }
};

return (
  <>
    <Navbar></Navbar>
    <div className="mt-10 max-w-4xl mx-auto add-job-image">
      <h2 className="text-center text-xl font-bold">Job Application</h2>
      <form onSubmit={handleSubmit} className="mb-5">
        {/* Render skills/soft skills evaluation */}
        {missingSkills.length > 0 && (
          <div>
            <p className="text-lg font-bold text-blueColor">Please indicate if you are proficient in the following skills:</p>
            {missingSkills.map((skill, index) => (
                <div key={index} className="mb-2">
                  <label className="inline-flex items-center">
                  <span className="ml-2">{skill}</span>
                  <input
                    type="checkbox"
                    name={skill}
                    className="rounded-full h-4 w-4 ml-2 text-blue-600 border border-blue-600 flex items-center justify-center"
                    checked={checkedSkills[skill]}
                    onChange={(e) => handleCheckboxChange1(skill, e.target.checked)}
                  />
                </label>
              </div>
            ))}
            {missingSoftSkills.map((softskill, index) => (
                <div key={index} className="mb-2">
                  <label className="inline-flex items-center">
                  <span className="ml-2">{softskill}</span>
                  <input
                    type="checkbox"
                    name={softskill}
                    className="rounded-full h-4 w-4 ml-2 text-blue-600 border border-blue-600 flex items-center justify-center"
                    checked={checkedSoftSkills[softskill]}
                    onChange={(e) => handleCheckboxChange2(softskill, e.target.checked)}
                  />
                </label>
              </div>
            ))}
          </div>
        )}
        {/* Render additional questions */}
        {additionalQuestions.length > 0 && (
          <div>
            <p className="text-lg font-bold text-blueColor">Please answer these questions:</p>
            {additionalQuestions.map((question, index) => (
                <div key={index} className="mb-4">
                <label className="block text-sm font-bold text-blueColor">{question}</label>
                <input
                  type="text"
                  value={answers[index] || ""}
                  className="block w-full px-3 py-2 mt-1 text-sm text-gray-900 bg-gray-100 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                />
              </div>
            ))}
          </div>
        )}
        {/* Description input */}
        <div className="mb-5">
        <label htmlFor="description" className="block mb-2 text-lg font-bold text-blueColor">Cover Letter:</label>
        <br />
        <textarea
          id="description"
          name="description"
          rows="4"
          cols="50"
          className="block w-full px-3 py-2 text-sm text-gray-900 bg-gray-100 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
        ></textarea>
        </div>
        <br />
        <button type="submit" className="text-white bg-blueColor hover:bg-blueColor focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-2xl text-sm px-7 py-3.5 w-full">Submit Application</button>
      </form>
    </div>
  </>
);
};

export default Application;

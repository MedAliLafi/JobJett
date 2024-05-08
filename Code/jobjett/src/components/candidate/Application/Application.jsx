import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../NavBar/CandidateNavbar.jsx";

const Application = () => {
  const navigate = useNavigate();
  const jobofferId = new URLSearchParams(window.location.search).get("jobofferId");
  const [additionalQuestions, setAdditionalQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [missingSkills, setMissingSkills] = useState([]);
  const [score, setScore] = useState(0);
  const [candidate, setCandidate] = useState(null);
  const [offer, setOffer] = useState(null);
  const [workExperiences, setWorkExperiences] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [education, setEducation] = useState([]);
  
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
                candidateData.dateOfBirth = new Date(candidateData.dateOfBirth).toLocaleDateString(
                  "en-GB"
                );
                setOffer(offerData);
                setCandidate(candidateData);
                setWorkExperiences(workExperiencesData);
                setCertificates(certificatesData);
                setEducation(educationData);
                calculateInitialScore(candidateData, educationData, workExperiencesData, certificatesData, offerData);
            } else {
                console.error(`Failed to fetch data`);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const calculateInitialScore = (candidateData, educationData, workExperiencesData, certificatesData, offerData) => {
      // Define points for various criteria
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
        skills: 5,
        softSkills: 5,
        countryMatch: 10,
        stateMatch: 5
      };
      let initialScore = 0;
      let missing = [];
      
      // Calculate the initial score based on job title match, education match, experience, department match, skills match and softskills match here
      
      // Calculate the initial score based on job title match
      if (
        candidateData.Skills.includes(offerData.Title) ||
        candidateData.Summary.includes(offerData.Title) ||
        candidateData.Domain.includes(offerData.Title) ||
        workExperiencesData.some((exp) => exp.jobTitle.includes(offerData.Title)) ||
        certificatesData.some((cert) => cert.certification.includes(offerData.Title)) ||
        educationData.some((edu) => edu.fieldOfStudy.includes(offerData.Title))
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
        candidateData.Skills.includes(offerData.Department) ||
        candidateData.SoftSkills.includes(offerData.Department) ||
        candidateData.Domain.includes(offerData.Department) ||
        workExperiencesData.some((exp) => exp.jobTitle.includes(offerData.Department)) ||
        certificatesData.some((cert) => cert.certification.includes(offerData.Department)) ||
        educationData.some((edu) => edu.FieldOfStudy.includes(offerData.Department))
      ) {
        initialScore += points.departmentMatch;
      }

      // Calculate the initial score based on skills match
      const offerSkills = offerData.skills.split(";code;");
      const offerSoftSkills = offerData.softSkills.split(";code;");
      for (const skill of offerSkills) {
        if (candidateData.skills.includes(skill) || candidateData.softSkills.includes(skill)) {
          initialScore += points.skills;
        } else {
          missing += skill;
        }
      }

      // Calculate the initial score based on soft skills match
      for (const softSkill of offerSoftSkills) {
        if (candidateData.skills.includes(softSkill) || candidateData.softSkills.includes(softSkill)) {
          initialScore += points.softSkills;
        } else {
          missing += softSkill;
        }
      }

      // Calculate score based on location match
      if (offerData.location !== "Fully remote: no on-site work required") {
        if (candidateData.Country === employerData.Country) {
          initialScore += points.countryMatch;
        }
        if (candidateData.State === employerData.State) {
          initialScore += points.stateMatch;
        }
      }

      setMissingSkills(missing);
      setScore(initialScore);
    };

    fetchData();
  }, [jobofferId]);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleSkillAnswer = (skill, answer) => {
    // Update the score here
    setScore(newScore);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const answersCombined = Object.values(answers).join(';code;');
    const description = event.target.description.value.trim();
    if (description === "") {
      alert("Please enter a description for your application.");
      return;
    }

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
            score
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
      <div>
        <h2>Job Application</h2>
        <form onSubmit={handleSubmit}>
          {/* Render skills/soft skills evaluation */}
          {missingSkills.length > 0 && (
            <div>
              <p>Please indicate if you are proficient in the following skills:</p>
              {missingSkills.map((skill, index) => (
                <div key={index}>
                  <label>
                    {skill}
                    <input
                      type="checkbox"
                      checked={false}
                      onChange={(e) => handleSkillAnswer(skill, e.target.checked)}
                    />
                  </label>
                </div>
              ))}
            </div>
          )}
          {/* Render additional questions */}
          {additionalQuestions.map((question, index) => (
            <div key={index}>
              <p>{question}</p>
              <input
                type="text"
                value={answers[index] || ""}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
              />
            </div>
          ))}
          {/* Description input */}
          <label htmlFor="description">Description:</label>
          <br />
          <textarea
            id="description"
            name="description"
            rows="4"
            cols="50"
          ></textarea>
          <br />
          <button type="submit">Submit Application</button>
        </form>
      </div>
    </>
  );
};

export default Application;

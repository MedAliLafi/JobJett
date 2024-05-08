import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../NavBar/CandidateNavbar.jsx";

const JobOfferDetails = () => {
  const [jobofferDetails, setJobOfferDetails] = useState(null);
  const { jobofferId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobOfferDetails();
  }, [jobofferId]);

  const fetchJobOfferDetails = async () => {
    try {
      const response = await fetch(
        `http://localhost:9000/Candidate/JobOffer/${jobofferId}`,
        {
          credentials: "include",
        }
      );
      if (response.ok) {
        const jobofferDetails = await response.json();
        jobofferDetails.DatePosted = new Date(
          jobofferDetails.DatePosted
        ).toLocaleDateString("en-GB");
        const salaryParts = jobofferDetails.Salary.split("_");
        const salaryType = salaryParts[0];
        const salaryValue = salaryParts[1];
        const salaryFrequency = salaryParts[2];

        jobofferDetails.SalaryParsed = {
          type: salaryType,
          value: salaryValue,
          frequency: salaryFrequency,
        };

        setJobOfferDetails(jobofferDetails);
        // Splitting required skills and soft skills
        jobofferDetails.RequiredSkills = jobofferDetails.ReqSkills.split(";code;");
        jobofferDetails.RequiredSoftSkills = jobofferDetails.ReqSoftSkills.split(";code;");

        setJobOfferDetails(jobofferDetails);
      } else {
        console.error("Failed to fetch job offer details");
      }
    } catch (error) {
      console.error("Error fetching job offer details:", error);
    }
  };

  const redirectToApplication = () => {
    navigate(`/candidate/application?jobofferId=${jobofferId}`);
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4">
        <div className="bg-white shadow-md rounded-lg p-6 mt-8">
          {/* Job offer details */}
          <div className="text-center"> {/* This div centers the text */}
            <h1 className="text-2xl font-semibold mb-4">Job Offer Details</h1>
          </div>
          {jobofferDetails && (
            <div>
              {/* Logo */}
              {jobofferDetails && (
                <div className="flex-1 flex justify-center items-center">
                  <img
                    src={jobofferDetails.Logo}
                    alt="Company Logo"
                    className="w-32 h-32"
                  />
                </div>
              )}
              <p>
                <strong>Company Name:</strong> {jobofferDetails.CompanyName}
              </p>
              <p>
                <strong>Industry:</strong> {jobofferDetails.Industry}
              </p>
              <p>
                <strong>Phone:</strong> {jobofferDetails.Phone}
              </p>
              <p>
                <strong>State:</strong> {jobofferDetails.State}
              </p>
              <p>
                <strong>Country:</strong> {jobofferDetails.Country}
              </p>
              <p>
                <strong>Address:</strong> {jobofferDetails.Address}
              </p>
              <p>
                <strong>Job Title:</strong> {jobofferDetails.Title}
              </p>
              <p>
                <strong>Description:</strong> {jobofferDetails.Description}
              </p>
              <p>
                <strong>Type:</strong> {jobofferDetails.Type}
              </p>
              {/* Displaying parsed salary details */}
              {jobofferDetails.SalaryParsed && (
                <p>
                  <strong>Salary:</strong>{" "}
                  {jobofferDetails.SalaryParsed.type === "Range"
                    ? `The salary ranges from ${jobofferDetails.SalaryParsed.value.split("-")[0]} to ${jobofferDetails.SalaryParsed.value.split("-")[1]} ${jobofferDetails.SalaryParsed.frequency}`
                    : jobofferDetails.SalaryParsed.type === "Start"
                    ? `The salary starts at ${jobofferDetails.SalaryParsed.value} ${jobofferDetails.SalaryParsed.frequency}`
                    : jobofferDetails.SalaryParsed.type === "Max"
                    ? `The highest amount is ${jobofferDetails.SalaryParsed.value} ${jobofferDetails.SalaryParsed.frequency}`
                    : jobofferDetails.SalaryParsed.type === "Exact"
                    ? `The salary is fixed at ${jobofferDetails.SalaryParsed.value} ${jobofferDetails.SalaryParsed.frequency}`
                    : ""}
                </p>
              )}
              <p>
                <strong>Location:</strong> {jobofferDetails.Location}
              </p>
              <p>
                <strong>Date Posted:</strong> {jobofferDetails.DatePosted}
              </p>
              <p>
                <strong>Department:</strong> {jobofferDetails.Department}
              </p>
              <p>
                <strong>Schedule:</strong> {jobofferDetails.Schedule}
              </p>
              <p>
                <strong>Required Education:</strong>{" "}
                {jobofferDetails.ReqEducation}
              </p>
              <p>
                <strong>Required Experience:</strong>{" "}
                {jobofferDetails.ReqExperience}
              </p>
              {/* Displaying required skills */}
              <div>
                <strong>Required Skills:</strong>
                <ul>
                  {jobofferDetails.RequiredSkills.map((skill, index) => (
                    <li key={index}>{skill}</li>
                  ))}
                </ul>
              </div>
              {/* Displaying required soft skills */}
              <div>
                <strong>Required Soft Skills:</strong>
                <ul>
                  {jobofferDetails.RequiredSoftSkills.map((softSkill, index) => (
                    <li key={index}>{softSkill}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          {/* Button to redirect to application */}
          <div className="mt-6 ">
            <button
              onClick={redirectToApplication}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Apply Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default JobOfferDetails;

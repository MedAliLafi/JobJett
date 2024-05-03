import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./modals.css";

const JobOfferDetails = ({ isOpen, onClose, jobofferId }) => {
  const [jobofferDetails, setJobOfferDetails] = useState(null);
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
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center transparent-background">
          {/* Translucent overlay */}
        </div>
      )}
      <div
        id="crud-modal"
        tabIndex="-1"
        aria-hidden={!isOpen}
        className={`${
          isOpen ? "" : "hidden"
        } fixed inset-0 flex items-center justify-center z-50`}
      >
        <div className="relative p-4 w-full max-w-2xl max-h-full">
          {/* Modal content */}
          <div id="shadow" className="relative bg-white rounded-lg">
            {/* Modal header */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
              <h3 className="text-lg font-semibold text-gray-900">
                Job Offer Details
              </h3>
              <button
                type="button"
                id="closeButton"
                className="text-gray-400  hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                onClick={onClose}
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  ></path>
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            {/* Modal body */}
            <div className="p-4 md:p-5">
              {/* Job offer details */}
              <h1>Job Offer Details</h1>
              {jobofferDetails && (
                <div>
                  <p>
                    <strong>Job Title:</strong> {jobofferDetails.Title}
                  </p>
                  <p>
                    <strong>Description:</strong>{" "}
                    {jobofferDetails.Description}
                  </p>
                  <p>
                    <strong>Type:</strong> {jobofferDetails.Type}
                  </p>
                  <p>
                    <strong>Salary:</strong> {jobofferDetails.Salary}
                  </p>
                  <p>
                    <strong>Location:</strong> {jobofferDetails.Location}
                  </p>
                  <p>
                    <strong>Date Posted:</strong>{" "}
                    {jobofferDetails.DatePosted}
                  </p>
                  <p>
                    <strong>Department:</strong>{" "}
                    {jobofferDetails.Department}
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
                  <p>
                    <strong>Required Skills:</strong>{" "}
                    {jobofferDetails.ReqSkills}
                  </p>
                  <p>
                    <strong>Required Soft Skills:</strong>{" "}
                    {jobofferDetails.ReqSoftSkills}
                  </p>
                </div>
              )}
              {/* Button to redirect to application */}
              <div className="button">
                <button
                  onClick={redirectToApplication}
                  className="border-[2px] rounded-[10px] block p-[10px] w-full text-[14px] font-semibold text-black hover:bg-white group-hover/item:text-black group-hover:text-white"
                >
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default JobOfferDetails;
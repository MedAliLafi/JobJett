import React from "react";
import { useNavigate } from "react-router-dom";
import "./modals.css";

const Application = ({ isOpen, onClose, jobofferId }) => {
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

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
          body: JSON.stringify({ description: description }),
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
          <div id="shadow" className="relative bg-white rounded-lg ">
            {/* Modal header */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
              <h3 className="text-lg font-semibold text-gray-900">
                Job Application
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
            <form className="p-4 md:p-5" onSubmit={handleSubmit}>
              <p>Job Offer ID: {jobofferId}</p>
              <br />
              <label htmlFor="description">Description:</label>
              <br />
              <textarea
                id="description"
                name="description"
                rows="4"
                cols="50"
              ></textarea>
              <br />
              <div className="flex justify-center">
                <button
                  type="submit"
                  id="sb-button"
                  className=" font-semibold rounded-lg text-sm px-5 py-2.5 text-center sb-button"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Application;

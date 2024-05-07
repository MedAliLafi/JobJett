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
  const [showSubmitButton, setShowSubmitButton] = useState(false); // New state to control the visibility of the submit button

  useEffect(() => {
    const fetchJobOffers = async () => {
      try {
        const response = await fetch("http://localhost:9000/Employer/JobOffer/joboffers", {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
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

  const handleSetInterview = () => {
    setShowMessageInput(true);
    setShowDateTimeInput(true);
    setShowSubmitButton(true);
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

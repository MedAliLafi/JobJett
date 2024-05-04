import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../NavBar/EmployerNavbar.jsx";

const OfferAJob = () => {
  const { candidateID } = useParams(); // Get the candidate ID from URL params
  const navigate = useNavigate();

  const [jobOffers, setJobOffers] = useState([]);
  const [selectedJobOffer, setSelectedJobOffer] = useState("");
  const [note, setNote] = useState("");
  const [interviewDateTime, setInterviewDateTime] = useState("");
  const [showDateTimeInput, setShowDateTimeInput] = useState(false);
  const [message, setMessage] = useState("");
  const [showMessageInput, setShowMessageInput] = useState(false);

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
        const response = await fetch(`http://localhost:9000/Employer/Interview/add2`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            interviewDateTime: interviewDateTime,
            message: message,
            CandidateID: candidateID,
            JobOfferID: selectedJobOffer,
          }),
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          const { interviewID } = data;
          console.log("Interview scheduled successfully");
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
  };

  return (
    <>
      <Navbar />
      <div>
        <h2>Offer a job</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="jobOffer">Select a job offer:</label>
          <br />
          <select
            id="jobOffer"
            name="jobOffer"
            value={selectedJobOffer}
            onChange={(e) => setSelectedJobOffer(e.target.value)}
          >
            <option value="">Select</option>
            {jobOffers.map((offer) => (
              <option key={offer.JobOfferID} value={offer.JobOfferID}>
                {offer.Title}
              </option>
            ))}
          </select>
          <br />
          <label htmlFor="note">Note:</label>
          <br />
          <textarea
            id="note"
            name="note"
            rows="4"
            cols="50"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          ></textarea>
          <br />
          {/* Modify the condition for displaying the "Set up interview" button */}
          {selectedJobOffer && (
            <>
              <button onClick={handleSetInterview}>Set up interview</button>
              {/* Add interview section */}
              {showDateTimeInput && showMessageInput && (
                <div>
                  <input
                    type="datetime-local"
                    value={interviewDateTime}
                    onChange={(e) => setInterviewDateTime(e.target.value)}
                  />
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter Message"
                  />
                </div>
              )}
            </>
          )}
          <br />
          <button type="submit">Submit Offer</button>
        </form>
      </div>
    </>
  );
};

export default OfferAJob;

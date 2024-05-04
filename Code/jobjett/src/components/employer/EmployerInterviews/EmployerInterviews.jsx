import React, { useState, useEffect } from "react";
import Navbar from "../NavBar/EmployerNavbar.jsx";

const EmployerInterviews = () => {
  const [interviews, setInterviews] = useState([]);
  const [showRescheduleInput, setShowRescheduleInput] = useState({});
  const [rescheduleDateTime, setRescheduleDateTime] = useState({});
  const [rescheduleMessage, setRescheduleMessage] = useState({});

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const response = await fetch(
          "http://localhost:9000/Employer/Interview/getinterviews",
          {
            credentials: "include",
          }
        );
        if (response.ok) {
          const data = await response.json();
          // Map over interviews and format the date
          const formattedInterviews = data.map((interview) => ({
            ...interview,
            CandidateName: `${interview.FirstName} ${interview.LastName}`,
            InterviewDateTime: new Date(
              interview.InterviewDateTime
            ).toLocaleString("en-GB", {
              timeZone: "UTC",
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            }),
          }));
          setInterviews(formattedInterviews);
          // Initialize state for showing reschedule input for each interview
          const initialShowRescheduleInput = {};
          const initialRescheduleDateTime = {};
          const initialRescheduleMessage = {};
          formattedInterviews.forEach(interview => {
            initialShowRescheduleInput[interview.InterviewID] = false;
            initialRescheduleDateTime[interview.InterviewID] = '';
            initialRescheduleMessage[interview.InterviewID] = interview.Message;
          });
          setShowRescheduleInput(initialShowRescheduleInput);
          setRescheduleDateTime(initialRescheduleDateTime);
          setRescheduleMessage(initialRescheduleMessage);
        } else {
          console.error("Failed to fetch interviews");
        }
      } catch (error) {
        console.error("Error fetching interviews:", error);
      }
    };

    fetchInterviews();
  }, []);

  const cancelInterview = async (interviewID) => {
    try {
      const deleteResponse = await fetch(
        `http://localhost:9000/Employer/Interview/cancel`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ interviewID }),
          credentials: "include",
        }
      );
      if (!deleteResponse.ok) {
        throw new Error("Failed to cancel interview");
      }
      console.log("Interview canceled successfully.");
    } catch (error) {
      console.error("Error canceling interview:", error);
    }
  };

  const handleReschedule = (interviewID) => {
    setShowRescheduleInput(prevState => ({
      ...prevState,
      [interviewID]: true
    }));
  };

  const handleRescheduleDateTimeChange = (interviewID, value) => {
    setRescheduleDateTime(prevState => ({
      ...prevState,
      [interviewID]: value
    }));
  };

  const handleRescheduleMessageChange = (interviewID, value) => {
    setRescheduleMessage(prevState => ({
      ...prevState,
      [interviewID]: value
    }));
  };

  const rescheduleInterview = async (interviewID) => {
    try {
      const response = await fetch(
        `http://localhost:9000/Employer/Interview/${interviewID}/reschedule`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ interviewID, interviewDateTime: rescheduleDateTime[interviewID], message: rescheduleMessage[interviewID] }),
          credentials: "include",
        }
      );
      if (response.ok) {
        console.log("Interview rescheduled successfully.");
        // Update UI to hide input and reset state
        setShowRescheduleInput(prevState => ({
          ...prevState,
          [interviewID]: false
        }));
        setRescheduleDateTime(prevState => ({
          ...prevState,
          [interviewID]: ''
        }));
        setRescheduleMessage(prevState => ({
          ...prevState,
          [interviewID]: ''
        }));
      } else {
        console.error("Failed to reschedule interview");
      }
    } catch (error) {
      console.error("Error rescheduling interview:", error);
    }
  };

  return (
    <>
      <Navbar />
      <h2 className="text-center text-blueColor text-xl font-bold mt-4">
        Interviews
      </h2>
      <div className="mt-7 relative overflow-x-auto  sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Interview ID</th>
              <th className="px-6 py-3">Job Title</th>
              <th className="px-6 py-3">Candidate Name</th>
              <th className="px-6 py-3">Interview Date & Time</th>
              <th className="px-6 py-3">Note</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {interviews.map((interview) => (
              <tr key={interview.InterviewID} className="border-b">
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {interview.InterviewID}
                </td>
                <td className="px-6 py-4">{interview.Title}</td>
                <td className="px-6 py-4">{interview.CandidateName}</td>
                <td className="px-6 py-4">{interview.InterviewDateTime}</td>
                <td className="px-6 py-4">
                  {/* Show reschedule button and input */}
                  {!showRescheduleInput[interview.InterviewID] && (
                    <span>{interview.Message}</span>
                  )}
                  {showRescheduleInput[interview.InterviewID] && (
                    <input
                      type="text"
                      value={rescheduleMessage[interview.InterviewID]}
                      onChange={(e) => handleRescheduleMessageChange(interview.InterviewID, e.target.value)}
                      className="mr-2"
                    />
                  )}
                </td>
                <td className="px-6 py-4">
                  {!showRescheduleInput[interview.InterviewID] && (
                    <button
                      onClick={() => handleReschedule(interview.InterviewID)}
                      className="text-white bg-blue-600 hover:bg-blue-700 rounded-md px-3 py-1"
                    >
                      Reschedule
                    </button>
                  )}
                  {showRescheduleInput[interview.InterviewID] && (
                    <>
                      <input
                        type="datetime-local"
                        value={rescheduleDateTime[interview.InterviewID]}
                        onChange={(e) => handleRescheduleDateTimeChange(interview.InterviewID, e.target.value)}
                        className="mr-2"
                      />
                      <button
                        onClick={() => rescheduleInterview(interview.InterviewID)}
                        className="text-white bg-green-600 hover:bg-green-700 rounded-md px-3 py-1"
                      >
                        Save
                      </button>
                    </>
                  )}
                  <button
                    onClick={async () => cancelInterview(interview.InterviewID)}
                    className="text-white bg-red-600 hover:bg-red-700 rounded-md px-3 py-1 ml-2"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default EmployerInterviews;

import React, { useState, useEffect } from "react";
import Navbar from "../NavBar/CandidateNavbar.jsx";

const CandidateInterviews = () => {
  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const response = await fetch(
          "http://localhost:9000/Candidate/Interview/getinterviews2",
          {
            credentials: "include",
          }
        );
        if (response.ok) {
          const data = await response.json();
          // Map over interviews and format the date
          const formattedInterviews = data.map((interview) => ({
            ...interview,
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
        `http://localhost:9000/Candidate/Interview/cancel2`,
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
      // Update the interviews state to remove the canceled interview
      setInterviews((prevInterviews) =>
        prevInterviews.filter((interview) => interview.InterviewID !== interviewID)
      );
    } catch (error) {
      console.error("Error canceling interview:", error);
    }
  };

  return (
    <>
      <Navbar />
      <h2 className="text-center text-blueColor text-xl font-bold mt-4">
        Your Interviews
      </h2>
      <div className="mt-7 relative overflow-x-auto  sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Interview ID</th>
              <th className="px-6 py-3">Job Title</th>
              <th className="px-6 py-3">Employer</th>
              <th className="px-6 py-3">Message</th>
              <th className="px-6 py-3">Interview Date & Time</th>
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
                <td className="px-6 py-4">{interview.CompanyName}</td>
                <td className="px-6 py-4">{interview.Message}</td>
                <td className="px-6 py-4">{interview.InterviewDateTime}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => cancelInterview(interview.InterviewID)}
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

export default CandidateInterviews;

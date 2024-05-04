import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../NavBar/CandidateNavbar.jsx";

const CandidateApplications = () => {
  const [appliedApplications, setAppliedApplications] = useState([]);
  const [offeredApplications, setOfferedApplications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCandidateApplications();
  }, []);

  const fetchCandidateApplications = async () => {
    try {
      const response = await fetch(
        "http://localhost:9000/Candidate/JobOffer/candidate_applications",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        // Filter applications based on type
        const applied = data.filter(application => application.Type === "Applied");
        const offered = data.filter(application => application.Type === "Offered");
        setAppliedApplications(applied);
        setOfferedApplications(offered);
      } else {
        console.error("Failed to fetch candidate applications");
      }
    } catch (error) {
      console.error("Error fetching candidate applications:", error);
    }
  };

  return (
<>
  <Navbar />
  <div className="mt-8">
    <h2 className="text-center text-3xl font-semibold text-blueColor">
      Candidate Applications
    </h2>
    <div className="mt-6">
      {/* Display Applications Table */}
      {appliedApplications.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-blueColor">Applications</h3>
          <div className="mt-7 relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left">
              {/* Table headers */}
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Job Title
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Company Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Status
                  </th>
                </tr>
              </thead>
              {/* Table body */}
              <tbody>
                {appliedApplications.map((application) => (
                  <tr key={application.ApplicationID} className="odd:bg-white even:bg-gray-50 border-b">
                    {/* Table data */}
                    <td
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                    >
                      {application.JobOfferTitle}
                    </td>
                    <td
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                    >
                      {application.CompanyName}
                    </td>
                    <td
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                    >
                      {application.Description}
                    </td>
                    <td
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                    >
                      {application.Status.includes('Interview Scheduled') ? 'Interview Scheduled' : application.Status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Display Offers Table */}
      {offeredApplications.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-blueColor">Offers</h3>
          <div className="mt-7 relative overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left">
              {/* Table headers */}
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Job Title
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Company Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Description
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Status
                  </th>
                </tr>
              </thead>
              {/* Table body */}
              <tbody>
                {offeredApplications.map((application) => (
                  <tr key={application.ApplicationID} className="odd:bg-white even:bg-gray-50 border-b">
                    {/* Table data */}
                    <td
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                    >
                      {application.JobOfferTitle}
                    </td>
                    <td
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                    >
                      {application.CompanyName}
                    </td>
                    <td
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                    >
                      {application.Description}
                    </td>
                    <td
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                    >
                      {application.Status.includes('Interview Scheduled') ? 'Interview Scheduled' : application.Status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Display message if no applications or offers */}
      {appliedApplications.length === 0 && offeredApplications.length === 0 && (
        <p className="text-center">No applications found.</p>
      )}
    </div>
  </div>
</>

  );
};

export default CandidateApplications;

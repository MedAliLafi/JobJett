import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../NavBar/CandidateNavbar.jsx";

const CandidateApplications = () => {
  const [appliedApplications, setAppliedApplications] = useState([]);
  const [offeredApplications, setOfferedApplications] = useState([]);
  const [applicationsType, setApplicationsType] = useState("Applications");
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

  const handleButtonClick = (type) => {
    setApplicationsType(type);
  };

  return (
    <>
      <Navbar />
      <div className="mt-8">
        <h2 className="text-center text-3xl font-semibold text-blueColor">
          Candidate Applications
        </h2>
        <div className="mt-6">
          <div className="flex justify-center space-x-4 mb-4">
            <button
              className={`${
                applicationsType === "Applications"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              } py-2 px-4 rounded`}
              onClick={() => handleButtonClick("Applications")}
            >
              Applications
            </button>
            <button
              className={`${
                applicationsType === "Offers"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              } py-2 px-4 rounded`}
              onClick={() => handleButtonClick("Offers")}
            >
              Offers
            </button>
          </div>
          {applicationsType === "Applications" && appliedApplications.length > 0 &&(
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
          {applicationsType === "Offers" && offeredApplications.length > 0 &&(
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
                      <th className="px-6 py-3">Actions</th>
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
                        <td className="px-6 py-4">
                          <button
                            onClick={() => cancelInterview(application.ApplicationID)}
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
            </div>
          )}
          {/* Display message if no applications or offers */}
          {appliedApplications.length === 0 && applicationsType === "Applications" && (
            <p className="text-center">No applications found.</p>
          )}
          {offeredApplications.length === 0 && applicationsType === "Offers" &&(
            <p className="text-center">No offers found.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default CandidateApplications;

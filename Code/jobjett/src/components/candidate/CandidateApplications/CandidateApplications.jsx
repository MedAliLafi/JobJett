import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../NavBar/CandidateNavbar.jsx";

const CandidateApplications = () => {
  const [appliedApplications, setAppliedApplications] = useState([]);
  const [offeredApplications, setOfferedApplications] = useState([]);
  const [applicationsType, setApplicationsType] = useState("Applications");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCandidateApplications();
  }, [applicationsType, searchTerm, sortBy]);

  function truncateDescription(description) {
    if (description.length <= 100) {
      return description;
    } else {
      return description.slice(0, 100) + "...";
    }
  }

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
        let filteredApplications = applicationsType === "Applications" ? applied : offered;

        // Filter based on search term
        filteredApplications = filteredApplications.filter(application =>
          application.JobOfferTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          application.CompanyName.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Sort based on sortBy state
        if (sortBy === "newest") {
          filteredApplications.sort((a, b) => new Date(b.DateApplied) - new Date(a.DateApplied));
        } else if (sortBy === "oldest") {
          filteredApplications.sort((a, b) => new Date(a.DateApplied) - new Date(b.DateApplied));
        }

        if (applicationsType === "Applications") {
          setAppliedApplications(filteredApplications);
        } else {
          setOfferedApplications(filteredApplications);
        }
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

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleDeleteApplication = async (applicationID) => {
    try {
      const response = await fetch(`http://localhost:9000/Candidate/JobOffer/${applicationID}/delete`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (response.ok) {
        setAppliedApplications(prevApplications =>
          prevApplications.filter(application => application.ApplicationID !== applicationID)
        );
        console.log('Application deleted successfully.');
      } else {
        const errorData = await response.json();
        console.error(errorData);
        alert(`${errorData.error}`);
      }
    } catch (error) {
      console.error('Error deleting application:', error);
    }
  };  

  const handleDeclineOffer = async (applicationID) => {
    try {
      const response = await fetch(`http://localhost:9000/Candidate/JobOffer/${applicationID}/decline`, {
        method: 'PUT',
        credentials: 'include'
      });
      if (response.ok) {
        setOfferedApplications(prevApplications => prevApplications.map(application => {
          if (application.ApplicationID === applicationID) {
            return { ...application, Status: 'Declined' };
          }
          return application;
        }));
        console.log('Application status updated successfully.');
      } else {
        const errorData = await response.json();
        console.error(errorData);
        alert(`${errorData.error}`);
      }
    } catch (error) {
      console.error('Error updating application status:', error);
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
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center ml-4">
              <h3 className="text-center font-bold mt-4 mb-4 text-blueColor mr-2">Search</h3>
              <input
                type="text"
                placeholder="Search by job title or company name"
                value={searchTerm}
                onChange={handleSearch}
                className="border p-2"
              />
            </div>
            <div className="flex items-center mr-2">
              <h3 className="text-center font-bold mt-4 mb-4 text-blueColor mr-2">Sort By</h3>
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="border p-2"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>
          </div>
          {applicationsType === "Applications" && appliedApplications.length > 0 && (
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
                      <th className="px-6 py-3">Actions</th>
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
                          {truncateDescription(application.Description)}
                        </td>
                        <td
                          scope="row"
                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                        >
                          {application.Status.includes('Interview Scheduled') ? 'Interview Scheduled' : application.Status}
                        </td>
                        <td className="px-6 py-4">
                          {/* Add a button similar to the one in Offers */}
                          <button
                            onClick={() => handleDeleteApplication(application.ApplicationID)}
                            className="text-white bg-red-600 hover:bg-red-700 rounded-md px-3 py-1 ml-2 cursor-not-allowed"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {applicationsType === "Offers" && offeredApplications.length > 0 && (
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
                          class
                          Name="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                          >
                            {application.CompanyName}
                          </td>
                          <td
                            scope="row"
                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                          >
                            {truncateDescription(application.Description)}
                          </td>
                          <td
                            scope="row"
                            className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                          >
                            {application.Status.includes('Interview Scheduled') ? 'Interview Scheduled' : application.Status}
                          </td>
                          <td className="px-6 py-4">
                            {application.Status !== 'Declined' && (
                              <button
                                onClick={() => handleDeclineOffer(application.ApplicationID)}
                                className="text-white bg-red-600 hover:bg-red-700 rounded-md px-3 py-1 ml-2"
                              >
                                Decline
                              </button>
                            )}
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
            {offeredApplications.length === 0 && applicationsType === "Offers" && (
              <p className="text-center">No offers found.</p>
            )}
          </div>
        </div>
      </>
    );
  };
  
  export default CandidateApplications;
  
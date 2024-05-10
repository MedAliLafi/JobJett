import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../NavBar/EmployerNavbar.jsx";

const ApplicationTable = ({ applications, jobOfferID, type, handleButtonClick, handleSearch, searchTerm, handleSortChange, sortBy }) => (
  <div>
    <h2 className="text-center text-xl font-bold mt-4 text-blueColor">
      {type === "Applications" ? `Applications for Job Offer ID: ${jobOfferID}` : `Offers for Job Offer ID: ${jobOfferID}`}
    </h2>
    <div className="flex justify-center space-x-4 mb-4">
      <button
        className={`${
          type === "Applications" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
        } py-2 px-4 rounded`}
        onClick={() => handleButtonClick("Applications")}
      >
        Applications
      </button>
      <button
        className={`${
          type === "Offers" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"
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
          placeholder="Search by candidate name"
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
          <option value="relevance">Relevance</option>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>
      </div>
    </div>
    {applications.length > 0 ? (
      <div className="mt-7 relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left ">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                Candidate ID
              </th>
              <th scope="col" className="px-6 py-3">
                First Name
              </th>
              <th scope="col" className="px-6 py-3">
                Last Name
              </th>
              <th scope="col" className="px-6 py-3">
                State
              </th>
              <th scope="col" className="px-6 py-3">
                Country
              </th>
              <th scope="col" className="px-6 py-3">
                Date Applied
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {applications.map((application) => (
              <tr key={application.CandidateID} className="odd:bg-white even:bg-gray-50 border-b">
                <td
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  {application.CandidateID}
                </td>
                <td
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  {application.firstname}
                </td>
                <td
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  {application.lastname}
                </td>
                <td
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  {application.state}
                </td>
                <td
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  {application.country}
                </td>
                <td
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  {new Date(application.DateApplied).toLocaleDateString(
                    "en-GB"
                  )}
                </td>
                <td
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  {application.Status.includes("Interview Scheduled")
                    ? "Interview Scheduled"
                    : application.Status}
                </td>
                <td
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  <Link
                    to={`/employer/applications/${jobOfferID}/${application.ApplicationID}`}
                    className="hover:underline text-blueColor"
                  >
                    View Application
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <p className="text-center">{`No ${type.toLowerCase()} found.`}</p>
    )}
  </div>
);

const JobApplications = () => {
  const { jobOfferID } = useParams();
  const [applications, setApplications] = useState([]);
  const [applicationsType, setApplicationsType] = useState("Applications");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("relevance");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch(
          `http://localhost:9000/Employer/JobOffer/${jobOfferID}/applications`,
          { credentials: "include" }
        );
        if (response.ok) {
          const data = await response.json();
          const filteredApplications = data.filter(app => app.Type === (applicationsType === "Applications" ? 'Applied' : 'Offered'));

          let filteredAndSortedApplications = filteredApplications.filter(application =>
            application.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            application.lastname.toLowerCase().includes(searchTerm.toLowerCase())
          );

          if (sortBy === "newest") {
            filteredAndSortedApplications.sort((a, b) => new Date(b.DateApplied) - new Date(a.DateApplied));
          } else if (sortBy === "oldest") {
            filteredAndSortedApplications.sort((a, b) => new Date(a.DateApplied) - new Date(b.DateApplied));
          } else if (sortBy === "relevance") {
            filteredAndSortedApplications.sort((a, b) => b.Score - a.Score);
          }

          setApplications(filteredAndSortedApplications);
        } else {
          console.error(`Failed to fetch applications for job offer ${jobOfferID}`);
        }
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };

    fetchApplications();
  }, [jobOfferID, applicationsType, searchTerm, sortBy]);

  const handleButtonClick = (type) => {
    setApplicationsType(type);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  return (
    <>
      <Navbar />
      <ApplicationTable
        applications={applications}
        jobOfferID={jobOfferID}
        type={applicationsType}
        handleButtonClick={handleButtonClick}
        handleSearch={handleSearch}
        searchTerm={searchTerm}
        handleSortChange={handleSortChange}
        sortBy={sortBy}
      />
    </>
  );
};

export default JobApplications;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../NavBar/EmployerNavbar.jsx";

const EmployerApplications = () => {
  const [jobOffers, setJobOffers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobOffersResponse = await fetch(
          "http://localhost:9000/Employer/JobOffer/joboffers",
          {
            credentials: "include",
          }
        );
        if (jobOffersResponse.ok) {
          const jobOffersData = await jobOffersResponse.json();
          setJobOffers(jobOffersData);
        } else {
          console.error("Failed to fetch job offers");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const viewApplications = (jobOfferID) => {
    navigate(`/employer/applications/${jobOfferID}`);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  let filteredJobOffers = jobOffers.filter((jobOffer) =>
    jobOffer.Title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  console.log(filteredJobOffers);

  if (sortBy === "newest") {
    filteredJobOffers.sort((a, b) => new Date(b.DatePosted) - new Date(a.DatePosted));
  } else {
    filteredJobOffers.sort((a, b) => new Date(a.DatePosted) - new Date(b.DatePosted));
  }

  return (
    <>
      <Navbar></Navbar>
      <div>
        <h2 className="text-center  text-xl font-bold mt-4 text-blueColor">
          Jobs
        </h2>

        <div className="mt-7 relative overflow-x-auto shadow-md sm:rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center ml-4">
              <h3 className="text-center font-bold mt-4 mb-4 text-blueColor mr-2">Search</h3>
              <input
                type="text"
                placeholder="Search by job title"
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
            <table className="w-full text-sm text-left ">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Title
                </th>
                <th scope="col" className="px-6 py-3">
                  Description
                </th>
                <th scope="col" className="px-6 py-3">
                  Date Posted
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filteredJobOffers.map((jobOffer) => (
                <tr
                  className="odd:bg-white even:bg-gray-50 border-b"
                  key={jobOffer.JobOfferID}
                >
                  <td
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {jobOffer.Title}
                  </td>
                  <td
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {jobOffer.Description}
                  </td>
                  <td
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {new Date(jobOffer.DatePosted).toLocaleDateString("en-GB")}
                  </td>
                  <td
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {jobOffer.Status}
                  </td>
                  <td
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    <button
                      className="hover:underline text-blueColor"
                      onClick={() => viewApplications(jobOffer.JobOfferID)}
                    >
                      View Applications
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default EmployerApplications;

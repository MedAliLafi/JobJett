import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../NavBar/EmployerNavbar.jsx";

const EmployerApplications = () => {
  const [jobOffers, setJobOffers] = useState([]);
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
          // Map over job offers and format the date
          const formattedJobOffers = jobOffersData.map((jobOffer) => ({
            ...jobOffer,
            DatePosted: new Date(jobOffer.DatePosted).toLocaleDateString(
              "en-GB"
            ),
          }));
          setJobOffers(formattedJobOffers);
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

  return (
    <>
      <Navbar></Navbar>
      <div>
        <h2 className="text-center  text-xl font-bold mt-4 text-blueColor">
          Jobs
        </h2>

        <div className="mt-7 relative overflow-x-auto shadow-md sm:rounded-lg">
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
              {jobOffers.map((jobOffer) => (
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
                    {jobOffer.DatePosted}
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

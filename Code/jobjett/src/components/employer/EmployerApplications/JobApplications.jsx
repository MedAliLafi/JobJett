import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../NavBar/EmployerNavbar.jsx";

const JobApplications = () => {
  const { jobOfferID } = useParams();
  const [applications, setApplications] = useState([]);
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch(
          `http://localhost:9000/Employer/JobOffer/${jobOfferID}/applications`,
          {
            credentials: "include",
          }
        );
        if (response.ok) {
          const data = await response.json();
          setApplications(data.filter(app => app.Type === 'Applied'));
          setOffers(data.filter(app => app.Type === 'Offered'));
        } else {
          console.error(
            `Failed to fetch applications for job offer ${jobOfferID}`
          );
        }
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };

    fetchApplications();
  }, [jobOfferID]);

  return (
    <>
      <Navbar></Navbar>
      <div>
        {/* Display Applications Table */}
        {applications.length > 0 && (
          <div>
            <h2 className="text-center  text-xl font-bold mt-4 text-blueColor">
              Applications for Job Offer ID: {jobOfferID}
            </h2>
            <div className="mt-7 relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left ">
                {/* Table headers */}
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
                {/* Table body */}
                <tbody>
                  {applications.map((application) => (
                    <tr key={application.CandidateID} className="odd:bg-white even:bg-gray-50 border-b">
                      {/* Table data */}
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
          </div>
        )}

        {/* Display Offers Table */}
        {offers.length > 0 && (
          <div>
            <h2 className="text-center  text-xl font-bold mt-4 text-blueColor">
              Offers for Job Offer ID: {jobOfferID}
            </h2>
            <div className="mt-7 relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left ">
                {/* Table headers */}
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
                {/* Table body */}
                <tbody>
                  {offers.map((offer) => (
                    <tr key={offer.CandidateID} className="odd:bg-white even:bg-gray-50 border-b">
                      {/* Table data */}
                      <td
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                      >
                        {offer.CandidateID}
                      </td>
                      <td
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                      >
                        {offer.firstname}
                      </td>
                      <td
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                      >
                        {offer.lastname}
                      </td>
                      <td
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                      >
                        {offer.state}
                      </td>
                      <td
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                      >
                        {offer.country}
                      </td>
                      <td
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                      >
                        {new Date(offer.DateApplied).toLocaleDateString(
                          "en-GB"
                        )}
                      </td>
                      <td
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                      >
                        {offer.Status.includes("Interview Scheduled")
                          ? "Interview Scheduled"
                          : offer.Status}
                      </td>
                      <td
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                      >
                        <Link
                          to={`/employer/applications/${jobOfferID}/${offer.ApplicationID}`}
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
          </div>
        )}
      </div>
    </>
  );
};

export default JobApplications;

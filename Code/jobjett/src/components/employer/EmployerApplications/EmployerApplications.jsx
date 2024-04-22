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
    navigate(`/employer/application/${jobOfferID}`);
  };

  return (
    <>
      <Navbar></Navbar>
      <div>
        <h2>Employer Applications</h2>
        <table>
          <thead>
            <tr>
              <th>Job Offer ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Date Posted</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobOffers.map((jobOffer) => (
              <tr key={jobOffer.JobOfferID}>
                <td>{jobOffer.JobOfferID}</td>
                <td>{jobOffer.Title}</td>
                <td>{jobOffer.Description}</td>
                <td>{jobOffer.DatePosted}</td>
                <td>{jobOffer.Status}</td>
                <td>
                  <button onClick={() => viewApplications(jobOffer.JobOfferID)}>
                    View Applications
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

export default EmployerApplications;

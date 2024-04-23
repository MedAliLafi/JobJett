import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate,} from "react-router-dom";
import LandingPage from "./components/LandingPage/LandingPage.jsx";
import CandidateHomePage from "./components/candidate/CandidateHomePage/CandidateHomePage.jsx";
import CandidateLogin from "./components/candidate/CandidateLogin/CandidateLogin.jsx";
import CandidateRegister from "./components/candidate/CandidateRegister/CandidateRegister.jsx";
import CandidateProfile from "./components/candidate/CandidateProfile/CandidateProfile.jsx";
import CandidateApplications from "./components/candidate/CandidateApplications/CandidateApplications.jsx";
import Cv from "./components/candidate/Cv/Cv.jsx";
import JobOfferDetails from "./components/candidate/JobOfferDetails/JobOfferDetails.jsx";
import CandidateApplication from "./components/candidate/Application/Application.jsx";
import EmployerLogin from "./components/employer/EmployerLogin/EmployerLogin.jsx";
import EmployerRegister from "./components/employer/EmployerRegister/EmployerRegister.jsx";
import EmployerProfile from "./components/employer/EmployerProfile/EmployerProfile.jsx";
import EmployerApplications from "./components/employer/EmployerApplications/EmployerApplications.jsx";
import EmployerInterviews from "./components/employer/EmployerInterviews/EmployerInterviews.jsx";
import JobApplications from "./components/employer/EmployerApplications/JobApplications.jsx"
import JobApplication from "./components/employer/EmployerApplications/JobApplication.jsx";
import AddJobOffer from "./components/employer/AddJobOffer/AddJobOffer.jsx";

function App() {
  // Retrieve authentication status from local storage or default to false
  const [isCandidateAuthenticated, setIsCandidateAuthenticated] = useState(
    localStorage.getItem("isCandidateAuthenticated") === "true" || false
  );
  const [isEmployerAuthenticated, setIsEmployerAuthenticated] = useState(
    localStorage.getItem("isEmployerAuthenticated") === "true" || false
  );

  // Fetch authentication status for candidate and employer
  useEffect(() => {
    const fetchCandidateAuthStatus = async () => {
      try {
        const response = await fetch(
          "http://localhost:9000/Candidate/loginCandidate/checkCandidateAuth",
          {
            credentials: "include",
          }
        );
        if (response.ok) {
          const data = await response.json();
          setIsCandidateAuthenticated(data.loggedIn);
          // Store authentication status in local storage
          localStorage.setItem("isCandidateAuthenticated", data.loggedIn);
        }
      } catch (error) {
        console.error("Error checking candidate authentication:", error);
      }
    };

    const fetchEmployerAuthStatus = async () => {
      try {
        const response = await fetch(
          "http://localhost:9000/Employer/loginEmployer/checkEmployerAuth",
          {
            credentials: "include",
          }
        );
        if (response.ok) {
          const data = await response.json();
          setIsEmployerAuthenticated(data.loggedIn);
          // Store authentication status in local storage
          localStorage.setItem("isEmployerAuthenticated", data.loggedIn);
        }
      } catch (error) {
        console.error("Error checking employer authentication:", error);
      }
    };

    fetchCandidateAuthStatus();
    fetchEmployerAuthStatus();
  }, []);

  // Higher-order component to protect routes for candidates
  const withCandidateProtection = (Component) => {
    return isCandidateAuthenticated ? (
      Component
    ) : (
      <Navigate to="/candidate/login" />
    );
  };

  // Higher-order component to protect routes for employers
  const withEmployerProtection = (Component) => {
    return isEmployerAuthenticated ? (
      Component
    ) : (
      <Navigate to="/employer/login" />
    );
  };

  return (
    <Router>
      <div>
        <Routes>
          <Route exact path="/" element={<LandingPage />} />
          <Route path="/candidate/login" element={<CandidateLogin />} />
          <Route path="/candidate/register" element={<CandidateRegister />} />
          <Route
            path="/candidate"
            element={withCandidateProtection(<CandidateHomePage />)}
          />
          <Route
            path="/candidate/profile"
            element={withCandidateProtection(<CandidateProfile />)}
          />
          <Route
            path="/candidate/cv"
            element={withCandidateProtection(<Cv />)}
          />
          <Route
            path="/candidate/applications"
            element={withCandidateProtection(<CandidateApplications />)}
          />
          <Route
            path="/candidate/joboffer/:jobofferId"
            element={withCandidateProtection(<JobOfferDetails />)}
          />
          <Route
            path="/candidate/application"
            element={withCandidateProtection(<CandidateApplication />)}
          />
          <Route path="/employer/login" element={<EmployerLogin />} />
          <Route path="/employer/register" element={<EmployerRegister />} />
          <Route
            path="/employer/profile"
            element={withEmployerProtection(<EmployerProfile />)}
          />
          <Route
            path="/employer/addjoboffer"
            element={withEmployerProtection(<AddJobOffer />)}
          />
          <Route
            path="/employer/interviews"
            element={withEmployerProtection(<EmployerInterviews />)}
          />
          <Route
            path="/employer/applications"
            element={withEmployerProtection(<EmployerApplications />)}
          />
          <Route
            path="/employer/applications/:jobOfferID"
            element={withEmployerProtection(<JobApplications />)}
          />
          <Route
            path="/employer/applications/:jobOfferID/:applicationID"
            element={withEmployerProtection(<JobApplication />)}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

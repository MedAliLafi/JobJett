import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage/LandingPage.jsx';
import CandidateLogin from './components/candidate/CandidateLogin.jsx';
import CandidateRegister from './components/candidate/CandidateRegister.jsx';
import CandidateProfile from './components/candidate/CandidateProfile.jsx';
import CandidateApplications from './components/candidate/CandidateApplications.jsx';
import Cv from './components/candidate/Cv.jsx';
import JobOfferDetails from './components/candidate/JobOfferDetails.jsx';
import Application from './components/candidate/Application.jsx';
import EmployerLogin from './components/employer/EmployerLogin.jsx';
import EmployerRegister from './components/employer/EmployerRegister.jsx';
import EmployerProfile from './components/employer/EmployerProfile.jsx';
import EmployerApplications from './components/employer/EmployerApplications.jsx';
import AddJobOffer from './components/employer/AddJobOffer.jsx';

function App() {
  // Retrieve authentication status from local storage or default to false
  const [isCandidateAuthenticated, setIsCandidateAuthenticated] = useState(localStorage.getItem('isCandidateAuthenticated') === 'true' || false);
  const [isEmployerAuthenticated, setIsEmployerAuthenticated] = useState(localStorage.getItem('isEmployerAuthenticated') === 'true' || false);

  // Fetch authentication status for candidate and employer
  useEffect(() => {
    const fetchCandidateAuthStatus = async () => {
      try {
        const response = await fetch('http://localhost:9000/Candidate/loginCandidate/checkCandidateAuth', {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          setIsCandidateAuthenticated(data.loggedIn);
          // Store authentication status in local storage
          localStorage.setItem('isCandidateAuthenticated', data.loggedIn);
        }
      } catch (error) {
        console.error('Error checking candidate authentication:', error);
      }
    };

    const fetchEmployerAuthStatus = async () => {
      try {
        const response = await fetch('http://localhost:9000/Employer/loginEmployer/checkEmployerAuth', {
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          setIsEmployerAuthenticated(data.loggedIn);
          // Store authentication status in local storage
          localStorage.setItem('isEmployerAuthenticated', data.loggedIn);
        }
      } catch (error) {
        console.error('Error checking employer authentication:', error);
      }
    };

    fetchCandidateAuthStatus();
    fetchEmployerAuthStatus();
  }, []);

  // Higher-order component to protect routes for candidates
  const withCandidateProtection = (Component) => {
    return isCandidateAuthenticated ? Component : <Navigate to="/candidate/login" />;
  };

  // Higher-order component to protect routes for employers
  const withEmployerProtection = (Component) => {
    return isEmployerAuthenticated ? Component : <Navigate to="/employer/login" />;
  };

  return (
    <Router>
      <div>
        <Routes>
          <Route exact path="/" element={<LandingPage />} />
          <Route path="/candidate/login" element={<CandidateLogin />} />
          <Route path="/candidate/register" element={<CandidateRegister />} />
          <Route path="/candidate/profile" element={withCandidateProtection(<CandidateProfile />)} />
          <Route path="/candidate/cv" element={withCandidateProtection(<Cv />)} />
          <Route path="/candidate/applications" element={withCandidateProtection(<CandidateApplications />)} />
          <Route path="/candidate/joboffer/:jobofferId" element={withCandidateProtection(<JobOfferDetails />)} />
          <Route path="/candidate/application" element={withCandidateProtection(<Application />)} />
          <Route path="/employer/login" element={<EmployerLogin />} />
          <Route path="/employer/register" element={<EmployerRegister />} />
          <Route path="/employer/profile" element={withEmployerProtection(<EmployerProfile />)} />
          <Route path="/employer/addjoboffer" element={withEmployerProtection(<AddJobOffer />)} />
          <Route path="/employer/applications" element={withEmployerProtection(<EmployerApplications />)} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

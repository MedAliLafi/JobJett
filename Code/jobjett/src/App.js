import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home.js';
import CandidateLogin from './components/candidate/CandidateLogin.js';
import CandidateRegister from './components/candidate/CandidateRegister.js';
import CandidateProfile from './components/candidate/CandidateProfile.js';
import Cv from './components/candidate/Cv.js';
import CandidateApplications from './components/candidate/CandidateApplications';
import JobOfferDetails from './components/candidate/JobOfferDetails';
import Application from './components/candidate/Application';

import './App.css';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/candidate" element={<CandidateLogin />} />
          <Route path="/candidate/login" element={<CandidateLogin />} />
          <Route path="/candidate/register" element={<CandidateRegister />} />
          <Route path="/candidate/profile" element={<CandidateProfile />} />
          <Route path="/candidate/cv" element={<Cv />} />
          <Route path="/candidate/applications" element={<CandidateApplications />} />
          <Route path="/candidate/joboffer/:jobofferId" element={<JobOfferDetails />} />
          <Route path="/candidate/application" element={<Application />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

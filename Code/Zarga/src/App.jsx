import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import CandidatePage from "./CondidatePage/CandidatePage";
import LandingPage from "./LandingPage/LandingPage";
import ResumePage from "./CondidatePage/ResumePage/ResumePage";
import ApplicationsPage from "./CondidatePage/Applications/ApplicationsPage";
import CompanySign from "./Auth/CompanySignup/CompanySign";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/candidate" element={<CandidatePage />} />
        <Route path="/candidate/resume" element={<ResumePage />} />
        <Route path="/candidate/applications" element={<ApplicationsPage />} />
        <Route path="/candidate/profile" element={<ApplicationsPage />} />
        <Route path="/Sign-up/Company" element={<CompanySign />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

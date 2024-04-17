import "./CandidateNavbar.css";
import logo from "../../../assets/output-onlinetools.png";
import profile from "../../../assets/profileIcon.png";
import { Link } from "react-router-dom";
function candidateNavbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <a>
        <Link to="/">
          <img src={logo} alt="" className="logo"></img>
          </Link>
        </a>
      </div>
      <div className="nav-links">
        <ul>
          <li>
            <Link to="/candidate">Browse job offers</Link>
          </li>
          <li>
            <Link to="/candidate/cv">Build your resume</Link>
          </li>
          <li>
            <Link to="/candidate/applications">Applications</Link>
          </li>
        </ul>
      </div>
      <Link to="/candidate/profile">
        <img src={profile} className="profileIcon" />
      </Link>
    </nav>
  );
}

export default candidateNavbar;

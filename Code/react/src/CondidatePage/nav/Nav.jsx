import "./nav.css";
import logo from "../../assets/output-onlinetools.png";
import profile from "../../assets/profileIcon.png";
import { Link } from "react-router-dom";
function Nav() {
  return (
    <nav className="navbar">
      <div className="logo">
        <a href="" to="/">
          <img src={logo} alt="" className="logo"></img>
        </a>
      </div>
      <div className="nav-links">
        <ul className="">
          <li className="">
            <Link to="/Candidate">Find a Job</Link>
          </li>
          <li className="">
            <Link to="/Candidate/resume">Resume</Link>
          </li>
          <li className="">
            <Link to="/Candidate/applications">Applications</Link>
          </li>
        </ul>
      </div>
      <a href="" to="/Contact">
        <img src={profile} className="profileIcon" />
      </a>
    </nav>
  );
}

export default Nav;

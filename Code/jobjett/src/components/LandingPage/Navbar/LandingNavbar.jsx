import { HashLink } from "react-router-hash-link";
import logo from "../../../assets/output-onlinetools.png";
import "./Navbar.css";

function LandingNavbar() {
  return (
    <nav className="navbar">
      <HashLink to="/">
        <img src={logo} alt="" className="logo"></img>
      </HashLink>
      <ul className="nav-links">
        <li className="">
          <HashLink smooth to="#get-job">
            Get job
          </HashLink>
        </li>
        <li className="">
          <HashLink smooth to="#post-job">
            Post a job
          </HashLink>
        </li>
        <li className="">
          <HashLink smooth to="#build-resume">
            Build your resume
          </HashLink>
        </li>
        <li className="">
          <HashLink smooth to="/SignUp">
            About us
          </HashLink>
        </li>
        <li className="">
          <HashLink smooth to="/Contact">
            Contact us
          </HashLink>
        </li>
      </ul>
    </nav>
  );
}

export default LandingNavbar;

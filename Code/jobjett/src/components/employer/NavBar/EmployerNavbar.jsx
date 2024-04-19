import "./EmployerNavbar.css";
import logo from "../../../assets/output-onlinetools.png";
import profile from "../../../assets/profileIcon.png";
import { Link } from "react-router-dom";
function EmployerNavbar() {
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
            <Link to="/employer">Find employees</Link>
          </li>
          <li>
            <Link to="/employer/addjoboffer">Post a job</Link>
          </li>
          <li>
            <Link to="/employer/applications">Applications</Link>
          </li>
          <li>
            <Link to="/employer/interviews">Interviews</Link>
          </li>
        </ul>
      </div>
      <Link to="/employer/profile">
        <img src={profile} className="profileIcon" />
      </Link>
    </nav>
  );
}

export default EmployerNavbar;

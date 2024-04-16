import "./EmployerNavbar.css";
import logo from "../../assets/output-onlinetools.png";
import profile from "../../assets/profileIcon.png";
import { Link } from "react-router-dom";
function EmployerNavbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="" className="logo"></img>
        </Link>
      </div>
      <div className="nav-links">
        <ul className="/employer/Home">
          <li className="">
            <Link to="/employer/Home">Find employees</Link>
          </li>
          <li className="">
            <Link to="/employer/addjoboffer">Post a job</Link>
          </li>
          <li className="">
            <Link to="/employer/applications">Applications</Link>
          </li>
        </ul>
      </div>
      <Link to="/employer/profile    ">
        <img src={profile} className="profileIcon" />
      </Link>
    </nav>
  );
}

export default EmployerNavbar;

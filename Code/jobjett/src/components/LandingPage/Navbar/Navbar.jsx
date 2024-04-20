import logo from "../../../assets/output-onlinetools.png";
import { Link } from "react-router-dom";
import "./Navbar.css";

function LandingNavbar() {
  return (
    <>
      <nav className="navbar">
        <Link to="/">
          <img src={logo} alt="" className="logo"></img>
        </Link>
        <ul className="nav-links">
          <li className="">
            <Link to="/candidate/login" >
              Get job
            </Link>
          </li>
          <li className="">
            <Link to="/employer/login" >
              Post a job
            </Link>
          </li>
          <li className="">
            <Link to="/candidate/login" >
              Build your resume
            </Link>
          </li>
          <li className="">
            <Link to="/aboutus">
              About us
            </Link>
          </li>
          <li className="">
            <Link to="/contact">
              Contact us
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default LandingNavbar;

import "../../CondidatePage/nav/nav.css";
import logo from "../../assets/output-onlinetools.png";
import { HashLink } from "react-router-hash-link";

function LandingNavbar() {
  return (
    <>
      <nav className="navbar">
        <HashLink to="/">
          <img src={logo} alt="" className="logo"></img>
        </HashLink>
        <ul className="nav-links">
          <li className="">
            <HashLink smooth to="#GetJob">
              Get job
            </HashLink>
          </li>
          <li className="">
            <HashLink smooth to="/#FindJob">
              Post a job
            </HashLink>
          </li>
          <li className="">
            <HashLink smooth to="/#2">
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
    </>
  );
}

export default LandingNavbar;

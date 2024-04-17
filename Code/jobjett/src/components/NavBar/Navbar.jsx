import "./Navbar.css";
import { Link } from "react-router-dom";
import logo from "../../assets/output-onlinetools.png";
import profile from "../../assets/profileIcon.png";
function Nav() {
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
        <ul className="">
          <li className="">
            <a><Link to="/candidate/login" className="btn">Candidates</Link></a>
          </li>
          <li className="">
            <a><Link to="/employer/login" className="btn">Employers</Link></a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Nav;
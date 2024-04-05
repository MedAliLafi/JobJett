import "./Navbar.css";
import logo from "../../assets/output-onlinetools.png";
import profile from "../../assets/profileIcon.png";
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
            <a href="" to="#GetJob">
              Find a Job
            </a>
          </li>
          <li className="">
            <a href="" to="/#FindJob">
              Resume
            </a>
          </li>
          <li className="">
            <a href="" to="/#2">
              Applications
            </a>
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

import { Link } from "react-router-dom";
import "./left.css";
// import image from "../../assets/HR-careers-01.png";

function Left(props) {
  return (
    <div className="second-page" id="get-job">
      <div className="divide">
        <img src={props.image} className="left" alt="" />
        <div className="container">
          <h1>{props.title}</h1>
          <p className="text-box2">sas{props.parg}</p>
          <Link to="/SignUp" className="btn">
            Start now
          </Link>
        </div>
      </div>
    </div>
  );
}
export default Left;

/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import "./left.css";
// import image from "../../assets/HR-careers-01.png";

function Left(props) {
  return (
    <div className="second-page" id={props.id}>
      <div className="divide">
        <img src={props.image} className="left" alt="" />
        <div className="container">
          <h1>{props.title}</h1>
          <p className="text-box2">{props.parg}</p>
          <Link to="/candidate/login" className="btn">
            Start now
          </Link>
        </div>
      </div>
    </div>
  );
}
export default Left;

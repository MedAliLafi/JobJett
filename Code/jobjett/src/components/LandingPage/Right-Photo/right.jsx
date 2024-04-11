/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import "./Right.css";
function Right(props) {
  return (
    <div className="third-page" id="post-job">
      <div className="divide">
        <div className="container">
          <h1>{props.title}</h1>
          <p className="text-box2">{props.parg}</p>
          <Link to="/employer/login" className="btn">
            Start now
          </Link>
        </div>
        <img src={props.image} className="right" alt="" />
      </div>
    </div>
  );
}
export default Right;

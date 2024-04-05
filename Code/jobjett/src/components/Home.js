import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <h2>Welcome to the Job Portal</h2>
      <Link to="/employer/login"><button>Employer</button></Link>
      <Link to="/candidate/login"><button>Candidate</button></Link>
    </div>
  );
};

export default Home;

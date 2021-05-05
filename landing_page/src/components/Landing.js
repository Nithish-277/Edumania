import React from 'react'
import {Link} from 'react-router-dom';


const Landing = () => {
    return (
      <section className="landing">
        <div className="dark-overlay">
          <div className="landing-inner">
            <h1 className="x-large">Educational Platform</h1>
            <p className="lead">
              Now you can pay your fees and search for the schools nearby in no
              time
            </p>
            <div className="buttons">
              <Link to="/register" className="btn btn-primary">
                Sign Up
              </Link>
              <Link to="/login" className="btn btn-light">
                Login
              </Link>
              <Link to="/findSchools" className="btn btn-light">
                Pay Fee
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
};

export default Landing;

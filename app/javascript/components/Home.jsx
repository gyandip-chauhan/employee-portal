import React from "react";
import { Link } from "react-router-dom";

const HomePage = ({ userData }) => (
  <main className="d-flex flex-column flex-grow-1">
    <div className="container-fluid my-3">
      <div className="container-fluid bg-primary text-light py-5">
        <div className="row justify-content-center align-items-center">
          <div className="col-md-8">
            <h1 className="display-4 text-center mb-4">Employee Directory</h1>
              <p className="lead text-center">
                Employee Directory is your people enabler. From automation of people processes to creating an engaged and driven culture, Employee Directory is all you need to build a good to great company.
              </p>
              <hr className="my-4" />
              <div className="text-center">
                <Link to={userData ? "/attendance" : "/login"} className="btn btn-lg btn-light">
                  Explore Directory
                </Link>
              </div>
          </div>
        </div>
      </div>
    </div>
  </main>
);

export default HomePage;

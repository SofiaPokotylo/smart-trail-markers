  import React from "react";
  import { NavLink, useNavigate } from "react-router-dom";
  import { FaAlignRight } from "react-icons/fa";

  const Navbar = () => {
    const navigate = useNavigate();

    return (
      <>
        <nav className="navbar navbar-expand-sm navbar-dark bg-transparent py-2 fixed-top scrolled">
          <div className="container-fluid ">
            <span
              className="navbar-brand font-weight-bolder"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/")}
            >
              Smart Trail Markers
            </span>
            <a
              href="void(0)"
              className="navbar-toggler border-0"
              data-toggle="collapse"
              data-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span>
                <FaAlignRight className="nav-icon" />
              </span>
            </a>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    exact="true"
                    to="/"
                  >
                    Головна
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    exact="true"
                    to="/conditions"
                  >
                    Інформація
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    exact="true"
                    to="/about"
                  >
                    Маршрути
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    exact="true"
                    to="/contact-us"
                  >
                    Контакти
                  </NavLink>
                </li>

                    <li>
                      <NavLink
                        className="nav-link"
                        exact="true"
                        to="/signin"
                      >
                        <button type="button" className="btn btn-outline-success">
                          Log in
                        </button>
                      </NavLink>
                    </li>
              </ul>
            </div>
          </div>
        </nav>
      </>
    );
  };
  export default Navbar;

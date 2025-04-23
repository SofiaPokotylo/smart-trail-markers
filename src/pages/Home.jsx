import React from "react";
import Hero from "../Components/Hero";
import Banner from "../Components/Banner";
import { Link } from "react-router-dom";
import Services from "../Components/Services";

const Home = () => {
  return (
    <>
      <Hero hero="defaultHero"></Hero>
      <Banner title="Smart Trail Markers">
        <Link to="/conditions" className="btn btn-primary">
          Інформація про умови
        </Link>
          </Banner>
          <Services />
    </>
  );
};

export default Home;

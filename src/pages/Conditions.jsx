import React from "react";
import Hero from "../Components/Hero";
import Banner from "../Components/Banner";
import { Link } from "react-router-dom";
import { useState } from 'react';
import Dashboard3 from './Dashboard_Weather';

const Conditions = () => {
  const [pickedDate, setPickedDate] = useState(null);
  const [pickedTime, setPickedTime] = useState(null);

  function changeDateData(event) {
    setPickedDate(event.target.value);
  }

  function changeTimeData(event) {
    const pickedTime = event.target.value;
    const modifiedTime = pickedTime.endsWith(':00') ? pickedTime : pickedTime.slice(0, -3) + ':00'; setPickedTime(modifiedTime);
  }

  let dashboard;
  dashboard = <Dashboard3 pickedDate={pickedDate} pickedTime={pickedTime} />;

  return (
    <div className = "conditions">
      <Hero hero="routesHero"></Hero>
      <Banner title="Погодні Умови" subtitle="Відвідуваність">
        <Link to="/" className="btn btn-primary">
          На головну
        </Link>
      </Banner>
       <h2 className="display-4 text-center my-5">Виберіть дату та час</h2>
      <div className="container my-5">
        <div className="row">
          <div className="col-md-6">
            <label htmlFor="date" className="label-date">Дата:</label>
            <input
              type="date"
              id="date"
              className="form-control"
              onChange={changeDateData}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="time" className="label-date">Час:</label>
            <input
              type="time"
              id="time"
              className="form-control"
              onChange={changeTimeData}
            />
          </div>
        </div>
        {dashboard}
      </div>
    </div>
  );
};

export default Conditions;

import React from "react";
import svg from "../images/2.jpg"
import marker1 from "../images/3.png"
import marker2 from "../images/4.png"
import marker3 from "../images/5.png"
import marker4 from "../images/6.png"
import marker5 from "../images/7.png"
import marker6 from "../images/8.png"
import Title from './Title';
import Dashboard from './Dashboard_Trail_data';
import { useState, useEffect } from 'react';


function About() {
  let num = 1;
  let route = 1;
  const [markerData, setMarkerData] = useState(null);
  useEffect(() => {
    getMarkers();
  }, []);
  function getMarkers() {
    fetch('http://localhost:3001/markers-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ route })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(markerData => {
        setMarkerData(markerData);
      })
      .catch(error => {
        console.error('Error retrieving last date:', error);
      });
  }

let dashboard;
  dashboard = <Dashboard num = {num} />;

  return (
    <div className="all">
    <div className="container aboutus">
    <Title className="routes-title" title="Маршрути" />
    <div className="grofa">
    <h1 className="display-4 text-center my-5">Маршрут на гору Грофа </h1>
    </div>
      <div className="row">
        <div className="col-md-4 col-12 my-auto">
          <img
            src={svg}
            alt="about us"
            className="img-fluid"
          />
        </div>
        <div className="col-md-8 col-12 my-auto">
        <div className="text">
          <p className="lead text-justify text-center">
            Маршрут починається із села Осмолода та завершується на вершині гори Грофа.
            Сюди можна вирушити в одноденний або дводенний похід. Вздовж стежки встановлено 6 маркерів.
          </p>
          </div>
          {dashboard}
        </div>
      </div>
      <div className="testimony">
        <h1 className="display-4 text-center mb-4">Маркери</h1>
        <div className="row mb-5">
          <div className="col-md-14 col-12 mx-auto">
            <div
              id="carouselExampleCaptions"
              className="carousel slide"
              data-ride="carousel"
            >
              <ol className="carousel-indicators">
                <li
                  data-target="#carouselExampleCaptions"
                  data-slide-to="0"
                  className="active"
                ></li>
                <li
                  data-target="#carouselExampleCaptions"
                  data-slide-to="1"
                ></li>
                <li
                  data-target="#carouselExampleCaptions"
                  data-slide-to="2"
                ></li>
                <li
                  data-target="#carouselExampleCaptions"
                  data-slide-to="3"
                ></li>
              </ol>
              <div className = "general">
              <div className="carousel-inner card border-0 shadow-lg p-4">
                <div className="carousel-item active text-center">
                  <div className="row">
                    <div className="col-md-8 col-12 my-auto">
                      <img
                        src={marker1}
                        className="text-center img-fluid"
                        width="650"
                        height="400"
                        alt="customer1"
                      />
                    </div>
                    <div className="col-md-4 col-12 my-auto">
                      <div className="text-dark">
                      {markerData ? (
                        <h1 className="font-weight-bolder ">{markerData.rows[0].MARKER_ID}</h1>
                        ) : (
                        <h1 className="font-weight-bolder ">Маркер 1</h1>
                        )}
                        <h2>Тип</h2>
                        <h3>
                        {markerData ? (
                        <p>{markerData.rows[0].type}</p>
                        ) : (
                        <p>Відсутні дані</p>
                        )}
                        </h3>
                        <h2>Статус</h2>
                        <h3>
                        {markerData ? (
                        <p>{markerData.rows[0].STATUS}</p>
                        ) : (
                        <p>Відсутні дані</p>
                        )}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="carousel-item text-center">
                  <div className="row">
                    <div className="col-md-8 col-12 my-auto">
                      <img
                        src={marker2}
                        className="text-center img-fluid"
                        width="650"
                        height="400"
                        alt="customer2"
                      />
                    </div>
                    <div className="col-md-4 col-12 my-auto">
                      <div className="text-dark">
                        {markerData ? (
                        <h1 className="font-weight-bolder ">{markerData.rows[1].MARKER_ID}</h1>
                        ) : (
                        <h1 className="font-weight-bolder ">Маркер 2</h1>
                        )}
                        <h2>Тип</h2>
                        <h3>
                        {markerData ? (
                        <p>{markerData.rows[1].type}</p>
                        ) : (
                        <p>Відсутні дані</p>
                        )}
                        </h3>
                        <h2>Статус</h2>
                        <h3>
                        {markerData ? (
                        <p>{markerData.rows[1].STATUS}</p>
                        ) : (
                        <p>Відсутні дані</p>
                        )}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="carousel-item text-center">
                  <div className="row">
                    <div className="col-md-8 col-12 my-auto">
                      <img
                        src={marker3}
                        className="text-center img-fluid"
                        width="650"
                        height="400"
                        alt="customer3"
                      />
                    </div>
                    <div className="col-md-4 col-12 my-auto">
                      <div className="text-dark">
                        {markerData ? (
                        <h1 className="font-weight-bolder ">{markerData.rows[2].MARKER_ID}</h1>
                        ) : (
                        <h1 className="font-weight-bolder ">Маркер 3</h1>
                        )}
                        <h2>Тип</h2>
                        <h3>
                        {markerData ? (
                        <p>{markerData.rows[2].type}</p>
                        ) : (
                        <p>Відсутні дані</p>
                        )}
                        </h3>
                        <h2>Статус</h2>
                        <h3>
                        {markerData ? (
                        <p>{markerData.rows[2].STATUS}</p>
                        ) : (
                        <p>Відсутні дані</p>
                        )}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="carousel-item text-center">
                  <div className="row">
                    <div className="col-md-8 col-12 my-auto">
                      <img
                        src={marker4}
                        className="text-center img-fluid"
                        width="650"
                        height="400"
                        alt="customer4"
                      />
                    </div>
                    <div className="col-md-4 col-12 my-auto">
                      <div className="text-dark">
                        {markerData ? (
                        <h1 className="font-weight-bolder ">{markerData.rows[3].MARKER_ID}</h1>
                        ) : (
                        <h1 className="font-weight-bolder ">Маркер 4</h1>
                        )}
                        <h2>Тип</h2>
                        <h3>
                        {markerData ? (
                        <p>{markerData.rows[3].type}</p>
                        ) : (
                        <p>Відсутні дані</p>
                        )}
                        </h3>
                        <h2>Статус</h2>
                        <h3>
                        {markerData ? (
                        <p>{markerData.rows[3].STATUS}</p>
                        ) : (
                        <p>Відсутні дані</p>
                        )}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="carousel-item text-center">
                  <div className="row">
                    <div className="col-md-8 col-12 my-auto">
                      <img
                        src={marker5}
                        className="text-center img-fluid"
                        width="650"
                        height="400"
                        alt="customer4"
                      />
                    </div>
                    <div className="col-md-4 col-12 my-auto">
                      <div className="text-dark">
                        {markerData ? (
                        <h1 className="font-weight-bolder ">{markerData.rows[4].MARKER_ID}</h1>
                        ) : (
                        <h1 className="font-weight-bolder ">Маркер 5</h1>
                        )}
                       <h2>Тип</h2>
                        <h3>
                        {markerData ? (
                        <p>{markerData.rows[4].type}</p>
                        ) : (
                        <p>Відсутні дані</p>
                        )}
                        </h3>
                        <h2>Статус</h2>
                        <h3>
                        {markerData ? (
                        <p>{markerData.rows[4].STATUS}</p>
                        ) : (
                        <p>Відсутні дані</p>
                        )}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="carousel-item text-center">
                  <div className="row">
                    <div className="col-md-8 col-12 my-auto">
                      <img
                        src={marker6}
                        className="text-center img-fluid"
                        width="650"
                        height="400"
                        alt="customer4"
                      />
                    </div>
                    <div className="col-md-4 col-12 my-auto">
                      <div className="text-dark">
                        {markerData ? (
                        <h1 className="font-weight-bolder ">{markerData.rows[5].MARKER_ID}</h1>
                        ) : (
                        <h1 className="font-weight-bolder ">Маркер 6</h1>
                        )}
                        <h2>Тип</h2>
                        <h3>
                        {markerData ? (
                        <p>{markerData.rows[5].type}</p>
                        ) : (
                        <p>Відсутні дані</p>
                        )}
                        </h3>
                        <h2>Статус</h2>
                        <h3>
                        {markerData ? (
                        <p>{markerData.rows[5].STATUS}</p>
                        ) : (
                        <p>Відсутні дані</p>
                        )}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              </div>
              <a
                className="carousel-control-prev"
                href="#carouselExampleCaptions"
                role="button"
                data-slide="prev"
              >
                <span
                  className="carousel-control-prev-icon"
                  aria-hidden="true"
                ></span>
                <span className="sr-only">Previous</span>
              </a>
              <a
                className="carousel-control-next"
                href="#carouselExampleCaptions"
                role="button"
                data-slide="next"
              >
                <span
                  className="carousel-control-next-icon"
                  aria-hidden="true"
                ></span>
                <span className="sr-only">Next</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
export default About;

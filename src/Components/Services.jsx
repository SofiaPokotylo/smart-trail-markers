import React from 'react'
import { FaBriefcaseMedical, FaHiking, FaBullhorn, FaCloudSunRain } from "react-icons/fa";
import Title from './Title';

const Services = () => {
    const service = {
      services: [
        {
          icon: <FaBriefcaseMedical />,
          title: "Безпека",
          info: "Команда проекту співпрацює з рятувальними службами. У випадку зникнення туристів, система зробить усе можливе для їх пошуку.",
        },
        {
          icon: <FaHiking />,
          title: "Зручна навігація",
          info: "Віднині кожен турист може переглянути всю інформацію про маршрут на сайті. Крім того, навігація нині простіша з використанням мобільного додатку, що надає підказки вздовж маршруту в офлайн режимі.",
        },
        {
          icon: <FaBullhorn />,
          title: "Попередження",
          info: "У випадку небезпеки(гроза, лавина, падіння каміння) на сайті та в мобільних додатках негайно відображається Застереження.",
        },
        {
          icon: <FaCloudSunRain />,
          title: "Погодні умови",
          info: "На даному сайті у вас є можливість спланувати свій маршрут відповідно до погодніх умов на ньому. Загальна інформація по маршруту, а також по кожному маркеру знаходиться на сторінці Умови",
        },
      ],
    };
    return (
      <div className="container-fluid services">
        <Title title="Можливості" />
        <div className="row">
          {service.services.map((item, index) => {
            return (
              <div
                className="col-md-4 col-lg-3 col-12 mx-auto my-3"
                key={index}
              >
                <div className="card shadow-lg border-0 p-4">
                  <article className="service">
                    <span>{item.icon}</span>
                    <h6>{item.title}</h6>
                    <p>{item.info}</p>
                  </article>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
}

export default Services

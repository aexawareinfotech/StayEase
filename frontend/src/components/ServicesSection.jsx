import React from "react";
import { FaWifi, FaSwimmingPool, FaUtensils, FaSpa } from "react-icons/fa";

function ServicesSection() {
  const services = [
    { icon: <FaWifi />, title: "Free Wifi" },
    { icon: <FaSwimmingPool />, title: "Pool Access" },
    { icon: <FaUtensils />, title: "Fine Dining" },
    { icon: <FaSpa />, title: "Luxury Spa" },
  ];

  return (
    <section className="services-section py-5 bg-light text-center">
      <div className="container">
        <h6 className="text-warning">WHAT WE DO</h6>
        <h2 className="fw-bold mb-5">Discover Our Services</h2>

        <div className="row">
          {services.map((service, index) => (
            <div key={index} className="col-md-3 mb-4">
              <div className="service-card p-4">
                <div className="service-icon mb-3">
                  {service.icon}
                </div>
                <h5>{service.title}</h5>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ServicesSection;
import React from "react";
import aboutImg from "../assets/image2.png";

function AboutSection() {
  return (
    <section className="about-section py-5">
      <div className="container">
        <div className="row align-items-center">

          <div className="col-lg-6">
            <img src={aboutImg} alt="Hotel" className="img-fluid rounded shadow" />
          </div>

          <div className="col-lg-6">
            <h6 className="text-warning">ABOUT US</h6>
            <h2 className="fw-bold mb-3">
              StayEase Luxury Experience
            </h2>
            <p className="text-muted">
              Experience world-class comfort and premium services
              designed for unforgettable stays.
            </p>
            <button className="btn btn-warning mt-3">
              Read More
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}

export default AboutSection;
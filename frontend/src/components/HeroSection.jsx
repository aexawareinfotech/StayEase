import React, { useState, useEffect } from "react";
import "./HeroSection.css";
import heroImage1 from "../assets/image1.png";
import heroImage2 from "../assets/image2.png";
function HeroSection() {
  const [formData, setFormData] = useState({
    checkIn: "",
    checkOut: "",
    guests: "2 Adults",
  });
  const images = [heroImage1, heroImage2];

const [currentIndex, setCurrentIndex] = useState(0);

useEffect(() => {
  const interval = setInterval(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  }, 5000); // change every 5 seconds

  return () => clearInterval(interval);
}, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    console.log("Form Data:", formData);
  };

  return (
    <div
      className="hero-container"
      style={{
        backgroundImage: `url(${images[currentIndex]})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="container-fluid px-0">
        <div className="row align-items-center min-vh-100 px-5">

          {/* Left Side */}
          <div className="col-lg-6 text-white">
            <h1 className="display-4 fw-bold">
              StayEase – A Luxury Hotel
            </h1>
            <p className="lead">
              Discover comfort, elegance, and seamless booking experience.
            </p>
            <button className="btn btn-light mt-3">
              Discover Now
            </button>
          </div>

          {/* Right Side Booking Card */}
          <div className="col-lg-4 ms-auto me-5">
            <div className="booking-card p-4">

              <h4 className="mb-4 fw-semibold">
                Book Your Stay
              </h4>

              <div className="mb-3">
                <label>Check In</label>
                <input
                  type="date"
                  name="checkIn"
                  value={formData.checkIn}
                  onChange={handleChange}
                  className="form-control custom-input"
                />
              </div>

              <div className="mb-3">
                <label>Check Out</label>
                <input
                  type="date"
                  name="checkOut"
                  value={formData.checkOut}
                  onChange={handleChange}
                  className="form-control custom-input"
                />
              </div>

              <div className="mb-4">
                <label>Guests</label>
                <select
                  name="guests"
                  value={formData.guests}
                  onChange={handleChange}
                  className="form-select custom-input"
                >
                  <option>1 Adult</option>
                  <option>2 Adults</option>
                  <option>3 Adults</option>
                  <option>4 Adults</option>
                </select>
              </div>

              <button
                className="btn custom-btn w-100"
                onClick={handleSubmit}
              >
                Check Availability
              </button>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default HeroSection;
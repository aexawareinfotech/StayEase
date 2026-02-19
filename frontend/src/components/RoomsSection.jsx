import React from "react";
import "./RoomsSection.css";
import room1 from "../assets/image1.png";
import room2 from "../assets/image2.png";

function RoomsSection() {
  const rooms = [
    { image: room1, title: "Premium Room", price: 12999 },
    { image: room2, title: "Deluxe Room", price: 15999 },
  ];

  return (
    <section className="rooms-section py-5">
      <div className="container-fluid">
        <div className="row g-0">
          {rooms.map((room, index) => (
            <div key={index} className="col-lg-6 position-relative">
              <img
                src={room.image}
                alt={room.title}
                className="img-fluid w-100"
              />
              <div className="room-overlay">
                <h5>{room.title}</h5>
                <span className="price">
                  ₹{room.price.toLocaleString("en-IN")} / Night
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default RoomsSection;

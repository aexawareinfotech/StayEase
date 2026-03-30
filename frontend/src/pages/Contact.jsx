import { useState } from "react";
import api from "../services/api";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/contact", formData);
      alert("Message sent successfully!");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    } catch (error) {
      alert("Failed to send message");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Contact Us</h2>

      <div className="row mt-4">
        <div className="col-md-6 mb-4">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              className="form-control mb-3"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Your Email"
              className="form-control mb-3"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="subject"
              placeholder="Subject"
              className="form-control mb-3"
              value={formData.subject}
              onChange={handleChange}
              required
            />

            <textarea
              name="message"
              placeholder="Your Message"
              className="form-control mb-3"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              required
            />

            <button className="btn btn-primary w-100">
              Send Message
            </button>
          </form>
        </div>
        <div className="col-md-6">
          <div className="p-4 bg-light rounded shadow-sm">
            <h4 className="mb-3">Our Location</h4>
            <p className="text-secondary">
              StayEase Hotel <br />
              SG Highway, Ahmedabad <br />
              Gujarat, India – 380015 <br />
              Phone: +91 9876543210
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookingContext } from '../context/BookingContext';
import CountUp from 'react-countup';
import { FaBed, FaHeadset, FaShieldAlt, FaUndo, FaCheckCircle, FaStar } from 'react-icons/fa';
import api from '../services/api';

const testimonials = [
    {
        name: "Rahul Sharma",
        location: "Mumbai",
        rating: 5,
        image: "https://randomuser.me/api/portraits/men/32.jpg",
        review: "Amazing hospitality and clean rooms."
    },
    {
        name: "Priya Patel",
        location: "Ahmedabad",
        rating: 4,
        image: "https://randomuser.me/api/portraits/women/44.jpg",
        review: "Smooth booking and great service."
    },
    {
        name: "Arjun Mehta",
        location: "Delhi",
        rating: 4,
        image: "https://randomuser.me/api/portraits/men/76.jpg",
        review: "Comfortable stay and good pricing."
    }
];

const Home = () => {
    const navigate = useNavigate();
    const { updateSearchParams } = useContext(BookingContext);

    const [checkin, setCheckin] = useState('');
    const [checkout, setCheckout] = useState('');
    const [guests, setGuests] = useState('1');

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
            alert("Error sending message");
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        updateSearchParams({ checkin, checkout, guests });
        navigate('/rooms');
    };

    return (
        <div className="bg-light relative">
            {/* HERO SECTION */}
            <section id="home" className="position-relative d-flex align-items-center justify-content-center" style={{ minHeight: 'calc(100vh - 64px)' }}>
                <div
                    className="position-absolute w-100 h-100"
                    style={{
                        backgroundImage: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        zIndex: 0
                    }}
                ></div>

                <div className="container position-relative z-1">
                    <div className="text-center mb-5" data-aos="fade-up">
                        <h1 className="display-3 fw-bold text-white mb-3 shadow-sm">Find Your Perfect Stay</h1>
                        <p className="lead text-light shadow-sm">Experience luxury and comfort at StayEase</p>
                    </div>

                    {/* Search Box */}
                    <div className="bg-white p-4 p-md-5 rounded-4 shadow-lg mx-auto" style={{ maxWidth: '900px', opacity: 0.95 }} data-aos="zoom-in" data-aos-delay="200">
                        <form onSubmit={handleSearch} className="row g-3 align-items-end">
                            <div className="col-md-3">
                                <label className="form-label fw-bold text-secondary">Check-in</label>
                                <input
                                    type="date"
                                    className="form-control form-control-lg border-primary rounded-3 text-secondary"
                                    value={checkin}
                                    onChange={(e) => setCheckin(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    required
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label fw-bold text-secondary">Check-out</label>
                                <input
                                    type="date"
                                    className="form-control form-control-lg border-primary rounded-3 text-secondary"
                                    value={checkout}
                                    onChange={(e) => setCheckout(e.target.value)}
                                    min={checkin || new Date().toISOString().split('T')[0]}
                                    required
                                />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label fw-bold text-secondary">Guests</label>
                                <select
                                    className="form-select form-select-lg border-primary rounded-3 text-secondary"
                                    value={guests}
                                    onChange={(e) => setGuests(e.target.value)}
                                >
                                    {[1, 2, 3, 4, 5, 6].map(num => (
                                        <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-3">
                                <button type="submit" className="btn btn-primary btn-lg w-100 fw-bold rounded-3 shadow hover-scale transition">
                                    Search
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>

            {/* ABOUT US SECTION */}
            <section id="about" className="py-5 bg-white">
                <div className="container py-md-5">
                    <div className="row align-items-center g-5">
                        <div className="col-lg-6" data-aos="fade-right">
                            <img
                                src="https://images.unsplash.com/photo-1566073771259-6a8506099945"
                                alt="Luxury Hotel"
                                className="img-fluid rounded-4 shadow-lg"
                            />
                        </div>
                        <div className="col-lg-6" data-aos="fade-left">
                            <h6 className="text-primary text-uppercase fw-bold tracking-wider mb-2">About StayEase</h6>
                            <h2 className="display-5 fw-bold text-dark mb-4">A Modern Platform <br />For Your Travel Needs</h2>
                            <p className="lead text-secondary mb-4">
                                StayEase is a modern hotel booking platform designed to simplify your travel experience. We provide seamless booking, real-time room availability, secure payments, and premium customer support.
                            </p>
                            <p className="text-secondary mb-5">
                                Discover comfort, elegance, and nature seamlessly entwined. We curate the best spaces across the world, assuring a luxurious and peaceful getaway exclusively tailored to elevate your unwinding experience.
                            </p>
                            <button onClick={() => navigate('/rooms')} className="btn btn-outline-primary btn-lg fw-bold rounded-pill px-5">Explore Rooms</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* SERVICES SECTION */}
            <section id="services" className="py-5 bg-light">
                <div className="container py-md-5">
                    <div className="text-center mb-5" data-aos="fade-up">
                        <h6 className="text-primary text-uppercase fw-bold tracking-wider mb-2">Our Offerings</h6>
                        <h2 className="display-5 fw-bold text-dark">Our Services</h2>
                    </div>

                    <div className="row g-4">
                        <div className="col-md-6 col-lg-3" data-aos="fade-up" data-aos-delay="100">
                            <div className="card h-100 border-0 shadow-sm rounded-4 text-center p-4 hover-scale transition cursor-pointer">
                                <div className="card-body">
                                    <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-4 mb-4 text-primary">
                                        <FaBed size={32} />
                                    </div>
                                    <h4 className="card-title fw-bold">Luxury Rooms</h4>
                                    <div className="service-rating">
                                        {[...Array(4)].map((_, i) => (
                                            <span key={i}>⭐</span>
                                        ))}
                                    </div>
                                    <p className="card-text text-secondary mt-3">Experience ultimate comfort with our premium, well-equipped luxury rooms suited for everyone.</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6 col-lg-3" data-aos="fade-up" data-aos-delay="200">
                            <div className="card h-100 border-0 shadow-sm rounded-4 text-center p-4 hover-scale transition cursor-pointer">
                                <div className="card-body">
                                    <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-4 mb-4 text-primary">
                                        <FaHeadset size={32} />
                                    </div>
                                    <h4 className="card-title fw-bold">24/7 Support</h4>
                                    <div className="service-rating">
                                        {[...Array(4)].map((_, i) => (
                                            <span key={i}>⭐</span>
                                        ))}
                                    </div>
                                    <p className="card-text text-secondary mt-3">Our dedicated customer service team is always available around the clock to assist you.</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6 col-lg-3" data-aos="fade-up" data-aos-delay="300">
                            <div className="card h-100 border-0 shadow-sm rounded-4 text-center p-4 hover-scale transition cursor-pointer">
                                <div className="card-body">
                                    <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-4 mb-4 text-primary">
                                        <FaShieldAlt size={32} />
                                    </div>
                                    <h4 className="card-title fw-bold">Secure Booking</h4>
                                    <div className="service-rating">
                                        {[...Array(4)].map((_, i) => (
                                            <span key={i}>⭐</span>
                                        ))}
                                    </div>
                                    <p className="card-text text-secondary mt-3">Your standard security is our priority. Enjoy safe transactions through our simulated portals.</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6 col-lg-3" data-aos="fade-up" data-aos-delay="400">
                            <div className="card h-100 border-0 shadow-sm rounded-4 text-center p-4 hover-scale transition cursor-pointer">
                                <div className="card-body">
                                    <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-4 mb-4 text-primary">
                                        <FaUndo size={32} />
                                    </div>
                                    <h4 className="card-title fw-bold">Flexible Refund</h4>
                                    <div className="service-rating">
                                        {[...Array(4)].map((_, i) => (
                                            <span key={i}>⭐</span>
                                        ))}
                                    </div>
                                    <p className="card-text text-secondary mt-3">Things change, and so can your plans. Cancel early easily per our flexible refund policy.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* WHY CHOOSE US - Counters */}
            <section className="py-5 bg-primary text-white position-relative">
                <div className="container py-md-4 position-relative z-1">
                    <div className="text-center mb-5" data-aos="zoom-in">
                        <h2 className="display-6 fw-bold">Why Choose Us</h2>
                        <p className="lead opacity-75">Unmatched metrics that define our standards.</p>
                    </div>
                    <div className="row g-4 text-center">
                        <div className="col-6 col-md-3" data-aos="fade-up" data-aos-delay="100">
                            <FaCheckCircle size={40} className="mb-3 opacity-75" />
                            <h2 className="display-4 fw-bold mb-1">
                                <CountUp end={100} suffix="%" duration={2.5} enableScrollSpy scrollSpyOnce />
                            </h2>
                            <p className="fw-semibold tracking-wider text-uppercase small">Best Price Guarantee</p>
                        </div>
                        <div className="col-6 col-md-3" data-aos="fade-up" data-aos-delay="200">
                            <FaCheckCircle size={40} className="mb-3 opacity-75" />
                            <h2 className="display-4 fw-bold mb-1">
                                <CountUp end={4} suffix=" Star" duration={2} enableScrollSpy scrollSpyOnce />
                            </h2>
                            <p className="fw-semibold tracking-wider text-uppercase small">Premium Hospitality</p>
                        </div>
                        <div className="col-6 col-md-3" data-aos="fade-up" data-aos-delay="300">
                            <FaCheckCircle size={40} className="mb-3 opacity-75" />
                            <h2 className="display-4 fw-bold mb-1">
                                <CountUp end={100} suffix="%" duration={2.5} enableScrollSpy scrollSpyOnce />
                            </h2>
                            <p className="fw-semibold tracking-wider text-uppercase small">Easy Refund Policy</p>
                        </div>
                        <div className="col-6 col-md-3" data-aos="fade-up" data-aos-delay="400">
                            <FaCheckCircle size={40} className="mb-3 opacity-75" />
                            <h2 className="display-4 fw-bold mb-1">
                                <CountUp end={10000} suffix="+" separator="," duration={3} enableScrollSpy scrollSpyOnce />
                            </h2>
                            <p className="fw-semibold tracking-wider text-uppercase small">Trusted Customers</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* TESTIMONIALS SECTION */}
            <section id="testimonials" className="py-5 bg-light">
                <div className="container py-md-5">
                    <div className="text-center mb-5" data-aos="fade-up">
                        <h6 className="text-primary text-uppercase fw-bold tracking-wider mb-2">Testimonials</h6>
                        <h2 className="display-5 fw-bold text-dark">What Our Guests Say</h2>
                    </div>

                    <div className="row g-4">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="col-12 col-md-6 col-lg-4 mx-auto" data-aos="fade-up" data-aos-delay={(index + 1) * 100}>
                                <div className="testimonial-card card h-100 border-0 shadow-sm rounded-4 text-center p-4 hover-scale transition bg-white align-items-center">
                                    <img src={testimonial.image} alt={testimonial.name} style={{ objectFit: 'cover' }} className="rounded-circle border border-3 border-primary shadow mb-4" width="100" height="100" />
                                    <h4 className="fw-bold text-dark mb-0">{testimonial.name}</h4>
                                    <p className="text-muted">{testimonial.location}</p>

                                    <div className="rating">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i}>
                                                {i < testimonial.rating ? "⭐" : "☆"}
                                            </span>
                                        ))}
                                    </div>

                                    <p className="fst-italic text-secondary mb-4 flex-grow-1">{testimonial.review}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CONTACT SECTION */}
            <section id="contact" className="contact-section">
                <div className="container">
                    <div className="contact-wrapper">

                        {/* LEFT SIDE - IMAGE */}
                        <div className="contact-left">
                            <img
                                src="https://images.unsplash.com/photo-1566073771259-6a8506099945"
                                alt="hotel"
                            />
                            <div className="overlay">
                                <h2>StayEase Hotel</h2>
                                <p>Luxury & Comfort in Ahmedabad</p>
                            </div>
                        </div>

                        {/* RIGHT SIDE - FORM */}
                        <div className="contact-right">
                            <h3>Contact Us</h3>

                            <form onSubmit={handleSubmit} className="contact-form">
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Your Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />

                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Your Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />

                                <input
                                    type="text"
                                    name="subject"
                                    placeholder="Subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                />

                                <textarea
                                    name="message"
                                    placeholder="Your Message"
                                    rows="4"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                />

                                <button type="submit">Send Message</button>
                            </form>

                            {/* ADDRESS */}
                            <div className="contact-info">
                                <p>📍 SG Highway, Ahmedabad, Gujarat</p>
                                <p>📞 +91 9876543210</p>
                                <p>✉ support@stayease.com</p>
                            </div>

                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
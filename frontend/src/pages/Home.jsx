import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookingContext } from '../context/BookingContext';
import CountUp from 'react-countup';
import { FaBed, FaHeadset, FaShieldAlt, FaUndo, FaCheckCircle, FaStar } from 'react-icons/fa';

const Home = () => {
    const navigate = useNavigate();
    const { updateSearchParams } = useContext(BookingContext);

    const [checkin, setCheckin] = useState('');
    const [checkout, setCheckout] = useState('');
    const [guests, setGuests] = useState('1');

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
                                <CountUp end={5} suffix=" Star" duration={2} enableScrollSpy scrollSpyOnce />
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
                        {/* Card 1 */}
                        <div className="col-12 col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay="100">
                            <div className="card h-100 border-0 shadow-sm rounded-4 text-center p-4 hover-scale transition bg-white">
                                <div className="card-body d-flex flex-column align-items-center">
                                    <img src="https://images.unsplash.com/photo-1615109398623-88346a601842?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Rahul Mehta" style={{ objectFit: 'cover' }} className="rounded-circle border border-3 border-primary shadow mb-4" width="100" height="100" />
                                    <div className="text-warning mb-3 d-flex justify-content-center gap-1">
                                        <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                                    </div>
                                    <p className="fst-italic text-secondary mb-4 flex-grow-1">"StayEase made my Goa vacation completely hassle-free. The booking process was smooth and the hotel was exactly as shown."</p>
                                    <h5 className="fw-bold text-dark mb-0">Rahul Mehta</h5>
                                    <small className="text-muted">Mumbai</small>
                                </div>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="col-12 col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay="200">
                            <div className="card h-100 border-0 shadow-sm rounded-4 text-center p-4 hover-scale transition bg-white">
                                <div className="card-body d-flex flex-column align-items-center">
                                    <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Priya Sharma" style={{ objectFit: 'cover' }} className="rounded-circle border border-3 border-primary shadow mb-4" width="100" height="100" />
                                    <div className="text-warning mb-3 d-flex justify-content-center gap-1">
                                        <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                                    </div>
                                    <p className="fst-italic text-secondary mb-4 flex-grow-1">"I loved the premium experience. Secure payment and instant confirmation made everything so easy."</p>
                                    <h5 className="fw-bold text-dark mb-0">Priya Sharma</h5>
                                    <small className="text-muted">Delhi</small>
                                </div>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="col-12 col-md-6 col-lg-4 mx-auto" data-aos="fade-up" data-aos-delay="300">
                            <div className="card h-100 border-0 shadow-sm rounded-4 text-center p-4 hover-scale transition bg-white">
                                <div className="card-body d-flex flex-column align-items-center">
                                    <img src="https://images.unsplash.com/photo-1556157382-97eda2d62296?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="Arjun Patel" style={{ objectFit: 'cover' }} className="rounded-circle border border-3 border-primary shadow mb-4" width="100" height="100" />
                                    <div className="text-warning mb-3 d-flex justify-content-center gap-1">
                                        <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                                    </div>
                                    <p className="fst-italic text-secondary mb-4 flex-grow-1">"Best price guarantee and excellent support team. Highly recommended!"</p>
                                    <h5 className="fw-bold text-dark mb-0">Arjun Patel</h5>
                                    <small className="text-muted">Ahmedabad</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CALL TO ACTION SECTION */}
            <section id="contact" className="py-5" style={{ background: 'linear-gradient(45deg, #2563eb, #3b82f6)' }}>
                <div className="container py-md-5 text-center text-white" data-aos="fade-up">
                    <h2 className="display-4 fw-bold mb-4">Ready to Experience Luxury?</h2>
                    <p className="lead mb-5 opacity-75">Book your stay today to grab the best deals available worldwide.</p>
                    <button
                        onClick={() => navigate('/rooms')}
                        className="btn btn-light btn-lg text-primary fw-bold px-5 py-3 rounded-pill shadow-lg pulse-animation"
                    >
                        Book Now
                    </button>
                </div>
            </section>
        </div>
    );
};

export default Home;
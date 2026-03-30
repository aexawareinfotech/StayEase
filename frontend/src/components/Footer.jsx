import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
    const location = useLocation();

    if (location.pathname.startsWith('/admin')) {
        return null; // Do not show footer on admin routes
    }

    return (
        <footer className="bg-dark text-light pt-5 pb-3 font-sans">
            <div className="container">
                <div className="row gy-4">
                    {/* About Section */}
                    <div className="col-12 col-md-4">
                        <h4 className="text-primary fw-bold mb-3">StayEase</h4>
                        <p className="text-secondary pe-md-4">
                            StayEase is a modern hotel booking platform designed to provide a seamless travel experience with real-time room availability, secure payments, and premium customer support.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="col-6 col-md-2">
                        <h5 className="text-white mb-3 fw-bold">Quick Links</h5>
                        <ul className="list-unstyled">
                            <li className="mb-2"><a href="/#home" className="text-secondary text-decoration-none hover:text-white transition">Home</a></li>
                            <li className="mb-2"><Link to="/rooms" className="text-secondary text-decoration-none hover:text-white transition">Rooms</Link></li>
                            <li className="mb-2"><a href="/#about" className="text-secondary text-decoration-none hover:text-white transition">About</a></li>
                            <li className="mb-2"><a href="/#contact" className="text-secondary text-decoration-none hover:text-white transition">Contact</a></li>
                        </ul>
                    </div>

                    {/* Services Links */}
                    <div className="col-6 col-md-3">
                        <h5 className="text-white mb-3 fw-bold">Our Services</h5>
                        <ul className="list-unstyled">
                            <li className="mb-2"><a href="/#services" className="text-secondary text-decoration-none hover:text-white transition">Luxury Rooms</a></li>
                            <li className="mb-2"><a href="/#services" className="text-secondary text-decoration-none hover:text-white transition">24/7 Support</a></li>
                            <li className="mb-2"><a href="/#services" className="text-secondary text-decoration-none hover:text-white transition">Secure Booking</a></li>
                            <li className="mb-2"><a href="/#services" className="text-secondary text-decoration-none hover:text-white transition">Flexible Cancellation</a></li>
                        </ul>
                    </div>

                    {/* Contact Info & Socials */}
                    <div className="col-12 col-md-3">
                        <h5 className="text-white mb-3 fw-bold">Contact Us</h5>
                        <p className="text-secondary mb-3">
                          StayEase Hotel <br />
                          SG Highway, Ahmedabad <br />
                          Gujarat, India – 380015 <br />
                          Phone: +91 9876543210
                        </p>
                        <div className="d-flex gap-3">
                            <a href="#" className="btn btn-outline-secondary rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                <FaFacebookF />
                            </a>
                            <a href="#" className="btn btn-outline-secondary rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                <FaTwitter />
                            </a>
                            <a href="#" className="btn btn-outline-secondary rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                <FaInstagram />
                            </a>
                            <a href="#" className="btn btn-outline-secondary rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                                <FaLinkedinIn />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="row mt-5">
                    <div className="col-12 text-center border-top border-secondary pt-3">
                        <p className="text-secondary small mb-0">&copy; {new Date().getFullYear()} StayEase. All Rights Reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

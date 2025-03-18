import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">PawWalker</h3>
            <p className="footer-description">
              Connecting pet owners with trusted dog walkers in your area.
            </p>
            <p className="footer-description">
              Our mission is to make pet care accessible, reliable, and stress-free for everyone.
            </p>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Quick Links</h3>
            <ul className="footer-links">
              <li>
                <Link to="/">
                  <i className="fas fa-home"></i> Home
                </Link>
              </li>
              <li>
                <Link to="/dog-walkers">
                  <i className="fas fa-search"></i> Find Dog Walkers
                </Link>
              </li>
              <li>
                <Link to="/login">
                  <i className="fas fa-sign-in-alt"></i> Login
                </Link>
              </li>
              <li>
                <Link to="/register">
                  <i className="fas fa-user-plus"></i> Register
                </Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Contact Us</h3>
            <ul className="footer-contact">
              <li>
                <i className="fas fa-envelope"></i> info@pawwalker.com
              </li>
              <li>
                <i className="fas fa-phone"></i> (123) 456-7890
              </li>
              <li>
                <i className="fas fa-map-marker-alt"></i> 123 Main St, City, Country
              </li>
              <li>
                <i className="fas fa-clock"></i> Mon-Fri: 9am - 5pm
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} PawWalker. All rights reserved.</p>
          <div className="footer-social">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <i className="fab fa-linkedin"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

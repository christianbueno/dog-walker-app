import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home: React.FC = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Find the Perfect Dog Walker for Your Furry Friend</h1>
          <p>
            Connect with trusted dog walkers in your area who will treat your pet like family.
          </p>
          {isAuthenticated ? (
            <div className="hero-buttons">
              <Link to="/dashboard" className="btn btn-primary">
                Go to Dashboard
              </Link>
              {user?.role === 'pet_owner' && (
                <Link to="/dog-walkers" className="btn btn-secondary">
                  Find Dog Walkers
                </Link>
              )}
            </div>
          ) : (
            <div className="hero-buttons">
              <Link to="/register" className="btn btn-primary">
                Sign Up Now
              </Link>
              <Link to="/login" className="btn btn-secondary">
                Login
              </Link>
            </div>
          )}
        </div>
        <div className="hero-image">
          <img src="/images/hero-dog.jpg" alt="Happy dog with walker" />
        </div>
      </section>

      <section className="features">
        <h2 className="section-title">How It Works</h2>
        <div className="feature-cards">
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-user-plus"></i>
            </div>
            <h3>Create an Account</h3>
            <p>Sign up as a pet owner or dog walker in just a few minutes.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-search"></i>
            </div>
            <h3>Find the Perfect Match</h3>
            <p>Browse profiles, reviews, and availability of dog walkers in your area.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-calendar-check"></i>
            </div>
            <h3>Book a Walk</h3>
            <p>Schedule a walk, manage bookings, and pay securely through our platform.</p>
          </div>
        </div>
      </section>

      <section className="testimonials">
        <h2 className="section-title">What Our Users Say</h2>
        <div className="testimonial-cards">
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>
                "PawWalker has been a lifesaver! I found an amazing dog walker who takes
                such good care of my Labrador when I'm at work."
              </p>
            </div>
            <div className="testimonial-author">
              <img src="/images/testimonial-1.jpg" alt="Sarah M." />
              <div>
                <h4>Sarah M.</h4>
                <p>Pet Owner</p>
              </div>
            </div>
          </div>
          <div className="testimonial-card">
            <div className="testimonial-content">
              <p>
                "As a dog walker, this platform has helped me connect with wonderful pet
                owners and their adorable dogs. It's been a great way to grow my business!"
              </p>
            </div>
            <div className="testimonial-author">
              <img src="/images/testimonial-2.jpg" alt="Michael T." />
              <div>
                <h4>Michael T.</h4>
                <p>Dog Walker</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="cta-content">
          <h2>Ready to Get Started?</h2>
          <p>Join our community of pet lovers and professional dog walkers today!</p>
          <Link to="/register" className="btn btn-primary">
            Sign Up Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;

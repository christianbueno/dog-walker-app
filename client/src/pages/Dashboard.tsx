import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

// Define types
interface Booking {
  id: string;
  petId: string;
  petName: string;
  dogWalkerId: string;
  dogWalkerName: string;
  petOwnerId: string;
  petOwnerName: string;
  startTime: string;
  endTime: string;
  status: string;
  specialInstructions?: string;
  price: number;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/bookings`);
        setBookings(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch bookings');
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [API_URL]);

  const getUpcomingBookings = () => {
    return bookings.filter(
      (booking) => new Date(booking.startTime) > new Date() && booking.status !== 'canceled'
    );
  };

  const getPastBookings = () => {
    return bookings.filter(
      (booking) => new Date(booking.startTime) <= new Date() || booking.status === 'canceled'
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Welcome, {user?.firstName}!</h1>
        <p>Manage your {user?.role === 'pet_owner' ? 'pets and' : ''} bookings here.</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="dashboard-actions">
        {user?.role === 'pet_owner' && (
          <>
            <Link to="/pets" className="btn btn-primary">
              Manage Pets
            </Link>
            <Link to="/dog-walkers" className="btn btn-secondary">
              Find Dog Walkers
            </Link>
          </>
        )}
        {user?.role === 'dog_walker' && (
          <Link to="/profile/dog-walker" className="btn btn-primary">
            Update Profile
          </Link>
        )}
        <Link to="/bookings" className="btn btn-secondary">
          View All Bookings
        </Link>
      </div>

      <div className="dashboard-section">
        <h2>Upcoming Bookings</h2>
        {getUpcomingBookings().length === 0 ? (
          <p className="no-data-message">No upcoming bookings.</p>
        ) : (
          <div className="booking-cards">
            {getUpcomingBookings().map((booking) => (
              <div key={booking.id} className="booking-card">
                <div className="booking-header">
                  <h3>
                    {user?.role === 'pet_owner'
                      ? `Booking with ${booking.dogWalkerName}`
                      : `Booking for ${booking.petName}`}
                  </h3>
                  <span className={`booking-status status-${booking.status.toLowerCase()}`}>
                    {booking.status}
                  </span>
                </div>
                <div className="booking-details">
                  <div className="booking-detail-item">
                    <i className="fas fa-calendar-day"></i>
                    <div>
                      <strong>Date:</strong>
                      <div>{formatDate(booking.startTime)}</div>
                    </div>
                  </div>
                  
                  <div className="booking-detail-item">
                    <i className="fas fa-clock"></i>
                    <div>
                      <strong>Time:</strong>
                      <div>{formatTime(booking.startTime)} - {formatTime(booking.endTime)}</div>
                    </div>
                  </div>
                  
                  <div className="booking-detail-item">
                    <i className={user?.role === 'pet_owner' ? 'fas fa-dog' : 'fas fa-user'}></i>
                    <div>
                      <strong>{user?.role === 'pet_owner' ? 'Pet:' : 'Owner:'}</strong>
                      <div>{user?.role === 'pet_owner' ? booking.petName : booking.petOwnerName}</div>
                    </div>
                  </div>
                  
                  {booking.specialInstructions && (
                    <div className="booking-detail-item">
                      <i className="fas fa-info-circle"></i>
                      <div>
                        <strong>Instructions:</strong>
                        <div>{booking.specialInstructions}</div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="booking-actions">
                  <Link to={`/bookings/${booking.id}`} className="btn btn-primary btn-sm">
                    <i className="fas fa-eye mr-1"></i> View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="dashboard-section">
        <h2>Recent Bookings</h2>
        {getPastBookings().length === 0 ? (
          <p className="no-data-message">No past bookings.</p>
        ) : (
          <div className="booking-cards">
            {getPastBookings().slice(0, 3).map((booking) => (
              <div key={booking.id} className="booking-card">
                <div className="booking-header">
                  <h3>
                    {user?.role === 'pet_owner'
                      ? `Booking with ${booking.dogWalkerName}`
                      : `Booking for ${booking.petName}`}
                  </h3>
                  <span className={`booking-status status-${booking.status.toLowerCase()}`}>
                    {booking.status}
                  </span>
                </div>
                <div className="booking-details">
                  <div className="booking-detail-item">
                    <i className="fas fa-calendar-day"></i>
                    <div>
                      <strong>Date:</strong>
                      <div>{formatDate(booking.startTime)}</div>
                    </div>
                  </div>
                  
                  <div className="booking-detail-item">
                    <i className="fas fa-clock"></i>
                    <div>
                      <strong>Time:</strong>
                      <div>{formatTime(booking.startTime)} - {formatTime(booking.endTime)}</div>
                    </div>
                  </div>
                </div>
                <div className="booking-actions">
                  <Link to={`/bookings/${booking.id}`} className="btn btn-secondary btn-sm">
                    <i className="fas fa-history mr-1"></i> View History
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

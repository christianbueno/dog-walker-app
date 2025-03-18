import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

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
  status: 'pending' | 'confirmed' | 'completed' | 'canceled';
  specialInstructions?: string;
  price: number;
}

const BookingList: React.FC = () => {
  const { user, token } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/bookings`, {
          headers: {
            'x-auth-token': token,
          },
        });
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
  }, [token, API_URL]);

  const handleUpdateStatus = async (id: string, status: 'confirmed' | 'completed' | 'canceled') => {
    try {
      setLoading(true);
      await axios.patch(
        `${API_URL}/bookings/${id}/status`,
        { status },
        {
          headers: {
            'x-auth-token': token,
          },
        }
      );
      
      // Update booking in state
      setBookings(
        bookings.map(booking =>
          booking.id === id ? { ...booking, status } : booking
        )
      );
      
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update booking status');
      console.error('Error updating booking status:', err);
    } finally {
      setLoading(false);
    }
  };

  const getUpcomingBookings = () => {
    return bookings.filter(
      booking => 
        new Date(booking.startTime) > new Date() && 
        (booking.status === 'pending' || booking.status === 'confirmed')
    );
  };

  const getPastBookings = () => {
    return bookings.filter(
      booking => 
        new Date(booking.startTime) <= new Date() || 
        booking.status === 'completed' || 
        booking.status === 'canceled'
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

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'badge-warning';
      case 'confirmed':
        return 'badge-primary';
      case 'completed':
        return 'badge-success';
      case 'canceled':
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  };

  if (loading && bookings.length === 0) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading bookings...</p>
      </div>
    );
  }

  return (
    <div className="booking-list-page">
      <div className="booking-list-header">
        <h1>My Bookings</h1>
        {user?.role === 'pet_owner' && (
          <Link to="/dog-walkers" className="btn btn-primary">
            <i className="fas fa-plus"></i> Book a Dog Walker
          </Link>
        )}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="booking-tabs">
        <button
          className={`tab-button ${activeTab === 'upcoming' ? 'active' : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming Bookings
        </button>
        <button
          className={`tab-button ${activeTab === 'past' ? 'active' : ''}`}
          onClick={() => setActiveTab('past')}
        >
          Past Bookings
        </button>
      </div>

      <div className="booking-list-content">
        {activeTab === 'upcoming' ? (
          getUpcomingBookings().length === 0 ? (
            <div className="no-bookings-message">
              <p>You don't have any upcoming bookings.</p>
              {user?.role === 'pet_owner' && (
                <Link to="/dog-walkers" className="btn btn-primary">
                  Book a Dog Walker
                </Link>
              )}
            </div>
          ) : (
            <div className="booking-cards">
              {getUpcomingBookings().map(booking => (
                <div key={booking.id} className="booking-card">
                  <div className="booking-card-header">
                    <h2>
                      {user?.role === 'pet_owner'
                        ? `Booking with ${booking.dogWalkerName}`
                        : `Booking for ${booking.petName}`}
                    </h2>
                    <span className={`booking-status ${getStatusBadgeClass(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                  <div className="booking-card-body">
                    <div className="booking-details">
                      <p>
                        <strong>Date:</strong> {formatDate(booking.startTime)}
                      </p>
                      <p>
                        <strong>Time:</strong> {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                      </p>
                      <p>
                        <strong>
                          {user?.role === 'pet_owner' ? 'Pet:' : 'Owner:'}
                        </strong>{' '}
                        {user?.role === 'pet_owner' ? booking.petName : booking.petOwnerName}
                      </p>
                      <p>
                        <strong>Price:</strong> ${booking.price}
                      </p>
                      {booking.specialInstructions && (
                        <p>
                          <strong>Instructions:</strong> {booking.specialInstructions}
                        </p>
                      )}
                    </div>
                    <div className="booking-actions">
                      <Link to={`/bookings/${booking.id}`} className="btn btn-secondary">
                        View Details
                      </Link>
                      {user?.role === 'dog_walker' && booking.status === 'pending' && (
                        <button
                          className="btn btn-primary"
                          onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                          disabled={loading}
                        >
                          Accept
                        </button>
                      )}
                      {user?.role === 'dog_walker' && booking.status === 'confirmed' && (
                        <button
                          className="btn btn-success"
                          onClick={() => handleUpdateStatus(booking.id, 'completed')}
                          disabled={loading}
                        >
                          Mark Completed
                        </button>
                      )}
                      {booking.status !== 'canceled' && booking.status !== 'completed' && (
                        <button
                          className="btn btn-danger"
                          onClick={() => handleUpdateStatus(booking.id, 'canceled')}
                          disabled={loading}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          getPastBookings().length === 0 ? (
            <div className="no-bookings-message">
              <p>You don't have any past bookings.</p>
            </div>
          ) : (
            <div className="booking-cards">
              {getPastBookings().map(booking => (
                <div key={booking.id} className="booking-card">
                  <div className="booking-card-header">
                    <h2>
                      {user?.role === 'pet_owner'
                        ? `Booking with ${booking.dogWalkerName}`
                        : `Booking for ${booking.petName}`}
                    </h2>
                    <span className={`booking-status ${getStatusBadgeClass(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                  <div className="booking-card-body">
                    <div className="booking-details">
                      <p>
                        <strong>Date:</strong> {formatDate(booking.startTime)}
                      </p>
                      <p>
                        <strong>Time:</strong> {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                      </p>
                      <p>
                        <strong>
                          {user?.role === 'pet_owner' ? 'Pet:' : 'Owner:'}
                        </strong>{' '}
                        {user?.role === 'pet_owner' ? booking.petName : booking.petOwnerName}
                      </p>
                      <p>
                        <strong>Price:</strong> ${booking.price}
                      </p>
                    </div>
                    <div className="booking-actions">
                      <Link to={`/bookings/${booking.id}`} className="btn btn-secondary">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default BookingList;

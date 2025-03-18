import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
  createdAt: string;
  updatedAt: string;
}

const BookingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/bookings/${id}`, {
          headers: {
            'x-auth-token': token,
          },
        });
        setBooking(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch booking details');
        console.error('Error fetching booking:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id, token, API_URL]);

  const handleUpdateStatus = async (status: 'confirmed' | 'completed' | 'canceled') => {
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
      if (booking) {
        setBooking({ ...booking, status });
      }
      
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update booking status');
      console.error('Error updating booking status:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
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

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
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

  const calculateDuration = (start: string, end: string) => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const durationMs = endTime.getTime() - startTime.getTime();
    const hours = Math.floor(durationMs / (1000 * 60 * 60));
    const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  if (loading && !booking) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading booking details...</p>
      </div>
    );
  }

  if (!booking && !loading) {
    return (
      <div className="error-container">
        <h2>Booking Not Found</h2>
        <p>The booking you're looking for doesn't exist or you don't have permission to view it.</p>
        <Link to="/bookings" className="btn btn-primary">
          Back to Bookings
        </Link>
      </div>
    );
  }

  return (
    <div className="booking-detail-page">
      <div className="booking-detail-header">
        <div className="header-left">
          <Link to="/bookings" className="back-link">
            <i className="fas fa-arrow-left"></i> Back to Bookings
          </Link>
          <h1>Booking Details</h1>
        </div>
        
        {booking && (
          <span className={`booking-status ${getStatusBadgeClass(booking.status)}`}>
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </span>
        )}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {booking && (
        <div className="booking-details">
          <div className="detail-section">
            <h2>Booking Information</h2>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Date:</span>
                <span className="detail-value">{formatDate(booking.startTime)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Time:</span>
                <span className="detail-value">
                  {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Duration:</span>
                <span className="detail-value">
                  {calculateDuration(booking.startTime, booking.endTime)}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Price:</span>
                <span className="detail-value">${booking.price}</span>
              </div>
              {booking.specialInstructions && (
                <div className="detail-item full-width">
                  <span className="detail-label">Special Instructions:</span>
                  <span className="detail-value">{booking.specialInstructions}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="detail-section">
            <h2>{user?.role === 'pet_owner' ? 'Dog Walker' : 'Pet Owner'}</h2>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Name:</span>
                <span className="detail-value">
                  {user?.role === 'pet_owner' ? booking.dogWalkerName : booking.petOwnerName}
                </span>
              </div>
              {user?.role === 'pet_owner' && (
                <div className="detail-item">
                  <span className="detail-label">Pet:</span>
                  <span className="detail-value">{booking.petName}</span>
                </div>
              )}
              {user?.role === 'dog_walker' && (
                <div className="detail-item">
                  <span className="detail-label">Pet:</span>
                  <span className="detail-value">{booking.petName}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="detail-section">
            <h2>Booking History</h2>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Created:</span>
                <span className="detail-value">{formatDateTime(booking.createdAt)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Last Updated:</span>
                <span className="detail-value">{formatDateTime(booking.updatedAt)}</span>
              </div>
            </div>
          </div>
          
          <div className="booking-actions">
            {user?.role === 'dog_walker' && booking.status === 'pending' && (
              <button
                className="btn btn-primary"
                onClick={() => handleUpdateStatus('confirmed')}
                disabled={loading}
              >
                Accept Booking
              </button>
            )}
            {user?.role === 'dog_walker' && booking.status === 'confirmed' && (
              <button
                className="btn btn-success"
                onClick={() => handleUpdateStatus('completed')}
                disabled={loading}
              >
                Mark as Completed
              </button>
            )}
            {booking.status !== 'canceled' && booking.status !== 'completed' && (
              <button
                className="btn btn-danger"
                onClick={() => handleUpdateStatus('canceled')}
                disabled={loading}
              >
                Cancel Booking
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingDetail;

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const PetOwnerProfile: React.FC = () => {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    emergencyContact: '',
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        address: '',
        emergencyContact: '',
      });

      // Fetch pet owner specific profile data
      const fetchPetOwnerProfile = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`${API_URL}/users/me`, {
            headers: {
              'x-auth-token': token,
            },
          });
          
          // Update form data with pet owner specific fields
          if (response.data.address) {
            setFormData(prev => ({
              ...prev,
              address: response.data.address,
              emergencyContact: response.data.emergencyContact || '',
            }));
          }
          
          setError(null);
        } catch (err: any) {
          setError(err.response?.data?.message || 'Failed to fetch profile data');
          console.error('Error fetching profile:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchPetOwnerProfile();
    }
  }, [user, token, API_URL]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: '',
      });
    }
    
    // Clear success message when user makes changes
    if (successMessage) {
      setSuccessMessage(null);
    }
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        setLoading(true);
        setError(null);
        
        await axios.put(
          `${API_URL}/users/me`,
          formData,
          {
            headers: {
              'x-auth-token': token,
            },
          }
        );
        
        setSuccessMessage('Profile updated successfully');
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to update profile');
        console.error('Error updating profile:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading && !formData.firstName) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>Pet Owner Profile</h1>
        <p>Update your personal information and preferences</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}

      <div className="profile-content">
        <form className="profile-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h2>Personal Information</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  className={`form-control ${formErrors.firstName ? 'is-invalid' : ''}`}
                  value={formData.firstName}
                  onChange={handleChange}
                />
                {formErrors.firstName && (
                  <div className="invalid-feedback">{formErrors.firstName}</div>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className={`form-control ${formErrors.lastName ? 'is-invalid' : ''}`}
                  value={formData.lastName}
                  onChange={handleChange}
                />
                {formErrors.lastName && (
                  <div className="invalid-feedback">{formErrors.lastName}</div>
                )}
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="form-control"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(123) 456-7890"
              />
            </div>
          </div>
          
          <div className="form-section">
            <h2>Address Information</h2>
            
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <textarea
                id="address"
                name="address"
                className="form-control"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your full address"
                rows={3}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="emergencyContact">Emergency Contact</label>
              <input
                type="text"
                id="emergencyContact"
                name="emergencyContact"
                className="form-control"
                value={formData.emergencyContact}
                onChange={handleChange}
                placeholder="Name and phone number"
              />
            </div>
          </div>
          
          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PetOwnerProfile;

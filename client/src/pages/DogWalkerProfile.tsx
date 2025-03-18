import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const DogWalkerProfile: React.FC = () => {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    bio: '',
    hourlyRate: '',
    experience: '',
    servicesOffered: ['Walking'],
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  // Available services
  const availableServices = ['Walking', 'Sitting', 'Training', 'Grooming', 'Daycare'];

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        bio: '',
        hourlyRate: '',
        experience: '',
        servicesOffered: ['Walking'],
      });

      // Fetch dog walker specific profile data
      const fetchDogWalkerProfile = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`${API_URL}/users/me`, {
            headers: {
              'x-auth-token': token,
            },
          });
          
          // Update form data with dog walker specific fields
          if (response.data) {
            setFormData(prev => ({
              ...prev,
              bio: response.data.bio || '',
              hourlyRate: response.data.hourlyRate ? response.data.hourlyRate.toString() : '',
              experience: response.data.experience || '',
              servicesOffered: response.data.servicesOffered || ['Walking'],
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

      fetchDogWalkerProfile();
    }
  }, [user, token, API_URL]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

  const handleServiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    
    if (checked) {
      // Add service
      setFormData({
        ...formData,
        servicesOffered: [...formData.servicesOffered, value],
      });
    } else {
      // Remove service
      setFormData({
        ...formData,
        servicesOffered: formData.servicesOffered.filter(service => service !== value),
      });
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
    
    if (formData.hourlyRate && isNaN(Number(formData.hourlyRate))) {
      errors.hourlyRate = 'Hourly rate must be a number';
    }
    
    if (formData.servicesOffered.length === 0) {
      errors.servicesOffered = 'At least one service must be selected';
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
        
        // Convert hourlyRate to number
        const dataToSubmit = {
          ...formData,
          hourlyRate: formData.hourlyRate ? Number(formData.hourlyRate) : undefined,
        };
        
        await axios.put(
          `${API_URL}/users/me`,
          dataToSubmit,
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
        <h1>Dog Walker Profile</h1>
        <p>Update your profile to attract more pet owners</p>
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
            <h2>Professional Information</h2>
            
            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                name="bio"
                className="form-control"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell pet owners about yourself and your experience with dogs"
                rows={4}
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="hourlyRate">Hourly Rate ($)</label>
                <input
                  type="text"
                  id="hourlyRate"
                  name="hourlyRate"
                  className={`form-control ${formErrors.hourlyRate ? 'is-invalid' : ''}`}
                  value={formData.hourlyRate}
                  onChange={handleChange}
                  placeholder="25"
                />
                {formErrors.hourlyRate && (
                  <div className="invalid-feedback">{formErrors.hourlyRate}</div>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="experience">Experience</label>
                <input
                  type="text"
                  id="experience"
                  name="experience"
                  className="form-control"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="e.g. 3 years"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label>Services Offered</label>
              <div className={`checkbox-group ${formErrors.servicesOffered ? 'is-invalid' : ''}`}>
                {availableServices.map(service => (
                  <div className="form-check" key={service}>
                    <input
                      type="checkbox"
                      id={`service-${service.toLowerCase()}`}
                      name="servicesOffered"
                      value={service}
                      className="form-check-input"
                      checked={formData.servicesOffered.includes(service)}
                      onChange={handleServiceChange}
                    />
                    <label
                      htmlFor={`service-${service.toLowerCase()}`}
                      className="form-check-label"
                    >
                      {service}
                    </label>
                  </div>
                ))}
              </div>
              {formErrors.servicesOffered && (
                <div className="invalid-feedback d-block">{formErrors.servicesOffered}</div>
              )}
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

export default DogWalkerProfile;

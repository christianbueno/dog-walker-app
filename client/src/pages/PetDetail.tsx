import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

interface Pet {
  id: string;
  name: string;
  breed: string;
  age?: number;
  size: 'small' | 'medium' | 'large';
  weight?: number;
  temperament?: string;
  specialNeeds?: string;
  medicalInfo?: string;
  feedingInstructions?: string;
  walkingInstructions?: string;
}

const PetDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(id === 'new');
  const [formData, setFormData] = useState<Omit<Pet, 'id'>>({
    name: '',
    breed: '',
    age: undefined,
    size: 'medium',
    weight: undefined,
    temperament: '',
    specialNeeds: '',
    medicalInfo: '',
    feedingInstructions: '',
    walkingInstructions: '',
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    if (id !== 'new') {
      const fetchPet = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`${API_URL}/pets/${id}`, {
            headers: {
              'x-auth-token': token,
            },
          });
          setPet(response.data);
          setFormData(response.data);
          setError(null);
        } catch (err: any) {
          setError(err.response?.data?.message || 'Failed to fetch pet details');
          console.error('Error fetching pet:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchPet();
    } else {
      setLoading(false);
    }
  }, [id, token, API_URL]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Handle number inputs
    if (type === 'number') {
      setFormData({
        ...formData,
        [name]: value === '' ? undefined : Number(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Pet name is required';
    }
    
    if (!formData.breed.trim()) {
      errors.breed = 'Breed is required';
    }
    
    if (!formData.size) {
      errors.size = 'Size is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        setLoading(true);
        
        if (id === 'new') {
          // Create new pet
          const response = await axios.post(
            `${API_URL}/pets`,
            formData,
            {
              headers: {
                'x-auth-token': token,
              },
            }
          );
          
          navigate(`/pets/${response.data.id}`);
        } else {
          // Update existing pet
          await axios.put(
            `${API_URL}/pets/${id}`,
            formData,
            {
              headers: {
                'x-auth-token': token,
              },
            }
          );
          
          setPet({ ...formData, id: id! });
          setIsEditing(false);
        }
        
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to save pet');
        console.error('Error saving pet:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const getSizeLabel = (size: string) => {
    switch (size) {
      case 'small':
        return 'Small';
      case 'medium':
        return 'Medium';
      case 'large':
        return 'Large';
      default:
        return size;
    }
  };

  if (loading && !pet && id !== 'new') {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading pet details...</p>
      </div>
    );
  }

  return (
    <div className="pet-detail-page">
      <div className="pet-detail-header">
        <div className="header-left">
          <Link to="/pets" className="back-link">
            <i className="fas fa-arrow-left"></i> Back to Pets
          </Link>
          <h1>{id === 'new' ? 'Add New Pet' : isEditing ? `Edit ${pet?.name}` : pet?.name}</h1>
        </div>
        
        {!isEditing && id !== 'new' && (
          <button
            className="btn btn-primary"
            onClick={() => setIsEditing(true)}
          >
            Edit Pet
          </button>
        )}
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {isEditing ? (
        <form className="pet-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h2>Basic Information</h2>
            
            <div className="form-group">
              <label htmlFor="name">Pet Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your pet's name"
              />
              {formErrors.name && (
                <div className="invalid-feedback">{formErrors.name}</div>
              )}
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="breed">Breed</label>
                <input
                  type="text"
                  id="breed"
                  name="breed"
                  className={`form-control ${formErrors.breed ? 'is-invalid' : ''}`}
                  value={formData.breed}
                  onChange={handleChange}
                  placeholder="Enter breed"
                />
                {formErrors.breed && (
                  <div className="invalid-feedback">{formErrors.breed}</div>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="age">Age (years)</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  className="form-control"
                  value={formData.age === undefined ? '' : formData.age}
                  onChange={handleChange}
                  placeholder="Enter age"
                  min="0"
                  step="0.1"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="size">Size</label>
                <select
                  id="size"
                  name="size"
                  className={`form-control ${formErrors.size ? 'is-invalid' : ''}`}
                  value={formData.size}
                  onChange={handleChange}
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
                {formErrors.size && (
                  <div className="invalid-feedback">{formErrors.size}</div>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="weight">Weight (lbs)</label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  className="form-control"
                  value={formData.weight === undefined ? '' : formData.weight}
                  onChange={handleChange}
                  placeholder="Enter weight"
                  min="0"
                  step="0.1"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="temperament">Temperament</label>
              <input
                type="text"
                id="temperament"
                name="temperament"
                className="form-control"
                value={formData.temperament || ''}
                onChange={handleChange}
                placeholder="Describe your pet's temperament"
              />
            </div>
          </div>
          
          <div className="form-section">
            <h2>Care Information</h2>
            
            <div className="form-group">
              <label htmlFor="specialNeeds">Special Needs</label>
              <textarea
                id="specialNeeds"
                name="specialNeeds"
                className="form-control"
                value={formData.specialNeeds || ''}
                onChange={handleChange}
                placeholder="Any special needs or accommodations"
                rows={2}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="medicalInfo">Medical Information</label>
              <textarea
                id="medicalInfo"
                name="medicalInfo"
                className="form-control"
                value={formData.medicalInfo || ''}
                onChange={handleChange}
                placeholder="Medications, allergies, or health concerns"
                rows={2}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="feedingInstructions">Feeding Instructions</label>
              <textarea
                id="feedingInstructions"
                name="feedingInstructions"
                className="form-control"
                value={formData.feedingInstructions || ''}
                onChange={handleChange}
                placeholder="Food type, amount, and feeding schedule"
                rows={2}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="walkingInstructions">Walking Instructions</label>
              <textarea
                id="walkingInstructions"
                name="walkingInstructions"
                className="form-control"
                value={formData.walkingInstructions || ''}
                onChange={handleChange}
                placeholder="Preferred routes, leash behavior, etc."
                rows={2}
              />
            </div>
          </div>
          
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                if (id === 'new') {
                  navigate('/pets');
                } else {
                  setIsEditing(false);
                  setFormData(pet!);
                }
              }}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Pet'}
            </button>
          </div>
        </form>
      ) : (
        pet && (
          <div className="pet-details">
            <div className="detail-section">
              <h2>Basic Information</h2>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Breed:</span>
                  <span className="detail-value">{pet.breed}</span>
                </div>
                {pet.age !== undefined && (
                  <div className="detail-item">
                    <span className="detail-label">Age:</span>
                    <span className="detail-value">{pet.age} years</span>
                  </div>
                )}
                <div className="detail-item">
                  <span className="detail-label">Size:</span>
                  <span className="detail-value">{getSizeLabel(pet.size)}</span>
                </div>
                {pet.weight !== undefined && (
                  <div className="detail-item">
                    <span className="detail-label">Weight:</span>
                    <span className="detail-value">{pet.weight} lbs</span>
                  </div>
                )}
                {pet.temperament && (
                  <div className="detail-item full-width">
                    <span className="detail-label">Temperament:</span>
                    <span className="detail-value">{pet.temperament}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="detail-section">
              <h2>Care Information</h2>
              {pet.specialNeeds && (
                <div className="detail-item full-width">
                  <span className="detail-label">Special Needs:</span>
                  <span className="detail-value">{pet.specialNeeds}</span>
                </div>
              )}
              {pet.medicalInfo && (
                <div className="detail-item full-width">
                  <span className="detail-label">Medical Information:</span>
                  <span className="detail-value">{pet.medicalInfo}</span>
                </div>
              )}
              {pet.feedingInstructions && (
                <div className="detail-item full-width">
                  <span className="detail-label">Feeding Instructions:</span>
                  <span className="detail-value">{pet.feedingInstructions}</span>
                </div>
              )}
              {pet.walkingInstructions && (
                <div className="detail-item full-width">
                  <span className="detail-label">Walking Instructions:</span>
                  <span className="detail-value">{pet.walkingInstructions}</span>
                </div>
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default PetDetail;

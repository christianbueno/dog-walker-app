import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

interface Pet {
  id: string;
  name: string;
  breed: string;
  size: 'small' | 'medium' | 'large';
  temperament?: string;
  specialNeeds?: string;
  medicalInfo?: string;
}

const PetList: React.FC = () => {
  const { token } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchPets = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/pets`, {
          headers: {
            'x-auth-token': token,
          },
        });
        setPets(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch pets');
        console.error('Error fetching pets:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, [token, API_URL]);

  const handleDeletePet = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this pet?')) {
      try {
        setLoading(true);
        await axios.delete(`${API_URL}/pets/${id}`, {
          headers: {
            'x-auth-token': token,
          },
        });
        
        // Remove pet from state
        setPets(pets.filter(pet => pet.id !== id));
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete pet');
        console.error('Error deleting pet:', err);
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

  if (loading && pets.length === 0) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading pets...</p>
      </div>
    );
  }

  return (
    <div className="pet-list-page">
      <div className="pet-list-header">
        <h1>My Pets</h1>
        <Link to="/pets/new" className="btn btn-primary">
          <i className="fas fa-plus"></i> Add New Pet
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {pets.length === 0 ? (
        <div className="no-pets-message">
          <p>You don't have any pets yet. Add your first pet to get started!</p>
          <Link to="/pets/new" className="btn btn-primary">
            Add New Pet
          </Link>
        </div>
      ) : (
        <div className="pet-cards">
          {pets.map(pet => (
            <div key={pet.id} className="pet-card">
              <div className="pet-card-header">
                <h2>{pet.name}</h2>
                <span className="pet-size-badge">{getSizeLabel(pet.size)}</span>
              </div>
              <div className="pet-card-body">
                <div className="pet-detail-item">
                  <i className="fas fa-paw"></i>
                  <div>
                    <strong>Breed:</strong>
                    <div>{pet.breed}</div>
                  </div>
                </div>
                
                {pet.temperament && (
                  <div className="pet-detail-item">
                    <i className="fas fa-heart"></i>
                    <div>
                      <strong>Temperament:</strong>
                      <div>{pet.temperament}</div>
                    </div>
                  </div>
                )}
                
                {pet.specialNeeds && (
                  <div className="pet-detail-item">
                    <i className="fas fa-medkit"></i>
                    <div>
                      <strong>Special Needs:</strong>
                      <div>{pet.specialNeeds}</div>
                    </div>
                  </div>
                )}
              </div>
              <div className="pet-card-actions">
                <Link to={`/pets/${pet.id}`} className="btn btn-secondary">
                  <i className="fas fa-eye mr-1"></i> View Details
                </Link>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeletePet(pet.id)}
                  disabled={loading}
                >
                  <i className="fas fa-trash-alt mr-1"></i> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PetList;

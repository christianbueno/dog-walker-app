import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Define types
interface DogWalker {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  bio?: string;
  hourlyRate?: number;
  experience?: string;
  servicesOffered?: string[];
  rating?: number;
}

const DogWalkerSearch: React.FC = () => {
  const [dogWalkers, setDogWalkers] = useState<DogWalker[]>([]);
  const [filteredWalkers, setFilteredWalkers] = useState<DogWalker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    minRating: 0,
    maxPrice: 100,
    services: [] as string[],
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchDogWalkers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/users/dog-walkers`);
        setDogWalkers(response.data);
        setFilteredWalkers(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to fetch dog walkers');
        console.error('Error fetching dog walkers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDogWalkers();
  }, [API_URL]);

  useEffect(() => {
    // Apply filters and search
    let result = [...dogWalkers];

    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (walker) =>
          walker.firstName.toLowerCase().includes(term) ||
          walker.lastName.toLowerCase().includes(term) ||
          (walker.bio && walker.bio.toLowerCase().includes(term))
      );
    }

    // Apply rating filter
    if (filters.minRating > 0) {
      result = result.filter((walker) => (walker.rating || 0) >= filters.minRating);
    }

    // Apply price filter
    if (filters.maxPrice < 100) {
      result = result.filter((walker) => (walker.hourlyRate || 0) <= filters.maxPrice);
    }

    // Apply services filter
    if (filters.services.length > 0) {
      result = result.filter((walker) =>
        filters.services.every((service) =>
          walker.servicesOffered?.includes(service)
        )
      );
    }

    setFilteredWalkers(result);
  }, [searchTerm, filters, dogWalkers]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const isChecked = (e.target as HTMLInputElement).checked;
      const service = value;
      
      setFilters((prev) => ({
        ...prev,
        services: isChecked
          ? [...prev.services, service]
          : prev.services.filter((s) => s !== service),
      }));
    } else {
      setFilters((prev) => ({
        ...prev,
        [name]: type === 'number' ? Number(value) : value,
      }));
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dog walkers...</p>
      </div>
    );
  }

  return (
    <div className="dog-walker-search-page">
      <div className="search-header">
        <h1>Find a Dog Walker</h1>
        <p>Browse through our trusted dog walkers and find the perfect match for your furry friend.</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="search-container">
        <div className="search-filters">
          <h2>Filters</h2>
          <div className="filter-section">
            <div className="form-group">
              <label htmlFor="search">Search</label>
              <input
                type="text"
                id="search"
                className="form-control"
                placeholder="Search by name or bio"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="minRating">Minimum Rating</label>
              <input
                type="range"
                id="minRating"
                name="minRating"
                min="0"
                max="5"
                step="0.5"
                className="form-control"
                value={filters.minRating}
                onChange={handleFilterChange}
              />
              <span>{filters.minRating} stars</span>
            </div>

            <div className="form-group">
              <label htmlFor="maxPrice">Maximum Price (per hour)</label>
              <input
                type="range"
                id="maxPrice"
                name="maxPrice"
                min="10"
                max="100"
                step="5"
                className="form-control"
                value={filters.maxPrice}
                onChange={handleFilterChange}
              />
              <span>${filters.maxPrice}</span>
            </div>

            <div className="form-group">
              <label>Services</label>
              <div className="checkbox-group">
                <div className="form-check">
                  <input
                    type="checkbox"
                    id="service-walking"
                    name="services"
                    value="Walking"
                    className="form-check-input"
                    onChange={handleFilterChange}
                  />
                  <label htmlFor="service-walking" className="form-check-label">
                    Walking
                  </label>
                </div>
                <div className="form-check">
                  <input
                    type="checkbox"
                    id="service-sitting"
                    name="services"
                    value="Sitting"
                    className="form-check-input"
                    onChange={handleFilterChange}
                  />
                  <label htmlFor="service-sitting" className="form-check-label">
                    Sitting
                  </label>
                </div>
                <div className="form-check">
                  <input
                    type="checkbox"
                    id="service-training"
                    name="services"
                    value="Training"
                    className="form-check-input"
                    onChange={handleFilterChange}
                  />
                  <label htmlFor="service-training" className="form-check-label">
                    Training
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="search-results">
          <h2>Dog Walkers ({filteredWalkers.length})</h2>
          {filteredWalkers.length === 0 ? (
            <p className="no-results">No dog walkers found matching your criteria.</p>
          ) : (
            <div className="walker-cards">
              {filteredWalkers.map((walker) => (
                <div key={walker.id} className="walker-card">
                  <div className="walker-header">
                    <h3>
                      {walker.firstName} {walker.lastName}
                    </h3>
                    {walker.rating && (
                      <div className="walker-rating">
                        <span className="stars">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <i
                              key={i}
                              className={`fas fa-star ${
                                i < Math.floor(walker.rating || 0) ? 'filled' : ''
                              }`}
                            ></i>
                          ))}
                        </span>
                        <span className="rating-value">{walker.rating}</span>
                      </div>
                    )}
                  </div>
                  <div className="walker-details">
                    {walker.hourlyRate && (
                      <p className="walker-price">${walker.hourlyRate}/hour</p>
                    )}
                    {walker.bio && <p className="walker-bio">{walker.bio}</p>}
                    {walker.experience && (
                      <p className="walker-experience">
                        <strong>Experience:</strong> {walker.experience}
                      </p>
                    )}
                    {walker.servicesOffered && walker.servicesOffered.length > 0 && (
                      <div className="walker-services">
                        <strong>Services:</strong>
                        <ul>
                          {walker.servicesOffered.map((service) => (
                            <li key={service}>{service}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="walker-actions">
                    <Link to={`/dog-walkers/${walker.id}`} className="btn btn-primary">
                      View Profile
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DogWalkerSearch;

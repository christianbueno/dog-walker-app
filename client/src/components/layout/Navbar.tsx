import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = (dropdownId: string) => {
    setActiveDropdown(activeDropdown === dropdownId ? null : dropdownId);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        toggleRef.current && 
        !toggleRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
  }, [navigate]);

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-text">PawWalker</span>
        </Link>

        <button 
          ref={toggleRef}
          className={`menu-toggle ${isMenuOpen ? 'is-active' : ''}`} 
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          <span className="menu-icon"></span>
        </button>

        <div 
          ref={menuRef}
          className={`navbar-menu ${isMenuOpen ? 'is-active' : ''}`}
        >
          <div className="navbar-start">
            <Link to="/" className="navbar-item">
              Home
            </Link>
            <Link to="/dog-walkers" className="navbar-item">
              Find Dog Walkers
            </Link>
          </div>

          <div className="navbar-end">
            {isAuthenticated ? (
              <>
                <div className={`navbar-item has-dropdown ${activeDropdown === 'user-menu' ? 'is-active' : ''}`}>
                  <a 
                    className="navbar-link" 
                    onClick={() => toggleDropdown('user-menu')}
                  >
                    {user?.firstName} {user?.lastName}
                  </a>
                  <div className="navbar-dropdown">
                    <Link to="/dashboard" className="navbar-item">
                      Dashboard
                    </Link>
                    <Link
                      to={
                        user?.role === 'pet_owner'
                          ? '/profile/pet-owner'
                          : '/profile/dog-walker'
                      }
                      className="navbar-item"
                    >
                      Profile
                    </Link>
                    {user?.role === 'pet_owner' && (
                      <Link to="/pets" className="navbar-item">
                        My Pets
                      </Link>
                    )}
                    <Link to="/bookings" className="navbar-item">
                      Bookings
                    </Link>
                    <hr className="navbar-divider" />
                    <a className="navbar-item" onClick={handleLogout}>
                      Logout
                    </a>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="navbar-item">
                  Login
                </Link>
                <Link to="/register" className="navbar-item btn-primary">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

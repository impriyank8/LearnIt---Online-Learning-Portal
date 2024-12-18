import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaChevronDown } from 'react-icons/fa';
import SearchIcon from '@mui/icons-material/Search';
import './Styles/Header_after_signin.css';
import capLogo from '../Assets/Cap.png';
import DefaultProfilePic from '../Assets/profile-img.jpeg';

function Header2() {
  const [showSearch, setShowSearch] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [activeLink, setActiveLink] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState('');
  const [profilePic, setProfilePic] = useState(DefaultProfilePic);
  const location = useLocation();
  const navigate = useNavigate();

  const suggestions = [
    'Web Development',
    'Data Science',
    'Machine Learning',
    'Design',
    'Artificial Intelligence',
    'Cybersecurity',
    'Blockchain',
    'Cloud Computing',
    'JavaScript',
    'Python',
  ];

  const toggleSearch = () => {
    if (selectedSuggestion) {
      navigate(`/courses/${selectedSuggestion.toLowerCase().replace(/\s+/g, '-')}`);
      setSearchTerm('');
      setSelectedSuggestion('');
    } else {
      setSearchTerm('');
      setFilteredSuggestions([]);
    }
    setShowSearch(!showSearch);
  };

  const handleMouseEnter = () => setShowDropdown(true);
  const handleMouseLeave = () => setShowDropdown(false);

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      setActiveLink(sectionId);
    }
  };

  const handleSearchChange = (e) => {
    const userInput = e.target.value;
    setSearchTerm(userInput);
    if (userInput) {
      const filtered = suggestions.filter((suggestion) =>
        suggestion.toLowerCase().startsWith(userInput.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setSelectedSuggestion(suggestion);
    setFilteredSuggestions([]);
  };

  const handleLogout = () => {
    console.log('User logged out');
    navigate('/login');
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setProfilePic(reader.result);
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'contact'];
      let currentSection = '';

      sections.forEach((sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            currentSection = sectionId;
          }
        }
      });

      setActiveLink(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (location.pathname === '/') {
      setActiveLink('home');
    } else if (location.pathname.includes('/courses')) {
      setActiveLink('courses');
    } else if (location.pathname === '/contact') {
      setActiveLink('contact');
    }
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.profile-button') && !e.target.closest('.profile-dropdown')) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <header className="header">
      <div className="header-logo">
        <img src={capLogo} alt="Graduation Cap" className="logo-image" />
        LearnIt
      </div>

      <nav className="header-links-2">
        <Link to="/" className={activeLink === 'home' ? 'active' : ''} onClick={() => scrollToSection('home')}>
          Home
        </Link>
        <span className={`header-button ${activeLink === 'about' ? 'active' : ''}`} onClick={() => scrollToSection('about')}>
          About
        </span>
        <div className="dropdown" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <Link to="/courses" className={activeLink === 'courses' ? 'active' : ''}>
            Courses <FaChevronDown className={`dropdown-icon ${showDropdown ? 'open' : ''}`} />
          </Link>
          {showDropdown && (
            <div className="dropdown-menu">
              {suggestions.map((suggestion, index) => (
                <Link key={index} to={`/courses/${suggestion.toLowerCase().replace(/\s+/g, '-')}`}>
                  {suggestion}
                </Link>
              ))}
            </div>
          )}
        </div>
        <span className={`header-button ${activeLink === 'contact' ? 'active' : ''}`} onClick={() => scrollToSection('contact')}>
          Contact
        </span>
      </nav>

      <div className="searchBox">
        <input type="text" className="searchInput" placeholder="Search..." value={searchTerm} onChange={handleSearchChange} />
        <button className="searchButton" onClick={toggleSearch}>
          <SearchIcon style={{ color: '#ffffff' }} />
        </button>
        {filteredSuggestions.length > 0 && (
          <div className="suggestions-dropdown">
            {filteredSuggestions.map((suggestion, index) => (
              <div key={index} className="suggestion-item" onClick={() => handleSuggestionClick(suggestion)}>
                {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>

      <button className="profile-button" onClick={() => setShowProfileDropdown(!showProfileDropdown)}>
        <img src={profilePic} alt="Profile" />
      </button>
      {showProfileDropdown && (
        <div className="profile-dropdown">
          <Link to="/profile" className="dropdown-item">View Profile</Link>
          <Link to="/edit-profile" className="dropdown-item">Edit Profile</Link>
          {/* <label className="dropdown-item update-profile-pic">
            Update Profile Picture
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleProfilePicChange} />
          </label> */}
          <button className="dropdown-item" onClick={handleLogout}>Logout</button>
        </div>
      )}
    </header>
  );
}

export default Header2;

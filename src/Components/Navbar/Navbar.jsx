import React, { useState } from 'react';
import './Navbar.css';
import menu_icon from '../../assets/menu.png';
import logo from '../../assets/logo.jpg';
import search_icon from '../../assets/search.png';
import upload_icon from '../../assets/upload.png';
import notification_icon from '../../assets/notification.png';
import profile_icon from '../../assets/zin.jpg';
import shorts from '../../assets/shorts.png';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ setSidebar }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showUploadDropdown, setShowUploadDropdown] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const navigate = useNavigate();  // Use navigate instead of window.location.href

  const handleSidebarToggle = () => {
    setSidebar(prev => !prev);
  };

  const handleSearch = () => {
    if (searchTerm) {
      // Redirect to Feed page with search query
      navigate(`/feed?searchTerm=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <nav className='navbar'>
      <div className="nav-left">
        <img 
          className='menu-icon' 
          src={menu_icon} 
          alt="Menu Icon" 
          onClick={handleSidebarToggle} 
        />
      
          <img 
            className='logo' 
            src={logo} 
            alt="Logo" 
            onClick={() => window.location.href = '/'}
          />
      
      </div>

      <div className="nav-middle">
        <div className="search-box">
          <input 
            type="text" 
            placeholder='Search' 
            aria-label="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch() }}
          />
          <img 
            src={search_icon} 
            alt="Search Icon" 
            className="search-icon" 
            onClick={handleSearch}
          />
        </div> 
      </div>

      <div className="nav-right">
        <img 
          src={upload_icon} 
          alt="Upload Icon" 
          className="nav-icon" 
          onClick={() => setShowUploadDropdown(!showUploadDropdown)}
        />
        {showUploadDropdown && (
          <div className="dropdown-menu">
            <Link to="/upload">Upload Video</Link>
          </div>
        )}
        <Link to="/shorts">
        <img src={shorts} alt='Shorts' className="nav-short-icon"  />
        </Link>

        <img 
          src={notification_icon} 
          alt="Notification Icon" 
          className="nav-icon" 
          onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
        />
        {showNotificationDropdown && (
          <div className="dropdown-menu">
            <p>No new notifications</p>
          </div>
        )}

        <img 
          src={profile_icon} 
          alt="Profile Icon" 
          className='user-icon' 
        />
      </div>
    </nav>
  );
};

export default Navbar;

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Header.module.css';
import phonemeLogo from '../../../phoneme_logo.png';

const Header = ({ isDarkMode, toggleTheme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className={`${styles.header} ${isDarkMode ? styles.dark : styles.light}`}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <img src={phonemeLogo} alt="Phoneme Logo" className={styles.logoImg} />
        </Link>
        
        <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ''}`}>
          <Link 
            to="/" 
            className={`${styles.navLink} ${isActive('/') ? styles.active : ''}`}
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className={`${styles.navLink} ${isActive('/about') ? styles.active : ''}`}
          >
            About
          </Link>
          <Link 
            to="/support" 
            className={`${styles.navLink} ${isActive('/support') ? styles.active : ''}`}
          >
            Support
          </Link>
          <Link 
            to="/tools" 
            className={`${styles.navLink} ${isActive('/tools') ? styles.active : ''}`}
          >
            Employee Tools
          </Link>
        </nav>

        <div className={styles.headerActions}>
          <button 
            className={styles.themeToggle}
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          <div className={styles.notificationIcon}>🔔</div>
          <div className={styles.profileIcon}>👤</div>
        </div>

        <button 
          className={styles.menuToggle}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
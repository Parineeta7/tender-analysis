import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Landing.module.css';

const Landing = () => {
  const quickAccessItems = [
    {
      id: 1,
      title: 'HR Portal',
      description: 'Access your HR information and manage your benefits.',
      icon: '📱',
      link: '/dashboard',
      color: '#ff6b35'
    },
    {
      id: 2,
      title: 'IT Support',
      description: 'Get help with IT issues and access support resources.',
      icon: '💻',
      link: '/support',
      color: '#4CAF50'
    },
    {
      id: 3,
      title: 'Project Management',
      description: 'Manage your projects and collaborate with your team.',
      icon: '📋',
      link: '/tools',
      color: '#2196F3'
    },
    {
      id: 4,
      title: 'Quotation Generator',
      description: 'Generate quotations for clients and projects.',
      icon: '📊',
      link: '/tools',
      color: '#FF9800'
    },
    {
      id: 5,
      title: 'Employee Directory',
      description: 'Find contact information for your colleagues.',
      icon: '📱',
      link: '/tools',
      color: '#9C27B0'
    },
    {
      id: 6,
      title: 'Benefits Information',
      description: 'View and manage your benefits information.',
      icon: '🎯',
      link: '/tools',
      color: '#F44336'
    }
  ];

  return (
    <div className={styles.landing}>
      {/* Hero Section with Background Image */}
      <div className={styles.heroSection}>
        <div className={styles.heroBackground}>
          <img 
            src="https://images.pexels.com/photos/1181673/pexels-photo-1181673.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&dpr=2" 
            alt="Cloud computing technology background" 
            className={styles.backgroundImage}
          />
          <div className={styles.overlay}></div>
        </div>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              Welcome to <span className={styles.brandName}>PHONEME</span>
            </h1>
            <p className={styles.heroSubtitle}>
              Making technology friendly to human beings. Experience the power of voice 
              technology and innovative solutions designed for the modern world.
            </p>
            <Link to="/dashboard" className={styles.getStartedBtn}>
              Get Started
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Access Section */}
      <div className={styles.quickAccessSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Quick Access</h2>
            <p className={styles.sectionSubtitle}>Access your most used tools and resources</p>
          </div>
          
          <div className={styles.quickAccessGrid}>
            {quickAccessItems.map((item) => (
              <Link key={item.id} to={item.link} className={styles.accessCard}>
                <div className={styles.cardIcon} style={{ color: item.color }}>
                  {item.icon}
                </div>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardDescription}>{item.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const quickAccessItems = [
    {
      id: 1,
      title: 'HR Portal',
      description: 'Access your HR information and manage your benefits.',
      icon: '📱',
      link: '/hr-portal',
      color: '#ff6b35'
    },
    {
      id: 2,
      title: 'IT Support',
      description: 'Get help with IT issues and access support resources.',
      icon: '💻',
      link: '/it-support',
      color: '#4CAF50'
    },
    {
      id: 3,
      title: 'Project Management',
      description: 'Manage your projects and collaborate with your team.',
      icon: '📋',
      link: '/project-management',
      color: '#2196F3'
    },
    {
      id: 4,
      title: 'Quotation Generator',
      description: 'Generate quotations for clients and projects.',
      icon: '📊',
      link: '/quotation-generator',
      color: '#FF9800'
    },
    {
      id: 5,
      title: 'Employee Directory',
      description: 'Find contact information for your colleagues.',
      icon: '📱',
      link: '/employee-directory',
      color: '#9C27B0'
    },
    {
      id: 6,
      title: 'Benefits Information',
      description: 'View and manage your benefits information.',
      icon: '🎯',
      link: '/benefits',
      color: '#F44336'
    }
  ];

  return (
    <div className={styles.dashboard}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Quick Access</h1>
          <p className={styles.subtitle}>Access your most used tools and resources</p>
        </div>
        
        <div className={styles.grid}>
          {quickAccessItems.map((item) => (
            <div key={item.id} className={styles.card}>
              <div className={styles.cardIcon} style={{ color: item.color }}>
                {item.icon}
              </div>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.cardDescription}>{item.description}</p>
              <Link to={item.link} className={styles.cardLink} style={{ borderColor: item.color }}>
                Access Tool
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
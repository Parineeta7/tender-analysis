import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Tools.module.css';
import quotationImg from '../../../quotation.png';
import jobOfferImg from '../../../job-offer.png';

const Tools = () => {
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [searchTerm, setSearchTerm] = useState('');

  const tools = [
    {
      id: 2,
      title: 'Call Analytics',
      description: 'Analyze call patterns and performance metrics.',
      icon: '📞',
      category: 'Analytics',
      link: '/tools/call-analytics',
      featured: false
    },
    {
      id: 4,
      title: 'Language Translation',
      description: 'Real-time translation for multiple languages.',
      icon: '🌍',
      category: 'Translation',
      link: '/tools/translation',
      featured: false
    },
    {
      id: 6,
      title: 'API Documentation',
      description: 'Access comprehensive API documentation and examples.',
      icon: '📚',
      category: 'Development',
      link: '/tools/api-docs',
      featured: false
    },
    {
      id: 7,
      title: 'Phone Number Validation',
      description: 'Validate and format phone numbers globally.',
      icon: '✅',
      category: 'Utilities',
      link: '/tools/phone-validation',
      featured: false
    },
    {
      id: 8,
      title: 'Report Generator',
      description: 'Generate detailed reports and analytics.',
      icon: '📊',
      category: 'Analytics',
      link: '/tools/reports',
      featured: false
    },
    {
      id: 9,
      title: 'Quotation Generator',
      description: 'Create and download professional quotations for clients easily.',
      icon: <img src={quotationImg} alt="Quotation Generator" style={{ width: '2.5rem', height: '2.5rem', objectFit: 'contain' }} />, 
      category: 'Utilities',
      link: '/tools/quotation-generator',
      featured: true
    },
    {
      id: 10,
      title: 'Offer Letter Generator',
      description: 'Generate customized offer letters for new hires quickly.',
      icon: <img src={jobOfferImg} alt="Offer Letter Generator" style={{ width: '2.5rem', height: '2.5rem', objectFit: 'contain' }} />, 
      category: 'HR',
      link: '/tools/offer-letter-generator',
      featured: true
    },
    {
      id: 11,
      title: 'Information Extractor',
      description: 'Extract key information from documents or text automatically.',
      icon: '🔍',
      category: 'AI Tools',
      link: '/tools/information-extractor',
      featured: true
    },
    {
      id: 12,
      title: 'Veeam Backup Dashboard',
      description: 'Monitor and manage Veeam backup operations.',
      icon: '🖥️',
      category: 'Monitoring',
      link: '/tools/veeam-backup',
      featured: true
    }
  ];

  const categories = ['All Categories', ...new Set(tools.map(tool => tool.category))];

  const filteredTools = tools.filter(tool => {
    const matchesCategory = selectedCategory === 'All Categories' || tool.category === selectedCategory;
    const matchesSearch = tool.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={styles.tools}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Workplace Productivity Suite</h1>
          <p className={styles.subtitle}>
            Powerful tools and resources to enhance your productivity
          </p>
        </div>

        <div className={styles.featuredSection}>
          <h2 className={styles.sectionTitle}>Featured Tools</h2>
          <div className={styles.featuredGrid}>
            {tools.filter(tool => tool.featured).map((tool) => (
              <div key={tool.id} className={`${styles.toolCard} ${styles.featured}`}>
                <div className={styles.toolIcon}>{tool.icon}</div>
                <div className={styles.toolInfo}>
                  <span className={styles.toolCategory}>{tool.category}</span>
                  <h3 className={styles.toolTitle}>{tool.title}</h3>
                  <p className={styles.toolDescription}>{tool.description}</p>
                  <Link to={tool.link} className={styles.toolLink}>
                    Launch Tool →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.allToolsSection}>
          <h2 className={styles.sectionTitle}>All Tools</h2>
          <div className={styles.categoriesRow}>
            <div className={styles.categoriesNav}>
              {categories.map((category) => (
                <button 
                  key={category} 
                  className={`${styles.categoryBtn} ${selectedCategory === category ? styles.active : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className={styles.searchBarWrapper}>
              <input
                type="text"
                className={styles.searchBar}
                placeholder="Search tools by name..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className={styles.toolsGrid}>
            {filteredTools.map((tool) => (
              <div key={tool.id} className={styles.toolCard}>
                <div className={styles.toolIcon}>{tool.icon}</div>
                <div className={styles.toolInfo}>
                  <span className={styles.toolCategory}>{tool.category}</span>
                  <h3 className={styles.toolTitle}>{tool.title}</h3>
                  <p className={styles.toolDescription}>{tool.description}</p>
                  <Link to={tool.link} className={styles.toolLink}>
                    Launch Tool →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tools;
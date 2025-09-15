import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Landing from './components/Landing/Landing';
import Dashboard from './components/Dashboard/Dashboard';
import Tools from './components/Tools/Tools';
import Support from './components/Support/Support';
import About from './components/About/About';
import Footer from './components/Footer/Footer';
import BackupDashboard from './components/Veeambackup/BackupDashboard';
import InformationExtractor from './components/Tools/InformationExtractor';
import './App.css';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    document.body.className = isDarkMode ? 'dark-mode' : 'light-mode';
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <Router>
      <div className={`app ${isDarkMode ? 'dark' : 'light'}`} style={{minHeight: '100vh', display: 'flex', flexDirection: 'column'}}>
        <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/about" element={<About />} />
            <Route path="/support" element={<Support />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/tools/veeam-backup" element={<BackupDashboard />} />
            <Route path="/tools/information-extractor" element={<InformationExtractor />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
import React from 'react';

const GlobeIcon = ({ style, className }) => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" style={style} className={className}>
    <circle cx="20" cy="20" r="18" stroke="#F37021" strokeWidth="4" fill="white"/>
    <ellipse cx="20" cy="20" rx="8" ry="18" stroke="#F37021" strokeWidth="4" fill="none"/>
    <line x1="2" y1="20" x2="38" y2="20" stroke="#F37021" strokeWidth="4"/>
    <line x1="20" y1="2" x2="20" y2="38" stroke="#F37021" strokeWidth="4"/>
  </svg>
);

export default GlobeIcon; 
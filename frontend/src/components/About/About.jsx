import React from 'react';
import styles from './About.module.css';

const About = () => {
  const values = [
    {
      id: 1,
      text: "Innovate: Not just execute, but create new standards in the industry."
    },
    {
      id: 2,
      text: "Do business for long-term industry gain, not just short-term profit."
    },
    {
      id: 3,
      text: "Integrity is our most precious value—always do what is right."
    },
    {
      id: 4,
      text: "Know the facts: Good data leads to the right decisions."
    },
    {
      id: 5,
      text: "Work to live, not live to work. Find happiness in what you do—\"You only live once, and if you work it right, once is enough.\""
    }
  ];

  return (
    <div className={styles.about}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.imageSection}>
            <img 
              src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
              alt="IT team collaboration" 
              className={styles.aboutImage}
            />
          </div>
          
          <div className={styles.textSection}>
            <div className={styles.badge}>ABOUT</div>
            <h1 className={styles.title}>Who We Are</h1>
            
            <div className={styles.description}>
              <p>
                Founded by IITians, with the objective of making technologies friendly to 
                human beings. Our main goal is to reach the masses, especially in developing 
                nations where internet and literacy are major challenges.
              </p>
              
              <p>
                In the initial years, our focus is on Voice, the most widely used channel over 
                the phone. Over time, these technologies will pave the way into Mobile Apps 
                and embedded devices, making a difference everywhere.
              </p>
            </div>
            
            <div className={styles.values}>
              {values.map((value) => (
                <div key={value.id} className={styles.valueItem}>
                  <div className={styles.checkmark}>✓</div>
                  <p className={styles.valueText}>{value.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
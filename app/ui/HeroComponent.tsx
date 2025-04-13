'use client'
import Link from 'next/link';
import styles from '../ui/hero.module.css';
import Image from 'next/image';
import { useEffect, useState } from 'react';



const backgroundImages = [
  '/images/stadium.jpeg',
  '/images/team-blue.jpeg',
  '/images/virat-drive.jpeg',
  '/images/bgt-test.jpeg',
  '/images/ben-stokes.jpeg',
  
];
export default function Hero() {
   const [currentBgIndex, setCurrentBgIndex] = useState(0);

    useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 3000); 

    return () => clearInterval(interval);
  }, []);
  return (
    <section className={styles.hero}>
      {/* Background Image with Overlay */}
      <div className={styles.background}>
          {backgroundImages.map((src, index) => (
          <Image
            key={src}
            src={src}
            alt="Cricket background"
            fill
            priority={index === 0}
            quality={100}
            className={`${styles.backgroundImage} ${
              index === currentBgIndex ? styles.active : styles.inactive
            }`}
          />
        ))}
        <div className={styles.overlay}></div>
      </div>
      
      <div className={styles.content}>
        <h1 className={styles.title}>
          <span className={styles.highlight}>Crickstory</span> Universe
        </h1>
        <p className={styles.subtitle}>
  Where cricket lives beyond the field. Share stories, spark rivalries, and celebrate the game we love.
</p>
        
        {/* <div className={styles.searchContainer}>
          <input 
            type="text" 
            placeholder="Search players, matches, moments..." 
            className={styles.searchInput}
          />
          <button className={styles.searchButton}>
            <Image 
              src="/icons/search.svg" 
              alt="Search"
              width={20}
              height={20}
            />
          </button>
        </div> */}
        
        <div className={styles.ctaButtons}>
          <button className={`${styles.primaryButton} ${styles.buttonShine}`}>
            Explore Archive
          </button>
          <Link href='/posts'>
          <button className={styles.secondaryButton}>
            Post Moments
          </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
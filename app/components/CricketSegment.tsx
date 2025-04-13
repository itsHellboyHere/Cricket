'use client'
import styles from '../ui/CricketSegment.module.css';

export default function CricketSegment() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.segment}>
          <div className={styles.videoone}>
            <div className={styles.videoContainer}>
              <video autoPlay muted loop playsInline className={styles.video}>
                <source src="/cricket-highlights.mp4" type="video/mp4" />
              </video>
              <div className={styles.videoOverlay}>
                <span className={styles.staticText}>Cricket </span>
                <span className={styles.animatedText}>Highlights</span>
              </div>
            </div>
          </div>
          
          <div className={styles.videotwo}>
            <div className={styles.videoContainer}>
              <video autoPlay muted loop playsInline className={styles.video}>
                <source src="/dhonisix.mp4" type="video/mp4" />
              </video>
              <div className={styles.videoOverlay}>
                <span className={styles.staticText}>Cricket </span>
                <span className={styles.animatedText}>Legends</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
'use client'
// import { useEffect, useRef, useState } from 'react';
import styles from '../ui/CricketSegment.module.css';

export default function CricketSegment() {
//   const [activeSegment, setActiveSegment] = useState(0);
//   const videoRef1 = useRef<HTMLVideoElement>(null);
//   const videoRef2 = useRef<HTMLVideoElement>(null);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setActiveSegment(prev => (prev === 0 ? 1 : 0));
      
//       // Restart videos when switching
//       if (activeSegment === 0 && videoRef2.current) {
//         videoRef2.current.currentTime = 0;
//         videoRef2.current.play();
//       } else if (videoRef1.current) {
//         videoRef1.current.currentTime = 0;
//         videoRef1.current.play();
//       }
//     }, 8000); // Change every 8 seconds

//     return () => clearInterval(timer);
//   }, [activeSegment]);

return (
  <div className={styles.container}>
    <div className={styles.segment}>
      <div className={styles.videoone}>
        {/* Video 1 content */}
        <video autoPlay muted loop playsInline className={styles.video}>
          <source src="/cricket-highlights.mp4" type="video/mp4" />
        </video>
      </div>
      <div className={styles.videotwo}>
        {/* Video 2 content */}
        <video autoPlay muted loop playsInline className={styles.video}>
          <source src="/highlights.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  </div>
)
}
import Link from 'next/link';
import styles from '../ui/HomeNavbar.module.css';

export function AuthButtons() {
  return (
    <div className={styles.authButtons}>
      <Link href="/login" className={styles.loginButton}>Login</Link>
      <Link href="/signup" className={styles.signupButton}>Sign Up</Link>
    </div>
  );
}
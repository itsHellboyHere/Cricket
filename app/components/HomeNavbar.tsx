'use client'
import Link from 'next/link';
import { Josefin_Sans } from 'next/font/google';
import styles from '../ui/HomeNavbar.module.css';
import { UserProfile } from './UserProfile';
import { AuthButtons } from './AuthButtons';
import { MobileMenu } from './MobileMenu';
import { auth } from '@/auth';
import { useSession } from 'next-auth/react';

const josef = Josefin_Sans({ subsets: ['latin'] });

export default  function HomeNavbar() {
  const {data:session}= useSession();
  // console.log('Session user ID:', session?.user?.id);
  console.log('Session user:', session?.user);
  const user = session?.user;
  return (
    <nav className={`${styles.navbar} ${josef.className}`}>
      <div className={styles.logo}>
        <span className='text-fuchsia-300 underline text-3xl'>crick</span>story
      </div>

      <div className={styles.navItems}>
        <Link href="/" className={styles.navLink}>Home</Link>
        <Link href="/posts" className={styles.navLink}>Posts</Link>
        <Link href="/explore" className={styles.navLink}>Explore</Link>
        <Link href="/news" className={styles.navLink}>News</Link>
           {user ? (
          <UserProfile user={user} />
        ) : (
          <AuthButtons />
        )}
      </div>
      <MobileMenu user={user} />
      
    </nav>
  );
}
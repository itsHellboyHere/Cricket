'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from '../ui/HomeNavbar.module.css';
import { AuthButtonsMobile } from './AuthButtonsMobile';
import { UserProfileMobile } from './UserProfileMobile';
import { User } from 'next-auth';






export function MobileMenu({ user }: { user?:User }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <button 
        className={styles.mobileMenuButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        <span className={styles.menuIcon}>☰</span>
      </button>

      {isOpen && (
        <div className={styles.mobileMenu}>
          <Link href="/" className={styles.mobileNavLink} onClick={() => setIsOpen(false)}>Home</Link>
          <Link href="/posts" className={styles.mobileNavLink} onClick={() => setIsOpen(false)}>Posts</Link>
          <Link href="/explore" className={styles.mobileNavLink} onClick={() => setIsOpen(false)}>Explore</Link>
          <Link href="/news" className={styles.mobileNavLink} onClick={() => setIsOpen(false)}>News</Link>
          
          {user ? (
            <UserProfileMobile user={user} onClose={() => setIsOpen(false)} />
          ) : (
            <AuthButtonsMobile onClose={() => setIsOpen(false)} />
          )}
        </div>
      )}
    </>
  );
}
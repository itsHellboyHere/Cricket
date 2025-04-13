import Link from 'next/link';
import Image from 'next/image';
import styles from '../ui/HomeNavbar.module.css';

export function UserProfile({ user }: { user: any }) {
  return (
    <div className={styles.userProfile}>
      <Link href="/profile" className={styles.profileLink}>
        {user.image && (
          <Image
            src={user.image}
            alt={user.name || 'Profile'}
            width={32}
            height={32}
            className={styles.profileImage}
          />
        )}
        <span className={styles.username}>{user.name?.split(' ')[0]}</span>
      </Link>
    </div>
  );
}
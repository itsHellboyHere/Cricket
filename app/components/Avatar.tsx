'use client';

import Image from 'next/image';

export default function Avatar({
  src,
  alt,
  size = 48,
  className = ''
}: {
  src: string;
  alt: string;
  size?: number;
  className?: string;
}) {
  return (
    <div className={`rounded-full overflow-hidden ${className}`}>
      <Image
        src={src || '/default-avatar.png'}
        width={size}
        height={size}
        alt={alt}
        className="object-cover w-full h-full"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = '/default-avatar.png';
        }}
      />
    </div>
  );
}
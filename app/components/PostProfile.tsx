import Link from "next/link";
import { PostWithRelations } from "../types";
import styles from "../ui/Postprofile.module.css"
import Image from "next/image";

export default  function PostProfile({ post }: { post: PostWithRelations }) {
    return (
        <div className={styles.card}>
            {post.imageUrl && (
                <div className="relative w-full h-full">
                    <Link href={`/posts/${post.id}`}>
                        <Image
                            src={post.imageUrl}
                            fill
                            className="object-cover"
                            alt={post.title}
                            sizes="(max-width: 768px) 33vw, (max-width: 1200px) 25vw, 20vw"
                            priority={false} 
                        />
                    </Link>
                    <div className={styles.hoverOverlay}>
                        <Link href={`/posts/${post.id}`} className={styles.dynamicLink}>
                            View Details
                        </Link>
                    </div>
                </div>
            )}
        </div>
    )
}
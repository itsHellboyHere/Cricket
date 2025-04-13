import styles from "../ui/homegrid.module.css"
import Image from 'next/image';
export default function HomeGridComponent() {

    return (
        <div className={styles.container}>
            <div className={`${styles.item1} rounded-md `}>
                
                <Image
                    src="/images/cover.png"
                    alt="Cricket action shot"
                    fill
                    className={`${styles.gridImage} z-[0]`}
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                />
                
            </div>
            <div className={styles.item2}>
                <button className={styles.buttonshine}> Explore</button>
                 <Image
                    src="/images/kl-rahul.jpeg"
                    alt="Cricket action shot"
                    fill
                    className={`${styles.gridImage} z-[0]`}
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                />
            </div>
            <div className={styles.item3}>
                  
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className={styles.videoBackground}
                >

                    <source src="/crick-highlights/chennai-ipl.mp4" type="video/mp4" />
                    {/* <source src="/videos/cricket-background.webm" type="video/webm" /> */}

                </video>
                <div className={`${styles.videoContent} text-fuchsia-100 text-sm font-bold   z-[2] `}>
                    <h2>Post Highlights</h2>
                </div>
            </div>
            <div className={styles.item4}>
                <button className={styles.buttonshine}># gods</button>
                <Image
                    src="/images/sachin.jpeg"
                    alt="Cricket action shot"
                    fill
                    className={`${styles.gridImage} z-[0]`}
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                />
            </div>
            <div className={styles.item5}>
                    
                  <Image
                    src="/images/rohit-hitman.jpeg"
                    alt="Cricket action shot"
                    fill
                    className={`${styles.gridImage} z-[0]`}
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                />
            </div>
            <div className={styles.item6}>
                <button className={styles.buttonshine}># king</button>
                <Image
                    src="/images/virat-kohli.jpeg"
                    alt="Cricket action shot"
                    fill
                    className={styles.gridImage}
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                />

               
            </div>
            <div className={styles.item7}>
                 {/* <button className={styles.buttonshine}># legends</button> */}
                 <h2 className="font-bold text-zinc-50 opacity-80 from-dark-600 to-dark-700  z-[1] text-sm md:text-2xl">cricket <span className={`${styles.changetext} text-blue-400`}></span></h2>
            
            </div>
            <div className={styles.item8}>
                 <button className={styles.buttonshine}>IPL</button>
                 <Image
                    src="/images/Dharmshala.jpeg"
                    alt="Cricket action shot"
                    fill
                    className={styles.gridImage}
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                />
                
         <div>
  
</div>
        
            </div>
            <div className={`${styles.item9} `}>
                 <Image
                    src="/images/bgt-1.jpeg"
                    alt="Cricket action shot"
                    fill
                    className={styles.gridImage}
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                />
                {/* <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className={styles.videoBackground}
                >

                    <source src="/crick-highlights/t20.mp4" type="video/mp4" />
                   

                </video> */}
            </div>
            <div className={styles.item10}>
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className={styles.videoBackground}
                >

                    <source src="/crick-highlights/t20win.mp4" type="video/mp4" />
                  

                </video>
                
            </div>
        </div>
    )
}
import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import { useRouter } from "next/router";
import UserLayout from "@/layout/UserLayout";


export default function Home() {

  const router = useRouter();

  return (
    <UserLayout>
      <div className={styles.container}>

        <div className={styles.mainContainer}>

          <div className={styles.mainContainer__left}>
           <p>Connect with Friends without Exaggeration </p>

           <p>A true Social media platform, with stories no bluffs</p>

           <div onClick={() => {
            router.push("/login")
           }} className={styles.buttonJoin}>
            <p>Join Now</p>
           </div>
          </div>



          <div className={styles.mainContainer__right}>
            {/* <img src="images/nexoraback.jpg" alt=""/> */}
          </div>
        </div>
      </div>
    </UserLayout>
  );
}

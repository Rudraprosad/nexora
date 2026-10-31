import React, { useEffect } from 'react'
import styles from "./styles.module.css"
import { useRouter } from 'next/router'
import { setTokenIsThere } from '@/config/redux/reducer/authReducer';
import { useDispatch, useSelector } from 'react-redux';

export default function DashboardLayout
({children}) {

  const router = useRouter();

  const dispatch = useDispatch();

   const authState = useSelector((state) => state.auth)

  useEffect(() => {
      if(localStorage.getItem('token') === null){
          router.push("/login")
      }
  
     dispatch(setTokenIsThere())
  })

  return (
    <div className={styles.all}>   
      <div className={styles.container}>
              
       <div className={styles.homeContainer}>

        <div className={styles.homeContainer__leftBar}>

            <div onClick={() => {
              router.push("/dashboard")
            }} className={styles.sideBarOptions}> 
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18m3-13.636 10.5-3.819" />
</svg>
<p>Scroll</p>    
            </div>

                  <div onClick={() => {
              router.push("/discover")
            }} className={styles.sideBarOptions}> 
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 15.75-2.489-2.489m0 0a3.375 3.375 0 1 0-4.773-4.773 3.375 3.375 0 0 0 4.774 4.774ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
</svg>

<p>Discover</p>    
            </div>

             <div onClick={() => {
              router.push("/my_connections")
            }} className={styles.sideBarOptions}> 
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
</svg>


<p>Connections</p>    
            </div>

        </div>

         <div className={styles.feedContainer}>
           
           {children}

       </div>

       <div className={styles.extraContainer}>
          <h3>Top Profiles</h3>

          {authState.all_profiles_fetched && authState.all_users.map((profile) => {
               return (
                    <div key={profile._id} className={styles.extraContainer__profile}>
                      <img src={profile.profile_pic} alt=""/>
                      <p>{profile.userId.name}</p>
                    </div>
               )
          })}
       </div>

       </div>

      </div>
 
<div className={styles.mobileNavBar}>
<div onClick={() => {
              router.push("/dashboard")
            }} className={styles.singleItem__mobileView}>
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m1.5.5-1.5-.5M6.75 7.364V3h-3v18m3-13.636 10.5-3.819" />
</svg>
</div>

<div onClick={() => {
  router.push("/discover")
}} className={styles.singleItem__mobileView}>
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 15.75-2.489-2.489m0 0a3.375 3.375 0 1 0-4.773-4.773 3.375 3.375 0 0 0 4.774 4.774ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
</svg>
</div>


<div onClick={() => {
  router.push("/my_connections")
}} className={styles.singleItem__mobileView}>
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
</svg>
</div>

</div>

    </div>

  )
}

import { BASE_URL, clientServer } from '@/config';
import DashboardLayout from '@/layout/DashboardLayout';
import UserLayout from '@/layout/UserLayout';
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import styles from "./index.module.css";
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { getAllPosts } from '@/config/redux/action/postAction';
import { getConnectionRequests, getMyConnectionRequests, sendConnectionRequest } from '@/config/redux/action/authAction';

export default function ViewProfilePage({userProfile}) {

  // connections request logic

  const router = useRouter();
  const postReducer = useSelector((state) => state.posts);
  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth)

  const [userPosts, setUserPosts] = useState([]);

  const [isCurrentUserInConnection, setIsCurrentUserInConnection] = useState(false);

  const [isConnectionNull, setIsConnectionNull] = useState(true);

  const getUserPosts = async () => {
    await dispatch(getAllPosts());
    await dispatch(getConnectionRequests({token: localStorage.getItem("token")}));
    await dispatch(getMyConnectionRequests({token: localStorage.getItem("token")}))
  }


useEffect(() => {
  let post = postReducer.posts.filter((post) => { // we are checking if the userId of the profile and the userId of the post is same if so then bring it to this page

    return post.userId.username === router.query.username

  })
  setUserPosts(post);
}, [postReducer.posts]) // if there are any new posts the function will trigger automatically


useEffect(() => {
  console.log(authState.connections, userProfile.userId._id)
  if (authState.connections.some(user => user.connectionId._id === userProfile.userId._id)){
    setIsCurrentUserInConnection(true)

    if(authState.connections.find(user => user.connectionId._id === userProfile.userId._id).status_accepted === true){
      setIsConnectionNull(false)
    }
}
 if (authState.connectionRequest.some(user => user.userId._id === userProfile.userId._id)){
    setIsCurrentUserInConnection(true)

    if(authState.connectionRequest.find(user => user.userId._id === userProfile.userId._id).status_accepted === true){
      setIsConnectionNull(false)
    }
  }
}, [authState.connections, authState.connectionRequest])



useEffect(() => {
  getUserPosts();
}, [])





    const searchParams = useSearchParams();

    useEffect(() => {
      console.log("From view: view profile") // this console log gets printed in the browser console
    })
  return ( //// now if we do view source for that page we can see all the details for that user and the username is already inside div tag
    
    <UserLayout>
    <DashboardLayout>
    <div className={styles.container}>
      <div className={styles.backdropContainer}>
        <img className={styles.backdrop} src={`${BASE_URL}/${userProfile.userId.profilePicture}`} alt="profilePicture" />

      </div>

      <div className={styles.profileContainer__details}>

        <div className={styles.profileContainer__flex}>

          <div style={{flex: "0.8"}}>

<div style={{display: "flex", width: "fit-content", alignItems: "center", gap: "1.2rem"}}>
  <h2>{userProfile.userId.name}</h2>
<p style={{color: "grey"}}>@{userProfile.userId.username}</p>
</div>

<div style={{display: "flex", gap: "1rem", alignItems: "center"}}>
  {isCurrentUserInConnection ?
<button className={styles.connectedBtn}>{isConnectionNull ? "pending" : "Connected"}</button>
:
<button onClick={() => {
  dispatch(sendConnectionRequest({token: localStorage.getItem("token"), user_id: userProfile.userId._id}))
}} className={styles.connectBtn}>Connect</button>}

<div onClick={ async () => {
const response = await clientServer.get(`/user/download_resume?id=${userProfile.userId._id}`);
window.open(`${BASE_URL}/${response.data.message}`, "_blank")
}} className={styles.downloadBtn}>
<svg  xmlns="http://www.w3.org/2000/svg" width={24} height={24} 
fill={"currentColor"} viewBox={"0 0 24 24"}>
<path d="m21.8 6.4-2.7-3.6c-.38-.5-.97-.8-1.6-.8h-11c-.63 0-1.23.3-1.6.8L2.2 6.4h.01c-.13.18-.21.37-.21.6v13c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-.23-.09-.42-.21-.59h.01ZM6.5 4h11L19 6H5zM4 20V8h16v12z"></path><path d="M13 10h-2v4H8l4 4 4-4h-3z"></path>
</svg>
</div>

</div>

<div>
  <p>{userProfile.bio}</p>
</div>
          </div>

          <div style={{flex: "0.2"}}>

<h1>Recent Activity</h1>
{userPosts.map((post) => {
  return(
    <div key={post._id} className={styles.postCard}>
      <div className={styles.card}>
        <div className={styles.card__profileContainer}>

           {post.media !== "" ? <img src={`${BASE_URL}/${post.media}`} alt="" /> 
           : 
           <div style={{width: "3.4rem", height: "3.4rem"}}></div>} 

        </div>
        <p>{post.body}</p>
      </div>
    </div>
  )
})}

          </div>
        </div>
      </div>

     <div className="workHistory">

      <h4>Work History</h4>

      <div className={styles.workHistoryContainer}>
{
  userProfile.pastWork.map((work, index) => {
    return(
      <div key={index} className={styles.workHistoryCard}>
      <p style={{fontWeight: "bold", display: "flex", alignItems: "center", gap: "0.8rem"}}>
        {work.company} - {work.position}
      </p>
<p>{work.years}</p>
      </div>
    )
  })
}
      </div>
     </div>

      </div> 
    </DashboardLayout>
    </UserLayout> 
  )
}


export async function getServerSideProps(context) { //to bring that particular username in the searchengine's scope we can use SSR to do that we bring the username from the backend server side through context 

console.log("from view") // this console log gets printed in the terminal of frontend in my IDE

console.log(context.query.username)

const request = await clientServer.get("/user/get_profile_based_on_username", {
  params: {
    username: context.query.username
  }
})

const response = await request.data;
console.log(response)

 return { props: {userProfile: request.data.profile}} //this is mandatory to give props in the return from this it brings all the necessery things 

}
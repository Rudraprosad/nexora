import DashboardLayout from '@/layout/DashboardLayout'
import UserLayout from '@/layout/UserLayout'
import React, { useEffect, useState } from 'react'
import styles from "./index.module.css";
import { BASE_URL, clientServer } from '@/config';
import { useDispatch, useSelector } from 'react-redux';
import { getAboutUser } from '@/config/redux/action/authAction';
import { useRouter } from 'next/router';
import { getAllPosts } from '@/config/redux/action/postAction';

export default function ProfilePage() {

  const router = useRouter();

  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth);

  const postReducer = useSelector((state) => state.posts);

 const [userProfile, setUserProfile] = useState({});

  const [userPosts, setUserPosts] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

 const [inputData, setInputData] = useState({company: '', position:'', years:''})

 const handleInputChange = (e) => {
const {name, value} = e.target;
setInputData({...inputData, [name]: value} )
 }

useEffect(() => {
    dispatch(getAboutUser({token: localStorage.getItem("token")}))
    dispatch(getAllPosts())
}, [])

useEffect(() => {

  if(authState.user != undefined){
    setUserProfile(authState.user)
let post = postReducer.posts.filter((post) => { // we are checking if the userId of the profile and the userId of the post is same if so then bring it to this page

    return post.userId.username === authState.user.userId.username

  })
    setUserPosts(post);
  }
}, [authState.user, postReducer.posts])


const updateProfilePic = async (file) => {
  const formData = new FormData();
  formData.append("profile_picture", file);
  formData.append("token", localStorage.getItem("token"));

  const response = await clientServer.post("/update_profile_picture", formData, {
    headers: {
      'content-type': 'multipart/form-data',
    },
  });
  dispatch(getAboutUser({token: localStorage.getItem("token")}));
}

const updateProfileData = async () => {

if(!userProfile.userId) return;

  const request = await clientServer.post("/user_update", {
    token: localStorage.getItem("token"),
    name: userProfile.userId.name,
  });

  const response = await clientServer.post("/update_profile_data", {
    token: localStorage.getItem("token"),
    bio: userProfile.bio,
    currentPost: userProfile.currentPost,
    pastWork: userProfile.pastWork
  });

  dispatch(getAboutUser({token: localStorage.getItem("token")}));

}




  return (
    <UserLayout>
        <DashboardLayout>
{authState.user && userProfile.userId &&
    <div className={styles.container}>
      <div className={styles.backdropContainer}>
        <div className={styles.effect}>
        <label htmlFor='profilePic' className={styles.overlay}>Edit</label>
        <input onChange={(e) => {
          updateProfilePic(e.target.files[0])
        }} hidden type="file" id="profilePic" />
        <img src={`${BASE_URL}/${userProfile.userId.profilePicture}`} alt="profilePicture" />
      </div>
      </div>

      <div className={styles.profileContainer__details}>

        <div style={{display: "flex", gap: "0.7rem"}}>

          <div style={{flex: "0.8"}}>

<div style={{display: "flex", width: "fit-content", alignItems: "center", gap: "1.2rem"}}>
  <input className={styles.nameEdit} typr="text" value={userProfile.userId.name} onChange={(e) => {
    setUserProfile({...userProfile, userId: {...userProfile.userId, name: e.target.value}})
  }} />
<p style={{color: "grey"}}>@{userProfile.userId.username}</p>
</div>

<div>
 <textarea
 value={userProfile.bio}
 onChange={(e) => {
  setUserProfile({...userProfile, bio: e.target.value});
 }}
 rows={Math.max(3, Math.ceil(userProfile.bio.length / 80))}
 style={{width: "100%"}}
 />
</div>
          </div>

          <div style={{flex: "0.2"}}>
 </div>

<div style={{display: "flex", flexDirection: "column"}}>
<h1>Recent Activity</h1>
{userPosts.map((post) => {
  return(
    <div key={post._id} className={styles.postCard}>
      <div className={styles.card}>
        <div className={styles.card__profileContainer}>

           {post.media !== "" ? <img src={`${BASE_URL}/${post.media}`} alt="" /> 
           : 
           <div style={{width: "3.4rem", height: "2.4rem"}}></div>} 

        </div>
        <p>{post.body}</p>
      </div>
    </div>
  )
})}
</div>

          </div>
        </div>
     
     <div style={{display: "flex", flexDirection: "column", gap: "1rem"}}>

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

      <button className={styles.addWork} onClick={() => {
setIsModalOpen(true);
}}
>Add Work</button>
     </div>

     <div style={{display: "flex", flexDirection:"column", gap:"1rem"}}>
      <h4>Education</h4>
<div className={styles.educationContainer}>

{
  userProfile.education.map((education, idx) => {
    return(
      <div key={idx} className={styles.educationCard}>
        <p style={{fontWeight: "bold", display: "flex", alignItems: "center", gap: "0.8rem"}}>
          {education.school} - {education.degree}
        </p>
        <p>{education.fieldOfStudy}</p>
      </div>
    )
  })
}
</div>
<button className={styles.addWork} onClick={() => {
setIsModalOpen(true);
}}
>Add Education</button>
     </div>

{userProfile != authState.user &&
 <div onClick={() => {
  updateProfileData()
 }} className={styles.connectionBtn}>
  Update Profile  
  </div>}

      </div>
}

{
       isModalOpen &&
        <div onClick={() => {
         setIsModalOpen(false)
        }} className={styles.commentsContainer}>
          <div onClick={(e) => {
             e.stopPropagation() // stops propagating event to the childern div it avoids the resetpostid event to trigger
          }} className={styles.allCommentsContainer}>

      <input onChange={handleInputChange} name='company' className={styles.inputField} type="text" placeholder='Company'></input>
            <input onChange={handleInputChange} name='position' className={styles.inputField} type="text" placeholder='Position'></input>
                  <input onChange={handleInputChange} name='years' className={styles.inputField} type="Number" placeholder='Years'></input>
          <div onClick={() => {
            setUserProfile({...userProfile, pastWork: [...userProfile.pastWork, inputData]})
            setIsModalOpen(false)
          }} className={styles.addWork}>add+</div>
          </div>

        </div>
      }

            
        </DashboardLayout>
    </UserLayout>
  )
}

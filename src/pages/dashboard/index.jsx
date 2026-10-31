import { getAboutUser, getAllUsers } from '@/config/redux/action/authAction';
import { createPost, deletePost, getAllComments, getAllPosts, increamentPostLike, postComment } from '@/config/redux/action/postAction';
import UserLayout from '@/layout/UserLayout';
import { useRouter } from 'next/router'
import React, {useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import DashboardLayout from '@/layout/DashboardLayout';
import styles from "./styles.module.css";
import { BASE_URL } from '@/config';
import { resetPostId } from '@/config/redux/reducer/postReducer';

export default function dashboard
() {

    const router = useRouter();

    const dispatch = useDispatch();

    const authState = useSelector((state) => state.auth)

    const postState = useSelector((state) => state.posts)


useEffect(() => {

  if(authState.isTokenThere) {

    dispatch(getAllPosts())
    dispatch(getAboutUser({ token: localStorage.getItem('token') }))

  }

  if(!authState.all_profiles_fetched) {
    dispatch(getAllUsers());
  }

}, [authState.isTokenThere])

const [postContent, setPostContent] = useState("");
const [fileContent, setFileContent] = useState();
const [commentText, setCommentText] = useState("")

const handleUpload = async () => {
  await dispatch(createPost({file: fileContent, body: postContent}));
  setPostContent("")
  setFileContent(null)
  dispatch(getAllPosts()) // as soon as we post we need to get all posts again so that feed keeps updating on post  
}

// useState(() => {
//   setInterval(() => {
//      dispatch(getAllPosts())
//   }, 900) //long pollling not recommended, instead of we can use sockets but this longpolling code checkes post on that given interval of time
// })

if(authState.user) {  // this code represents that if there is a user esists then return the profilepic and all that or else return loading and in authreducer the user is given undefined as initial state
  return (
    <UserLayout>

    <DashboardLayout>
      
        <div className={styles.scrollComponent}>
         <div className={styles.wrapper}>
          <div className={styles.createPostContainer}>
           <img className={styles.userProfile} src={`${BASE_URL}/${authState.user.userId.profilePicture}`} alt=""/>
          <textarea onChange={(e) => setPostContent(e.target.value)} value={postContent} placeholder={"what's up"} className={styles.textArea} name="" id=""></textarea>
          <label htmlFor='fileUpload'>
          <div className={styles.Fab}>
            <svg  xmlns="http://www.w3.org/2000/svg" width="24" height="24"  
fill="currentColor" viewBox="0 0 24 24" >
<path d="M21 7.99h-5V3c0-.55-.45-1-1-1H9c-.55 0-1 .45-1 1v4.99H3c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h5V21c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-5.01h5c.55 0 1-.45 1-1v-6c0-.55-.45-1-1-1m-1 6h-5c-.55 0-1 .45-1 1V20h-4v-5.01c0-.55-.45-1-1-1H4v-4h5c.55 0 1-.45 1-1V4h4v4.99c0 .55.45 1 1 1h5z"></path>
</svg>
          </div>
          </label>
          <input onChange={(e) => setFileContent(e.target.files[0])} type="file" hidden id='fileUpload' />
          {postContent.length > 0 &&
          <div onClick={handleUpload} className={styles.uploadButton}>Post</div>
          }
          </div>

          <div className={styles.postsContainer}>

             {postState.posts.map((post) => {
               return (
                <div key={post._id} className={styles.singleCard}>
                
                  <div className={styles.singleCard__profileContainer}>
                    <img className={styles.userProfile} src={`${BASE_URL}/${post.userId.profilePicture}`} alt="" />
                    <div>
                      <div style={{display: "flex", gap: "1rem", justifyContent: "space-between"}}>
                    <p style={{fontWeight: "bold"}}>{post.userId.name}</p>
                    { // the delete svg should only appear if the post is of the user other users should not be able to delete other user's post
                    post.userId._id === authState.user.userId._id &&
                    <div onClick={ async () => {
                     await dispatch(deletePost({post_id: post._id}))
                     await dispatch(getAllPosts())
                    }} style={{cursor: "pointer"}}>
                <svg style={{height:"1em", color: "pink"}} xmlns="http://www.w3.org/2000/svg" width="24" height="24"  
fill="currentColor" viewBox="0 0 24 24" >
<path d="M17 6V4c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v2H2v2h2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8h2V6zM9 4h6v2H9zm1 14H8v-8h2zm6 0h-2v-8h2z"></path>
</svg>
</div>
                    }
                    
                    </div>
                    <p style={{color: "grey"}}>@{post.userId.username}</p>
                    <p style={{paddingTop: "1.3rem"}}>{post.body}</p>

                    <div className={styles.singleCard__image}>
                   {post.media !== "" ? <img src={`${BASE_URL}/${post.media}`} alt=""/> : <></>}  
                    </div>

                    <div className={styles.optionsContainer}>
    <div onClick={async () => {
      await dispatch(increamentPostLike({ post_id: post._id}))
      dispatch(getAllPosts())
    }} className={styles.singleOption__optionsContainer}>
     <svg  xmlns="http://www.w3.org/2000/svg" width={24} height={24} 
fill={"currentColor"} viewBox={"0 0 24 24"}>
<path d="M20 8h-5.61l1.12-3.37c.2-.61.1-1.28-.27-1.8-.38-.52-.98-.83-1.62-.83h-1.61c-.3 0-.58.13-.77.36L6.54 8H4.01c-1.1 0-2 .9-2 2v9c0 1.1.9 2 2 2h13.31a2 2 0 0 0 1.87-1.3l2.76-7.35c.04-.11.06-.23.06-.35v-2c0-1.1-.9-2-2-2ZM6 19H4v-9h2zm14-7.18L17.31 19H8V9.36L12.47 4h1.15l-1.56 4.68a1.01 1.01 0 0 0 .95 1.32h7v1.82Z"></path>
</svg>
<p>{post.likes}</p>
    </div>

  <div onClick={() => {
    dispatch(getAllComments({post_id: post._id}))
  }} className={styles.singleOption__optionsContainer}>
<svg  xmlns="http://www.w3.org/2000/svg" width={24} height={24} 
fill={"currentColor"} viewBox={"0 0 24 24"}>
<path d="M20 3H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h3v2c0 .36.19.69.51.87a1 1 0 0 0 1-.01L13.27 19h6.72c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2Zm0 14h-7c-.18 0-.36.05-.51.14L9 19.23V18c0-.55-.45-1-1-1H4V5h16z"></path><path d="m16 9-1-1-1-1-1.15 1.15 2 2zm-3 3 1.15-1.15-2-2L11 10l-3 3v2h2z"></path>
</svg>
  </div>

 <div onClick={() => {
   const text = encodeURIComponent(post.body)
   const url = encodeURIComponent("nexora.com") // here we can use our app url ot post id
   const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
   window.open(twitterUrl, "_blank")
 }} className={styles.singleOption__optionsContainer}>
<svg  xmlns="http://www.w3.org/2000/svg" width={24} height={24} 
fill={"currentColor"} viewBox={"0 0 24 24"}>
<path d="M5.5 15.5c1.07 0 2.02-.5 2.67-1.26l6.87 3.87c-.01.13-.04.26-.04.39 0 1.93 1.57 3.5 3.5 3.5s3.5-1.57 3.5-3.5-1.57-3.5-3.5-3.5c-1.07 0-2.02.5-2.67 1.26l-6.87-3.87c.01-.13.04-.26.04-.39s-.02-.26-.04-.39l6.87-3.87C16.47 8.5 17.42 9 18.5 9 20.43 9 22 7.43 22 5.5S20.43 2 18.5 2 15 3.57 15 5.5c0 .13.02.26.04.39L8.17 9.76A3.48 3.48 0 0 0 5.5 8.5C3.57 8.5 2 10.07 2 12s1.57 3.5 3.5 3.5m13 1.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5m0-13c.83 0 1.5.67 1.5 1.5S19.33 7 18.5 7 17 6.33 17 5.5 17.67 4 18.5 4m-13 6.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5S4 12.83 4 12s.67-1.5 1.5-1.5"></path>
</svg>
 </div>
   </div>

                    </div>
                  </div>

                </div>
               )
             })}

          </div>
          </div>

        </div>
      {
        postState.postId !== "" &&
        <div onClick={() => {
          dispatch(resetPostId())
        }} className={styles.commentsContainer}>
          <div onClick={(e) => {
             e.stopPropagation() // stops propagating event to the childern div it avoids the resetpostid event to trigger
          }} className={styles.allCommentsContainer}>

        {postState.comments.length === 0 && <h2>No Comments</h2>}

        {postState.comments.length !== 0 &&
        <div>
       {postState.comments.map((comment, index) => {
       return (
        <div className={styles.singleComment} key={comment._id}>
          <div className={styles.singleComment__profileContainer}>
            <img src={`${BASE_URL}/${comment.userId.profilePicture}`} alt=""/>
            <div>
              <p style={{fontWeight: "bold", fontSize: "1.2rem"}}>{comment.userId.name}</p>
              <p>@{comment.userId.username}</p>
            </div>
          </div>
          {comment.body}
        </div>
       )
       })}

        </div>
        }

         <div className={styles.postCommentsContainer}>
          <input type="" value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder='Comment'/>
          <div onClick={async() => {
                   await dispatch(postComment({ post_id: postState.postId, body: commentText})) 
                   setCommentText("")   
                   await dispatch(getAllComments({post_id: postState.postId}))
          }} className={styles.postCommentsContainer__commentBtn}>
            <p>comment</p>
          </div>
         </div>

          </div>

        </div>
      }

    </DashboardLayout>

    </UserLayout>
  )
  
} else {

  return (
    <UserLayout>
    <DashboardLayout>
      <h2>Loading...</h2>
    </DashboardLayout>

    </UserLayout>
  )

}

}

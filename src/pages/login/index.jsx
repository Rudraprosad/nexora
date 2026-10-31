import UserLayout from '@/layout/UserLayout'
import { useRouter } from 'next/router'
import React, {useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styles from "./styles.module.css"
import { loginUser, registerUser } from '@/config/redux/action/authAction'
import { emptyMessage } from '@/config/redux/reducer/authReducer'
// auth component not only for login but registering also
function LoginComponent() {


  const authState = useSelector((state) => state.auth) // this auth is comming from store.js under redux under config

  const router = useRouter();

  const dispatch = useDispatch();

  const [userLoginMethod, setUserLoginMethod] = useState(false);


const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [username, setUsername] = useState("");
const [name, setName] = useState("");



   useEffect(() => {
   // only redirect after loginUser.fulfilled sets loggedIn=true
   // registerUser.fulfilled no longer sets loggedIn=true, so this won't fire on signup
   if(authState.loggedIn){
          router.push("/dashboard")
   }
   }, [authState.loggedIn])

   useEffect(() => {
  if(localStorage.getItem("token")){
    router.push("/dashboard")
  }
   }, [])

   useEffect(() => {
    dispatch(emptyMessage()); // to invoke any action we will have to use dispatch
   }, [userLoginMethod])

   const handleRegister = () => {
          console.log("registering...");
          dispatch(registerUser({username, password, email, name}));
   }

   const handleLogin = () => {
    console.log("login...")
    dispatch(loginUser({email, password}))
   }

  return (
    <UserLayout>
          
         <div className={styles.container}>
          <div className={styles.cardContainer}>
              <div className={styles.cardContainer__left}>

                <p className={styles.cardLeft__heading}>{userLoginMethod ? "Sign In" : "Sign Up" }</p>
                 <p style={{color: authState.isError ? "red": "green"}}> {authState.message.message} </p>
                 
               <div className={styles.inputContainers}>


               {!userLoginMethod && <div className={styles.inputRow}>
                 <input onChange={(e) => setUsername(e.target.value)} className={styles.inputField} type="text" placeholder='Username'></input>
                 <input onChange={(e) => setName(e.target.value)} className={styles.inputField} type="text" placeholder='Name'></input>

               </div>
}
                     <input onChange={(e) => setEmail(e.target.value)} className={styles.inputField} type="text" placeholder='Email'></input>

                 <input onChange={(e) => setPassword(e.target.value)} className={styles.inputField} type="text" placeholder='Password'></input>

                 <div onClick={() => {
                    if(userLoginMethod){
                       handleLogin();
                    } else{
                      handleRegister(); //the onClick is written to connect auth with backend
                    }
                 }} className={styles.buttonWithOutline}>
                   <p> {userLoginMethod ? "Sign In" : "Sign Up"}</p> 
                 </div>
               </div>



              </div>

              <div className={styles.cardContainer__right}>
                {userLoginMethod ? <p>Don not have an account?</p> : <p>Already have an Account?</p>}
              
              <div onClick={() => {
                    setUserLoginMethod(!userLoginMethod)
                 }} style={{color:"black", textAlign: 'center'}}className={styles.buttonWithOutline}>
                   <p> {userLoginMethod ? "Sign Up" : "Sign In"}</p> 
                 </div>
              </div>

          </div>
       </div>
   
    </UserLayout>
  )
}

export default LoginComponent
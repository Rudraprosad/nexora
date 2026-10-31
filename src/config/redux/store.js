/**
 * STEPS FOR STATE MANAGEMENT
 * submit action
 * handle action in it's reducer
 * register here -> reducer
 * after writting the reducer here we will need to wrap component in provider in app.js in pages
 */

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducer/authReducer";
import postReducer from "./reducer/postReducer";



export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postReducer
  }
})
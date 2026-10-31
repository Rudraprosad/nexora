import { clientServer } from "@/config";
import { createAsyncThunk } from "@reduxjs/toolkit";



export const getAllPosts = createAsyncThunk(
    "post/getAllPosts",
    async(_, thunkAPI) => {
          try{

            const response = await clientServer.get('/posts')

            return thunkAPI.fulfillWithValue(response.data)

          } catch(err){
            return thunkAPI.rejectWithValue(err.response.data)
          }
    }
)

export const createPost = createAsyncThunk(
  "post/createPost",
  async(userData, thunkAPI) => {
    const {file, body} = userData;

    try{

      const formData = new FormData();
      formData.append('token', localStorage.getItem('token'));
      formData.append('body', body)
      formData.append('media', file)

      const response = await clientServer.post("/post", formData, {
          headers: { // passing the headers here is important because the form data will be multipart
              'Content-Type': 'multipart/form-data' // now multer will start handling it and put it in the form format
          }
      });

      if(response.status === 200) {
        return thunkAPI.fulfillWithValue("post uploaded")
      } else{
        return thunkAPI.rejectWithValue("post not uploaded")
      }

    } catch(err){
      return thunkAPI.rejectWithValue(err.response.data)
    }
  }
)

export const deletePost = createAsyncThunk(
  "post/deletePost",
  async (post_id, thunkAPI) => {

    try{
        const response = await clientServer.delete("/delete_post", {
          data: {
            token: localStorage.getItem("token"),
            post_id: post_id.post_id
          }
        })
        return thunkAPI.fulfillWithValue(response.data)

    } catch(err){
          return thunkAPI.rejectWithValue("invalid")
    }
  }
)

export const increamentPostLike = createAsyncThunk(
 "post/increamentPostLike",
 async (post, thunkAPI) => {

  try{
  const response = await clientServer.post(`/increament_like`, {
    post_id: post.post_id,
    token: localStorage.getItem("token")
  })
  return thunkAPI.fulfillWithValue(response.data);

  } catch(err){
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
 }
)

export const getAllComments = createAsyncThunk(
  "post/getAllComments",
  async (postData, thunkAPI) => {
    try{
      const response = await clientServer.get("/get_comments", {
        params: {
          post_id: postData.post_id
        }
      })

      return thunkAPI.fulfillWithValue({
        comments: response.data,
           post_id: postData.post_id
      })
    } catch(err){
       return thunkAPI.rejectWithValue("something went wrong")
    }
  }
)

export const postComment = createAsyncThunk(
  "post/postComment",
  async (commentData, thunkAPI) => {
    try{
      console.log({
        post_id: commentData.post_id,
        body: commentData.body
      })
      const respone = await clientServer.post("/comment", {
        token: localStorage.getItem("token"),
        post_id: commentData.post_id,
        commentBody: commentData.body // these params here links with backend controller whatever we are taking as response in controller
      });
      return thunkAPI.fulfillWithValue(respone.data)
    } catch(err){
      return thunkAPI.rejectWithValue("something went wrong")
    }
  }
)
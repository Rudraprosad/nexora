import { createAsyncThunk } from "@reduxjs/toolkit";
import { clientServer } from "@/config";


export const loginUser = createAsyncThunk(
    "user/login", 
    async (user, thunkAPI) =>{ // using thunkAPI we can redirect reduce and fulfill things
        try{
           const response = await clientServer.post(`/login`, {
            email: user.email,
            password: user.password
           });
           
           if(response.data.token){
           localStorage.setItem("token", response.data.token)
           } else{
            return thunkAPI.rejectWithValue({
                message: "token not provided"
            })
           }

             return thunkAPI.fulfillWithValue(response.data.token) // fulfillwithvalue is a actin and response.data.token is a type of payload
        } catch(error){
            return thunkAPI.rejectWithValue(error.response.data)
        }

    }
)

export const registerUser = createAsyncThunk (
    "user/register",
    async (user, thunkAPI) => { 


    try {
         
       const request = await clientServer.post("/register", {
         username: user.username, // the user os comming from the above user
         password: user.password,
         email: user.email,
         name: user.name,
       })

       return thunkAPI.fulfillWithValue({ message: "registration is succesfull, please login" }) // ✅ Fix: return so fulfilled fires correctly

    } catch (err) {
        return thunkAPI.rejectWithValue(err.response.data)
    }

    }
)

export const getAboutUser = createAsyncThunk(
    "user/getAboutUser",
    async (user, thunkAPI) => {
        try{
            const response = await clientServer.get("/get_user_and_profile", {
                params:{   // it was a get request thats why we neede to put it inside params
                    token: user.token
                }
            })

            return thunkAPI.fulfillWithValue(response.data)
            
        } catch(err){
            return thunkAPI.rejectWithValue(err.response.data)
        }
    }
)


export const getAllUsers = createAsyncThunk (
    "user/getAllUsers",
    async(_, thunkAPI) => {
        try{

            const response = await clientServer.get("/user/get_all_users")

            return thunkAPI.fulfillWithValue(response.data)
        } catch(err){
            return thunkAPI.rejectWithValue(err.response.data)
        }
    }
)

export const sendConnectionRequest = createAsyncThunk(
    "user/sendConnectionRequest",
    async (user, thunkAPI) => {
        try{
         const response = await clientServer.post("/user/send_connection_request", {
            token: user.token,
            connectionId: user.user_id
         })
        thunkAPI.dispatch(getConnectionRequests({token: user.token}))
         return thunkAPI.fulfillWithValue(response.data)
        } catch(err){
         return thunkAPI.rejectWithValue(err.response.data.message);
        }
    }
)

export const getConnectionRequests = createAsyncThunk(
"user/getConnectionRequests",
async (user, thunkAPI) => {
    try{
      const response = await clientServer.get("/user/getConnectionRequests", {
        params: {
            token: user.token
        }
      })
      return thunkAPI.fulfillWithValue(response.data.connections);
    } catch(err){
return thunkAPI.rejectWithValue(err.response.data.message)
    }
}
)

export const getMyConnectionRequests = createAsyncThunk(
"user/getMyConectionRequests",
async (user, thunkAPI) => {
    try{   // so if any action is done using the clientServer then inside .get or .post or whatever we need to use the same routes as used in backend routes
    const response = await clientServer.get("/user/user_connection_request", {
        params: { // incase of get method we need to pass the data as params
            token: user.token
        }

    });
    return thunkAPI.fulfillWithValue(response.data)
    } catch(err){
return thunkAPI.rejectWithValue(err.response.data.message)
    }
}
)

export const acceptConnection = createAsyncThunk(
    "user/acceptConnection",
    async(user, thunkAPI) => {
        try{
            const response = await clientServer.post("/user/accept_connection_request", {
        token: user.token,
       requestId: user.connectionId,
        action_type: user.action
            })
            thunkAPI.dispatch(getConnectionRequests({token: user.token}))
            thunkAPI.dispatch(getMyConnectionRequests({token: user.token}))
          return thunkAPI.fulfillWithValue(response.data)
        } catch(err){
return thunkAPI.rejectWithValue(err.response.data.message)
        }
    }
)
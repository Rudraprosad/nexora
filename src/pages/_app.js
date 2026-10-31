import { store } from "@/config/redux/store";
import "@/styles/globals.css";
import { Provider } from "react-redux";

export default function App({ Component, pageProps }) {

// the store inside provider is the store from config
  return <>
  <Provider store= {store}> 
  <Component {...pageProps} />
  </Provider>
  </>
}

import axios from "axios";
import "dotenv/config";

export const BASE_URL = process.env.BACKEND_PORT;

export const  clientServer = axios.create({
    baseURL: BASE_URL,
}) 
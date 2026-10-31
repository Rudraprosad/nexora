import axios from "axios";

export const BASE_URL = process.env.BACKEND_PORT;

export const  clientServer = axios.create({
    baseURL: BASE_URL,
}) 
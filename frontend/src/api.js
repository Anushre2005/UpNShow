import axios from "axios"
const BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api"
const instance = axios.create({ baseURL: BASE })
export function setToken(token){ if (token) instance.defaults.headers.common["x-auth-token"] = token 
    else delete instance.defaults.headers.common["x-auth-token"] }
export default instance

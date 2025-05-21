import axios from "axios"
import summarApi, { baseUrl } from "../common/SummaryApi"

const Axios = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
})

export default Axios
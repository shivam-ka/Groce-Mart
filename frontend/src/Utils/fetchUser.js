import summarApi from "../common/SummaryApi"
import Axios from "./Axios"

const accessToken = localStorage.getItem('accessToken')

const fetchUser = async () => {
    if (accessToken) {
        try {
            const response = await Axios({
                ...summarApi.getCurrentUser,
            })

            return response
        } catch (error) {
            console.log(error)
        }
    }
}

export default fetchUser
import summarApi from "../common/SummaryApi"
import Axios from "./Axios"

const fetchUser = async () => {
    try {
        const response = await Axios({
            ...summarApi.getCurrentUser
        })
        
        return response
    } catch (error) {
        console.log(error)
    }
}

export default fetchUser
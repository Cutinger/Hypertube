import axios from "axios";
const headers = { "Content-Type": "application/json" };
const burl = 'http://localhost:5000/api'

export default {
    withAuth: () => {
        return axios.get(
            `${burl}/checkToken`,
            {
                withCredentials: 'true',
                headers: headers
            }
        )
    }
}

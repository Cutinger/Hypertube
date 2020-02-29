import axios from "axios";
const headers = { "Content-Type": "application/json" };
const burl = 'http://localhost:5000/api'

export default {
    withAuth: () => {
        return axios.get(
            `${burl}/users/checkToken`,
            {
                withCredentials: 'true',
                headers: headers
            }
        )
    },
    register: (firstname, lastname, email, username, password, password_confirm) => {
        return axios.post(
            `${burl}/users/register`,
            {firstname, lastname, email, username, password, password_confirm},
            { headers: headers }
        )
    },
    login: (username, password) => {
        return axios.post(
            `${burl}/users/login`,
            {username, password},
            {
                withCredentials: 'true',
                headers: headers
            }
        )
    },
    logout: () => {
        return axios.post(
            `${burl}/users/logout`,
            {},
            {
                withCredentials: 'true',
                headers: headers,
            }
        )
    },
    stream: (quality, imdb_id) => {
        return axios.get(
            `${burl}/movies/${quality}/${imdb_id}`,
            {},
            {
                // withCredentials: 'true',
                headers: headers,
            }
        )
    }
}

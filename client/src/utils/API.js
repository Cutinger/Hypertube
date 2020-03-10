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
        return axios.get(
            `${burl}/users/logout`,
            {
                withCredentials: 'true',
                headers: headers,
            }
        )
    },
    stream: (stream, quality, imdb_id) => {
        return axios.get(
            `${burl}/movies/${stream}/${quality}/${imdb_id}`,
            {
                withCredentials: 'true',
                headers: headers,
            }
        )
    },
    getMovieSources: (imdb_id) => {
        return axios.get(
            `${burl}/movies/${imdb_id}`,
            {
                withCredentials: 'true',
                headers: headers,
            }
        )
    },
    facebookAuth: () => {
        return axios.get(
            `${burl}/auth/facebook`,
            {
                withCredentials: 'true',
                headers: headers
            }
        )
    },
    getWatchlist: () => {
        return axios.get(
            `${burl}/watchlist`,
            {
                withCredentials: 'true',
                headers: headers
            }
        )
    },
    likeWatchlist: (movieID) => {
        return axios.get(
            `${burl}/movies/${movieID}/watchlist`,
            {
                withCredentials: 'true',
                headers: headers
            }
        )
    },
    getComments: (movieID) => {
        return axios.get(
            `${burl}/comments/${movieID}`,
            {
                withCredentials: 'true',
                headers: headers
            }
        )
    },
    addComment: (movieID, comment) => {
        return axios.post(
            `${burl}/comment/${movieID}`,
            {comment},
            {
                withCredentials: 'true',
                headers: headers
            }
        )
    }
}

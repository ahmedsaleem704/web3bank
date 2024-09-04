import axios from "axios"

const API_URL = `http://localhost:3000/api`

const postReq = async (endpoint, data) => {
    return axios.post(`${API_URL}${endpoint}`, data)
}

const getReq = async (endpoint) => {
    return axios.get(`${API_URL}${endpoint}`)
}

export {
    postReq,
    getReq
}

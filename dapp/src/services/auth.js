import { appStorage } from "../utils"
import { postReq } from "./common"

const register = async ({ email, password, firstName, lastName, phone, address, walletAddress, cnic }) => {
    return postReq('/account/signup', {
        email,
        password,
        firstName,
        lastName,
        phone,
        address,
        walletAddress,
        cnic
    })
}

const login = async (email, password) => {
    const response = await postReq('/account/login', {
        email,
        password
    })

    if (response.data) {
        appStorage.setItem("user", JSON.stringify(response.data.user))
    }

    return response.data
}

const logout = async () => {
    appStorage.removeItem("user")
    const response = await postReq('/account/logout')
    return response.data
}

const getCurrentUser = () => {
    return JSON.parse(appStorage.getItem("user"))
}

const AuthService = {
    register,
    login,
    logout,
    getCurrentUser,
}

export default AuthService
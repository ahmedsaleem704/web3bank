import { USER } from "../constants/actions"
import { userContextInitialState } from "../contexts/userContext"

const userReducer = (state = {}, action) => {
    switch (action.type) {
        case USER.CHAIN_INIT:
            return { ...state, chain: { ...action.payload } }
        case USER.SITE_INIT:
            return { ...state, site: { ...action.payload } }
        case USER.LOGOUT:
            return { ...userContextInitialState }
        default:
            throw new Error(`invalid reducer action ${action}`)
    }
}

export default userReducer

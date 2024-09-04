import { createContext, useReducer, useContext } from "react";
import userReducer from "../reducers/userReducer";

const UserContext = createContext()
const initialState = {
    site: {},
    chain: {}
}

const UserProvider = ({ children }) => {
    const [state, dispatch] = useReducer(userReducer, initialState)

    return <UserContext.Provider value={{ userState: state, userDispatch: dispatch }}>
        {children}
    </UserContext.Provider>
}

const useUserContext = () => useContext(UserContext)

export { UserProvider, useUserContext, initialState as userContextInitialState }

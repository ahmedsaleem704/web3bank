//protected routing code:
import { Navigate, Outlet } from 'react-router-dom'
const ProtectedRoute = ({ isLogged }) => {
    return isLogged ? <Outlet /> : <Navigate to="/account/login?m=requiresAuth" />
}
export default ProtectedRoute
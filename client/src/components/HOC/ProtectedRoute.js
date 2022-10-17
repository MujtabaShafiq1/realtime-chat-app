import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import Loader from "../UI/Loader";

const ProtectedRoute = () => {

    const user = useSelector((state) => state.user)

    if (user.status === null) return <Loader />

    return (
        user.status ? <Outlet /> : <Navigate to="/login" replace />
    )
}

export default ProtectedRoute
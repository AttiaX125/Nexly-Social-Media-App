import { useContext } from "react";
import { Navigate } from "react-router"
import { AuthUserContext } from "../../Contexts/AutUserContext/AuthUserProvider";

export default function ProtectedRoute({children}) {
    const {token} = useContext(AuthUserContext)
    if (!token){
        return <Navigate to='/login' replace/>;
    }
  return children;
}

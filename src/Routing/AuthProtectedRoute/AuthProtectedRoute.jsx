import { useContext } from "react"
import { Navigate } from "react-router"
import { AuthUserContext } from "../../Contexts/AutUserContext/AuthUserProvider"

export default function AuthProtectedRoute({children}) {
    const {token} = useContext(AuthUserContext)
    if (token){
        return <Navigate to= "/"/>
    }
  return (
    <>
    {children}
    </>
  )
}

import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { createContext, useState } from "react"

export const AuthUserContext = createContext(null)

export default function AuthUserProvider({children}) {
      const [token, setToken] = useState(function (){
      return localStorage.getItem('token')
    })
 const [userData, setUserData] = useState(null);

  async function getUserData() {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/users/profile-data`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
       
      );
      setUserData(response.data.data.user);
      return response.data.data.user

  }
/*use Query  */

const {isLoading} = useQuery({
  queryKey: ['userProfile'],
  queryFn: getUserData,
  enabled: !!token
})


    const tokenObject = {token, setToken ,setUserData, userData, getUserData, isLoading}
  return (
    <AuthUserContext value={tokenObject}>
      {children}
    </AuthUserContext>
  )
}

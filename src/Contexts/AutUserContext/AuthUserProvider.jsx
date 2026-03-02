import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { createContext, useEffect, useState } from "react"

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

  // Fetch user when token changes
useEffect(() => {
  console.log(userData);
}, [userData]);

/*use Query  */

useQuery({
  queryKey: ['userProfile'],
  queryFn: getUserData,
  enabled: !!token
})


    const tokenObject = {token, setToken ,setUserData, userData, getUserData}
  return (
    <AuthUserContext value={tokenObject}>
      {children}
    </AuthUserContext>
  )
}

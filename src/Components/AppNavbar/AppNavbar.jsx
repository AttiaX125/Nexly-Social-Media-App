import { Button, Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenu, NavbarMenuItem, NavbarMenuToggle } from "@heroui/react";
import { useContext, useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";
import logo from "../../assets/logo.png"
import {
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
} from "@heroui/react";
import { AuthUserContext } from "../../Contexts/AutUserContext/AuthUserProvider";
import toast from "react-hot-toast";
import axios from "axios";
export default function AppNavbar() {
  const uploadImageRef = useRef();
  const BookmarksRouter = useNavigate()
  const myProfileRouter = useNavigate()
  const logoutRouter = useNavigate()
 const {token, setToken, setUserData, userData, getUserData} = useContext( AuthUserContext )
   const [isMenuOpen, setIsMenuOpen] = useState(false);

   /*Function Handler */
   function logOutHandler (){
    localStorage.clear();
    setToken(null);
    setUserData(null);
    logoutRouter('/login');
   }
   async function handleImageProfile(){
    const imageFormData = new FormData();
    imageFormData.append("photo" , uploadImageRef.current.files[0])
    toast.promise(
      axios.put(`${import.meta.env.VITE_BASE_URL}/users/upload-photo` , imageFormData , {
        headers:{
          token: localStorage.getItem('token')
        }
      })
      ,
   {
     loading: 'Uploading ......',
     success: function (){
     getUserData()
      return <p>Holaaaaaaaa ------</p>
     },
     error: <b>cry..........</b>,
   }
 );
   }
   const [isScrolled, setIsScrolled] = useState(false);

useEffect(() => {
  const handleScroll = () => {
    setIsScrolled(window.scrollY > 10);
  };

  window.addEventListener("scroll", handleScroll);
  return () => window.removeEventListener("scroll", handleScroll);
}, []);
   if (userData){
  return (
    <>
   <Navbar
  isBordered
 isMenuOpen={isMenuOpen}
  onMenuOpenChange={setIsMenuOpen}
   className={`
    fixed top-0 w-full z-50
    transition-all duration-500
    ${isScrolled 
      ? "bg-black/40 backdrop-blur-2xl shadow-2xl" 
      : "bg-transparent backdrop-blur-0"}`}
>

  {/* Left - Logo */}
  <NavbarContent justify="start">
    <NavbarBrand as={Link} to="/">
      <img className="w-36" src={logo} alt="Social App Logo" />
    </NavbarBrand>
  </NavbarContent>

  {/* 🔥 Center Navigation */}
  {token && (
    <NavbarContent justify="center" className="hidden sm:flex gap-4">
      <div className="relative">
            <div className="relative flex gap-6 px-8 py-2 rounded-2xl
      bg-black/60 backdrop-blur-2xl
      border border-white/10 shadow-xl">      <NavbarItem>
        <NavLink
          to="posts"
          className={({ isActive }) =>
            `px-4 py-1.5 rounded-2xl transition-all duration-300 font-medium
            ${
              isActive
                ? "bg-white/10 text-white shadow-lg  border border-white/20"
                : "text-white/70 hover:text-white hover:bg-white/5"
            }`
          }
        >
          Posts
        </NavLink>
      </NavbarItem>

      <NavbarItem>
        <NavLink
          to="mybookmarks"
          className={({ isActive }) =>
            `px-4 py-1.5 rounded-2xl transition-all duration-300 font-medium
            ${
              isActive
                ? "bg-white/10 text-white shadow-lg border border-white/20"
                : "text-white/70 hover:text-white hover:bg-white/5"
            }`
          }
        >
          My Bookmarks
        </NavLink>
      </NavbarItem>

      <NavbarItem>
        <NavLink
          to="myprofile"
          className={({ isActive }) =>
            `px-4 py-1.5 rounded-2xl transition-all duration-300 font-medium
            ${
              isActive
                ? "bg-white/10 text-white shadow-lg border border-white/20"
                : "text-white/70 hover:text-white hover:bg-white/5"
            }`
          }
        >
          My Profile
        </NavLink>
      </NavbarItem></div>
      </div>


    </NavbarContent>
  )}

  {/* Right - Avatar / Auth */}
  <NavbarContent justify="end">
    {token ? (
      <NavbarItem>
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform hover:scale-105"
              size="sm"
              src={userData.photo}
            />
          </DropdownTrigger>

          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold text-sm">Signed in as</p>
              <p className="font-semibold text-xs text-white/60">
                {userData.email}
              </p>
            </DropdownItem>

            <DropdownItem
              key="my_Profile"
              onClick={() => myProfileRouter("/myProfile")}
            >
              My Profile
            </DropdownItem>

            <DropdownItem
              key="Bookmarks"
              onClick={() => BookmarksRouter("mybookmarks")}
            >
              My Bookmarks
            </DropdownItem>

            <DropdownItem
              key="photo"
              onClick={() => uploadImageRef.current.click()}
            >
              Upload Profile image
            </DropdownItem>

            <DropdownItem
              key="logout"
              color="danger"
              onClick={logOutHandler}
            >
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <input
          type="file"
          className="hidden"
          ref={uploadImageRef}
          onChange={handleImageProfile}
        />
      </NavbarItem>
    ) : (
      <NavbarItem>
        <Button
          as={Link}
          to="signup"
          className="bg-linear-to-br from-[#6366F1] to-[#8B5CF6] text-white font-semibold rounded-2xl px-5 shadow-lg hover:scale-105 transition"
        >
          Sign Up
        </Button>
      </NavbarItem>
    )}
  </NavbarContent>
</Navbar>
    </>
  )
   }

}

import { createBrowserRouter } from "react-router";
import Layout from "../Components/Layout/Layout";
import Posts from "../Pages/Posts/Posts";
import Login from "../Pages/Login/Login";
import SignUp from "../Pages/SignUp/SignUp";
import NotFoundPage from "../Pages/NotFoundPage/NotFoundPage";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
import AuthProtectedRoute from "./AuthProtectedRoute/AuthProtectedRoute";
import MyProfile from "../Pages/MyProfile/MyProfile";
import MyBookmarks from "../Pages/MyBookmarks/MyBookmarks";
import SinglePost from "../Pages/SinglePost/SinglePost";

export const Router =createBrowserRouter([
{
  path: "/",
  element: <Layout />,
  children: [
    { index: true, element: <ProtectedRoute><Posts/></ProtectedRoute> },
    { path: "login", element: <AuthProtectedRoute><Login/></AuthProtectedRoute> },
    { path: "signup", element: <AuthProtectedRoute><SignUp/></AuthProtectedRoute> },
    { path: "posts", element: <ProtectedRoute><Posts/></ProtectedRoute> },
    { path: "mybookmarks", element: <ProtectedRoute><MyBookmarks/></ProtectedRoute> },
    { path: "postDetails/:postId", element: <ProtectedRoute><SinglePost/></ProtectedRoute> },
    { path: "myProfile", element: <ProtectedRoute><MyProfile/></ProtectedRoute> },
    { path: "*", element: <NotFoundPage/> }
  ]
}
])
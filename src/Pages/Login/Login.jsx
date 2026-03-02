import { Button, Form, Input } from "@heroui/react";

import  { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import toast from "react-hot-toast";
import { useContext } from "react";
import { AuthUserContext } from "../../Contexts/AutUserContext/AuthUserProvider";


const validationSchema = zod.object({
  email: zod.email("Please enter a valid email"),
  password: zod.string("Password is required").regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, "Please enter a valid Password").nonempty("Password is required"),
})

export default function Login() {
  const homeNavigate = useNavigate()
  /*============= Hooks Handler===================== */
  const {setToken, setUserData , userData} = useContext(AuthUserContext)
  const [loading, setLoading] = useState(false)
  const {handleSubmit, register, formState: {errors}} = useForm({
    defaultValues : {
  email: "",
  password: "",
    },
    mode: "all",
    resolver: zodResolver(validationSchema)
  });
  /*======================================================= */
  /*=====================Function Handler===================== */
  async function sendLoginUserData(userDataLogin){
    setLoading(true);
    toast.promise(
  axios.post(`${import.meta.env.VITE_BASE_URL}/users/signin`,userDataLogin),
   {
     loading: 'Saving...',  
     success: function(msg){
      //console.log(msg)
      setUserData(msg.data.data.user);
      localStorage.setItem("userData", JSON.stringify(msg.data.data.user));
      setToken(msg.data.data.token);
      localStorage.setItem('token',msg.data.data.token);
      console.log(userData)
        setLoading(false);
     homeNavigate("/posts");
     <p className="text-emerald-700">{msg.data.message}</p>},
     error: function(msg) {
        setLoading(false);
      <p className="text-red-500">{msg.response.data.errors}</p>},
   }
 );
  }
  /*========================================================== */
  return (
    <div >
      <div
        className="
        mt-20
mx-auto
  max-w-4xl
  
  bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-xl
"
      >
        <Form onSubmit={handleSubmit(sendLoginUserData)} className="w-full max-w-4xl flex flex-col gap-4">
          <h1 className="font-semibold text-4xl text-gray-300 self-center">
            Welcome Back
          </h1>
          <p className="text-gray-400 self-center">Sign in to your account</p>



          <Input
          {...register("email")}
            isRequired
              isInvalid={!!errors.email}
            errorMessage={errors.email?.message}
            className="text-gray-300"
            label="Email"
            labelPlacement="outside"
            placeholder="Enter your Email"
            type="email"
                  classNames={{
              label: "text-gray-300!"
             }}
          />
          <Input
          {...register("password")}
            isRequired
              isInvalid={!!errors.password}
            errorMessage={errors.password?.message}
             classNames={{
              label: "text-gray-300!"
             }}
            label="Password"
            labelPlacement="outside"
            autoComplete="new-password"
            placeholder="Enter your Password"
            type="password"
          />

          <div className="flex mx-auto gap-2 ">
<Button
  type="submit"
  isLoading={loading}
  className="
    w-60 
    py-3
    bg-black/35
    backdrop-blur-xl
    border
    border-white/10
    text-white
    font-medium
    rounded-xl
    shadow-[0_8px_30px_rgba(0,0,0,0.6)]
    hover:bg-black/60
    hover:border-white/20
    transition-all
    duration-300
  "
>
  Sign in
</Button>
          </div>
          <div className="w-80 h-px rounded-xl bg-gray-900 self-center"></div>
          <p className="self-center text-gray-500">Do not have an account? <span className="text-indigo-200 font-medium"><Link to="/signup"> Sign Up</Link></span></p>
        </Form>
      </div>
    </div>
  )
}

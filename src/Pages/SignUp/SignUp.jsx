import { Button, Form, Input } from "@heroui/react";

import  { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import toast from "react-hot-toast";
const validationSchema = zod.object({
  name: zod.string("Name must be text").regex(/[a-zA-Z][a-zA-Z ]{5,18}/, "Please Enter a valid name").nonempty("Name is required"),
    username: zod.string("User Name must be text").regex(/[a-zA-Z][a-zA-Z ]{5,18}/, "Please Enter a valid username").nonempty("User Name is required"),
  email: zod.email("Please enter a valid email"),
  dateOfBirth : zod.coerce.date().refine((value) => {
  const today = new Date();
  const birthDate = new Date(value);
  let age = today.getFullYear() - birthDate.getFullYear();

  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age >= 18;
}, {
  error: "User must be above 18",
}).transform(function(value){
    return value.toLocaleDateString("en-CA")
  }),
  password: zod.string("Password is required").regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, "Please enter a valid Password").nonempty("Password is required"),
  rePassword: zod.string("Password is required").regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/, "Please enter a valid Password").nonempty("Confirm Password is required"),
  gender: zod.enum(["male","female"])
}).refine(function({password, rePassword}){
  if(password == rePassword){
    return true;
  }else{
    return false;
  }
},{
  error: "Password and Confirm Password did not matched",
  path: ["rePassword"]
})

export default function SignUp() {
  const loginNavigate = useNavigate()
  /*============= Hooks Handler===================== */
  const [loading, setLoading] = useState(false)
  const {handleSubmit, register, setValue, formState: {errors}} = useForm({
    defaultValues : {
   name: "",
  username: "",
  email: "",
  dateOfBirth : "",
  gender : "",
  password: "",
  rePassword: ""
    },
    mode: "all",
    resolver: zodResolver(validationSchema)
  });
  const [selected, setSelected] = useState("");
  /*======================================================= */
  /*=====================Function Handler===================== */
  async function sendUserData(userData){
    setLoading(true);
    toast.promise(
  axios.post(`${import.meta.env.VITE_BASE_URL}/users/signup`,userData),
   {
     loading: 'Saving...',
     success: function(msg){
        setLoading(false);
     loginNavigate("/login");
    return <> <p className="text-emerald-700">{msg.data.message}</p></>},
     error: function(msg) {
        setLoading(false);
      return <><p className="text-red-500">{msg.response.data.errors}</p></>},
   }
 );
  }
  /*========================================================== */
  return (
    <div className="">
      <div
        className="
        mt-20
mx-auto
  max-w-4xl
  text-gray-300
  bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-xl
"
      >
        <Form onSubmit={handleSubmit(sendUserData)} className="w-full max-w-4xl flex flex-col gap-4">
          <h1 className="font-semibold text-4xl text-gray-200 self-center">
            Get Started
          </h1>
          <p className="text-gray-400 self-center">Create your account</p>

          <Input
            isRequired
            {...register("name")}
            className="p-0"
            isInvalid={!!errors.name}
            errorMessage={errors.name?.message}
            label="Name"
            labelPlacement="outside"
            placeholder="Enter your Full Name"
            type="text"
                    classNames={{
              label: "text-gray-300!"
             }}
          />
          <Input
            isRequired
            {...register("username")}
            className="p-0"
              isInvalid={!!errors.username}
            errorMessage={errors.username?.message}
                    classNames={{
              label: "text-gray-300!"
             }}
            label="Username"
            labelPlacement="outside"
            placeholder="Enter User Name"
            type="text"
          />

          <Input
          {...register("email")}
            isRequired
              isInvalid={!!errors.email}
            errorMessage={errors.email?.message}
                    classNames={{
              label: "text-gray-300!"
             }}
            label="Email"
            labelPlacement="outside"
            placeholder="Enter your Email"
            type="email"
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
          <Input
          {...register("rePassword")}
            isRequired
              isInvalid={!!errors.rePassword}
            errorMessage={errors.rePassword?.message}
                    classNames={{
              label: "text-gray-300!"
             }}
            label="Confirm Password"
            labelPlacement="outside"
            autoComplete="new-password"
            placeholder="Confirm your Password"
            type="password"
          />
          <Input
          {...register("dateOfBirth")}
            isRequired
            isInvalid={!!errors.dateOfBirth}
            errorMessage={errors.dateOfBirth?.message}
            label="Date"
            labelPlacement="outside"
            type="date"
                    classNames={{
              label: "text-gray-300!"
             }}
          />
          <label className="block text-sm font-medium text-gray-300">
            Gender
          </label>
          <input type="hidden" {...register("gender")} />
          {errors.gender && (
            <p className="text-sm text-red-500 mt-1">{errors.gender?.message}</p>
          )}
          <div
          
            className="    flex
          w-full
          
        p-1
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
    duration-300"
          >
            <button
            key={"male"}
              type="button"
              onClick={() => {setSelected("male")
                setValue("gender", "male")
              }}
              className={`
            flex-1
            py-2
            rounded-lg
            text-sm
            font-medium
            transition-all
            duration-300
            ${
              selected === "male"
                ? "bg-linear-to-r from-[#6366F1] to-[#8B5CF6] text-white shadow-md"
                : "text-gray-600 hover:text-indigo-600"
            }
          `}
            >
              Male
            </button>

            <button
            
              type="button"
              onClick={() => {setSelected("female")
                setValue("gender" , "female")
              }}
              className={`
            flex-1
            py-2
            rounded-lg
            text-sm
            font-medium
            transition-all
            duration-300
            ${
              selected === "female"
                ? "bg-linear-to-r from-[#6366F1] to-[#8B5CF6] text-white shadow-md"
                : "text-gray-600 hover:text-indigo-600"
            }
          `}
            >
              Female
            </button>
          </div>
          <div className="flex mx-auto gap-2 ">
            <Button   className="
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
  " color="primary" type="submit" isLoading={loading}>
              Sign Up
            </Button>
          </div>
          <div className="w-80 h-px rounded-xl bg-gray-900 self-center"></div>
          <p className="self-center text-gray-500">Already have account? <span className="text-indigo-200 font-medium"><Link to="/login"> Login</Link></span></p>
        </Form>
      </div>
    </div>
  );
}

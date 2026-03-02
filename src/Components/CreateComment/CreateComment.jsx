import React, { useContext } from 'react'
import { AuthUserContext } from '../../Contexts/AutUserContext/AuthUserProvider';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';

export default function CreateComment({postId}) {
     const { userData } = useContext(AuthUserContext);
     const {handleSubmit, register, reset} =useForm({
        defaultValues: {
            content: "",
            image: ''
        }
     })
     
     
     function sendComment(data){
        console.log("sent")
        const myFormData = new FormData();
        myFormData.append('content', data.content)
        console.log(data)
        return axios.post(`${import.meta.env.VITE_BASE_URL}/posts/${postId}/comments`,myFormData,{
            headers:{
                token: localStorage.getItem('token')
            }
        })
     }
     const {mutate} = useMutation({
        mutationFn: sendComment,
        onSuccess: function(){
          reset()
        }
     })
     //console.log(userData)
  return (
    <div>
          <form onSubmit={handleSubmit(mutate)}
      className="flex items-center gap-3 mt-4"
    >
      {/* Avatar */}
      <img
        src={userData?.photo}
        alt="avatar"
        className="w-9 h-9 rounded-full object-cover border border-white/20"
      />

      {/* Input */}
      <div className="flex-1 relative">
        <input
         {...register('content')}
          type="text"
          placeholder="Write a comment..."
          className="w-full bg-white/5 backdrop-blur-xl
                     border border-white/10
                     rounded-full px-4 py-2
                     text-white/80 placeholder:text-white/40
                     focus:outline-none focus:border-purple-400
                     transition"
        />
      </div>

      {/* Button */}
      <button
        type="submit"
        className="bg-linear-to-br from-[#6366F1] to-[#8B5CF6]
                   px-4 py-2 rounded-full
                   text-white text-sm font-medium
                   hover:scale-105 transition"
      >
        Comment
      </button>
    </form>
    </div>
  )
}

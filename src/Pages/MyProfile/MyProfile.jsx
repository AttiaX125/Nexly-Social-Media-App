import React, {  useContext } from 'react'
import { AuthUserContext } from '../../Contexts/AutUserContext/AuthUserProvider'

export default function MyProfile() {
 const {userData} = useContext(AuthUserContext)
   // useEffect(function (){
   //     getUserData();
   // },[])
  return (
<div className="min-h-screen bg-linear-to-br from-[#0B1220] via-[#0F172A] to-[#111827] p-6">

      <div className="max-w-3xl mx-auto space-y-6">

        {/* ================= PROFILE CARD ================= */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 shadow-xl">

          {/* Cover Placeholder */}
          <div className="h-50 rounded-xl bg-white/10 -mb-47.5"></div>

          {/* Avatar */}  
          <div className="flex justify-center">
            <img
              src={userData?.photo}
              className="w-28 h-28 rounded-full border-4 border-[#0F172A] object-cover"
            />
          </div>

          {/* User Info */}
          <div className="text-center mt-4">
            <h2 className="text-white text-2xl font-semibold">
              {userData?.name}
            </h2>
            <p className="text-white/50">@ {userData?.email}</p>
          </div>
         
          {/* Full Details */}
          <div className="mt-6 space-y-3 text-white/70 text-sm">
            <p>Email: {userData?.email}</p>
            <div className="h-px bg-white/10 my-4" />
            <p>Gender: {userData?.gender}</p>
            <div className="h-px bg-white/10 my-4" />
            <p>
              Date of Birth:  {new Date(userData?.dateOfBirth).toLocaleDateString("en-CA")}
        
            </p>
            <div className="h-px bg-white/10 my-4" />
            <p>Followers:  {userData?.followersCount > 0 ? userData.followers : 0}</p>
            <div className="h-px bg-white/10 my-4" />
            <p>Following: {userData?.followingCount > 0 ? userData.followingCount : 0}</p>
            <div className="h-px bg-white/10 my-4" />
            <p>Bookmarks: {userData?.bookmarksCount > 0 ? userData.bookmarksCount : 0} </p>
          </div>
        </div>

        {/* ================= CHANGE PHOTO ================= */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6">

          <h3 className="text-white font-semibold mb-4">
            Change Profile Photo
          </h3>

          <input
            type="file"
            accept="image/*"

            className="text-white mb-4"
          />

          <button

            className="bg-linear-to-br from-[#6366F1] to-[#8B5CF6] px-5 py-2 rounded-xl text-white"
          >
            Update Photo
          </button>
        </div>

        {/* ================= CHANGE PASSWORD ================= */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6">

          <h3 className="text-white font-semibold mb-4">
            Change Password
          </h3>

          <input
            type="password"
            placeholder="Current Password"
            
            className="w-full mb-3 bg-white/10 text-white px-4 py-2 rounded-xl"
          />

          <input
            type="password"
            placeholder="New Password"
        
            
            className="w-full mb-4 bg-white/10 text-white px-4 py-2 rounded-xl"
          />

          <button
            
            className="bg-linear-to-br from-[#6366F1] to-[#8B5CF6] px-5 py-2 rounded-xl text-white"
          >
            Change Password
          </button>
        </div>

      </div>
    </div>
  )
}

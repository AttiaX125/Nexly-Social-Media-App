import React, { useContext } from "react";
import { AuthUserContext } from "../../Contexts/AutUserContext/AuthUserProvider";
import axios from "axios";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

export default function MyProfile() {
   const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const { userData, token, setToken } = useContext(AuthUserContext);
  /*================ Change Password==================== */
  function changePassword(data, token) {
    return axios.patch(
      `${import.meta.env.VITE_BASE_URL}/users/change-password`,
      data,
      {
        headers: {
          token: `Bearer ${token}`,
        },
      },
    );
  }

  const changePasswordMutation = useMutation({
    mutationFn: (data) => changePassword(data, token),

    onSuccess: () => {
      alert("Password changed successfully");

      localStorage.clear();
      setToken(null);

      navigate("/login");
    },

    onError: () => {
      alert("Current password is incorrect");
    },
  });
  function onSubmit(values) {
  changePasswordMutation.mutate(values);
}
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
              Date of Birth:{" "}
              {new Date(userData?.dateOfBirth).toLocaleDateString("en-CA")}
            </p>
            <div className="h-px bg-white/10 my-4" />
            <p>
              Followers: {userData?.followersCount > 0 ? userData.followers : 0}
            </p>
            <div className="h-px bg-white/10 my-4" />
            <p>
              Following:{" "}
              {userData?.followingCount > 0 ? userData.followingCount : 0}
            </p>
            <div className="h-px bg-white/10 my-4" />
            <p>
              Bookmarks:{" "}
              {userData?.bookmarksCount > 0 ? userData.bookmarksCount : 0}{" "}
            </p>
          </div>
        </div>



        {/* ================= CHANGE PASSWORD ================= */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-4">Change Password</h3>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input
              type="password"
              placeholder="Current Password"
              {...register("password")}
              className="w-full border-1 border-gray-500 p-2 shadow-xl rounded-2xl"
            />

            <input
              type="password"
              placeholder="New Password"
              {...register("newPassword")}
              className="w-full border-1 border-gray-500 p-2 shadow-xl rounded-2xl mt-1"
            />

            <button
              type="submit"
              disabled={changePasswordMutation.isPending}
              className="bg-linear-to-br from-[#6366F1] to-[#8B5CF6] px-5 py-2  cursor-pointer  rounded-xl mt-3"
            >
              {changePasswordMutation.isPending
                ? "Updating..."
                : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

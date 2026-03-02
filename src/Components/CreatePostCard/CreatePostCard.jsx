import React, { useContext, useState } from "react";
import { AuthUserContext } from "../../Contexts/AutUserContext/AuthUserProvider";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function CreatePostCard() {
  const [preview, setPreview] = useState(null);
  const [image, setImage] = useState(null);
  const { handleSubmit, register, reset } = useForm({
    defaultValues: { body: "" },
  });

  const { userData } = useContext(AuthUserContext);
  const queryClient = useQueryClient();

  /* ================= IMAGE HANDLER ================= */

  function handleImageUpload(e) {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  }

  /* ================= MUTATION ================= */

  const createPostMutation = useMutation({
    mutationFn: async (formData) => {
      return axios.post(
        `${import.meta.env.VITE_BASE_URL}/posts`,
        formData,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
    },

    // 🔥 OPTIMISTIC UPDATE
    onMutate: async (formData) => {
      await queryClient.cancelQueries(["allPosts"]);

      const previousPosts = queryClient.getQueryData(["allPosts"]);

      const optimisticPost = {
        _id: "temp-" + Date.now(),
        body: formData.get("body"),
        image: preview,
        createdAt: new Date().toISOString(),
        user: {
          _id: userData._id,
          name: userData.name,
          photo: userData.photo,
        },
        likes: [],
        shares: [],
        commentsCount: 0,
        topComment: null,
        privacy: "public",
        bookmarked: false,
      };

      queryClient.setQueryData(["allPosts"], (old = []) => [
        optimisticPost,
        ...old,
      ]);

      return { previousPosts };
    },

    // 🔥 ROLLBACK IF ERROR
    onError: (err, variables, context) => {
      queryClient.setQueryData(["allPosts"], context.previousPosts);
    },

    // 🔥 REPLACE TEMP POST WITH REAL POST
    onSuccess: (response) => {
      queryClient.setQueryData(["allPosts"], (old = []) =>
        old.map((post) =>
          post._id.startsWith("temp-")
            ? response.data.data.post
            : post
        )
      );

      reset();
      setPreview(null);
      setImage(null);
    },

    onSettled: () => {
      queryClient.invalidateQueries(["allPosts"]);
    },
  });

  /* ================= SUBMIT ================= */

  function sendPost(data) {
    const newFormData = new FormData();
    newFormData.append("body", data.body);
    if (image) newFormData.append("image", image);

    toast.promise(createPostMutation.mutateAsync(newFormData), {
      loading: "Creating...",
      success: "Post created successfully",
      error: "Something went wrong",
    });
  }

  /* ================= UI ================= */

  return (
    <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-xl mb-6">
      <form onSubmit={handleSubmit(sendPost)}>
        <div className="flex gap-4">
          <img
            src={userData?.photo}
            alt="avatar"
            className="w-11 h-11 rounded-full object-cover border border-white/20"
          />

          <textarea
            {...register("body")}
            placeholder={`What's on your mind, ${userData?.name?.split(" ")[0]}?`}
            className="flex-1 bg-white/5 resize-none rounded-xl px-4 py-2 text-white/85 placeholder:text-white/40 focus:outline-none focus:bg-white/10 transition"
            rows={2}
          />
        </div>

        {preview && (
          <img
            src={preview}
            alt="preview"
            className="mt-4 rounded-xl w-full object-cover"
          />
        )}

        <div className="flex justify-between items-center mt-5">
          <label className="cursor-pointer text-white/60 hover:text-purple-400 transition">
            Upload Photo
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageUpload}
            />
          </label>

          <button
            type="submit"
            disabled={createPostMutation.isPending}
            className="bg-linear-to-br from-[#6366F1] to-[#8B5CF6] px-5 py-2 rounded-xl text-white font-semibold shadow-lg hover:scale-105 transition"
          >
            {createPostMutation.isPending ? "Posting..." : "Post"}
          </button>
        </div>
      </form>
    </div>
  );
}
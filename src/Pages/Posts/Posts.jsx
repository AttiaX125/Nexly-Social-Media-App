import axios from "axios";
import Card from "./../../Components/Card/Card";
import Loading from "../Loading/Loading";
import CreatePostCard from "../../Components/CreatePostCard/CreatePostCard";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { AuthUserContext } from "../../Contexts/AutUserContext/AuthUserProvider";
import FollowSugestions from "../../Components/FollowSugestions/FollowSugestions";
export default function Posts() {
  const { userData } = useContext(AuthUserContext);
  const [activeCommentPost, setActiveCommentPost] = useState(null);
  const { data, isLoading } = useQuery({
    queryKey: ["allPosts"],
    queryFn: getAllPosts,
  });
  /*Hooks Handler */
  const queryClient = useQueryClient();
  /*======================= */
  /*Functions Handler */
  const likeMutation = useMutation({
    mutationFn: async (postId) => {
      return axios.put(
        `${import.meta.env.VITE_BASE_URL}/posts/${postId}/like`,
        {},
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        },
      );
    },

    // 🔥 OPTIMISTIC UPDATE
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ["allPosts"] });

      const previousPosts = queryClient.getQueryData(["allPosts"]);

      queryClient.setQueryData(["allPosts"], (old) =>
        old?.map((post) => {
          if (post._id === postId) {
            const alreadyLiked = post.likes?.includes(userData?._id);

            return {
              ...post,
              likes: alreadyLiked
                ? post.likes.filter((id) => id !== userData?._id)
                : [...post.likes, userData?._id],
            };
          }

          return post;
        }),
      );

      return { previousPosts };
    },

    // 🔥 ROLLBACK IF ERROR
    onError: (err, postId, context) => {
      queryClient.setQueryData(["allPosts"], context?.previousPosts);
    },

    // 🔥 FINAL SYNC
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["allPosts"] });
    },
  });
  /*============================ */
  async function getAllPosts() {
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/posts`, {
      headers: {
        token: localStorage.getItem("token"),
      },
    });

    return response.data.data.posts;
  }
  /* ===============================================*/
  /* */
  const { mutate: toggleBookmark } = useMutation({
    mutationFn: async (postId) => {
      return await axios.put(
        `${import.meta.env.VITE_BASE_URL}/posts/${postId}/bookmark`,
        {},
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        },
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allPosts"] });
    },
  });
  /*====================================== */

  /* ================= DELETE POST (OPTIMISTIC) ================= */

  const deletePostMutation = useMutation({
    mutationFn: async (postId) => {
      return axios.delete(`${import.meta.env.VITE_BASE_URL}/posts/${postId}`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });
    },

    // 🔥 OPTIMISTIC UPDATE
    onMutate: async (postId) => {
      await queryClient.cancelQueries(["allPosts"]);

      const previousPosts = queryClient.getQueryData(["allPosts"]);

      queryClient.setQueryData(["allPosts"], (old) =>
        old?.filter((post) => post._id !== postId),
      );

      return { previousPosts };
    },

    // ROLLBACK IF ERROR
    onError: (err, postId, context) => {
      queryClient.setQueryData(["allPosts"], context.previousPosts);
    },

    //  FINAL SYNC
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["allPosts"] });
    },
  });

  /* ================= UPDATE POST ================= */

  const updatePostMutation = useMutation({
    mutationFn: async ({ postId, body }) => {
      const formData = new FormData();
      formData.append("body", body);

      return axios.put(
        `${import.meta.env.VITE_BASE_URL}/posts/${postId}`,
        formData,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        },
      );
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allPosts"] });
    },
  });
  console.log(data)

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-0 flex flex-col lg:flex-row gap-6 lg:gap-10 items-start">
      {/* LEFT SIDE - POSTS */}
      <div className="flex-1 max-w-4xl w-full">
        <CreatePostCard />

        {data?.map((post) => (
          <Card
            key={post._id}
            postId={post._id}
            avatar={post.user?.photo}
            username={post.user?.name}
            time={new Date(post.createdAt).toLocaleString()}
            content={post.body}
            image={post.image}
            privacy={post.privacy}
            likesCount={post.likes?.length || 0}
            isLiked={post.likes?.includes(userData?._id)}
            sharesCount={post.sharesCount}
            topComment={post.topComment || null}
            onLike={() => likeMutation.mutate(post._id)}
            onComment={() =>
              setActiveCommentPost(
                activeCommentPost === post._id ? null : post._id,
              )
            }
            isShare={post.isShare}
            sharedPost={post.sharedPost}
            comment={activeCommentPost === post._id}
            commentsCount={post.commentsCount}
            isBookmarked={post.bookmarked}
            isOwnPost={userData?._id === post.user?._id}
            onBookmark={() => toggleBookmark(post._id)}
            onDelete={(id) => deletePostMutation.mutate(id)}
            onUpdate={(id, body) =>
              updatePostMutation.mutate({ postId: id, body })
            }
          />
        ))}
      </div>

      {/* RIGHT SIDE - STICKY SUGGESTIONS */}
      <div className="hidden lg:block w-80 sticky top-24 overflow-auto h-100 scrollbar-hide ">
        <FollowSugestions />
      </div>
    </div>
  );
}

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "react-router";
import Loading from "./../Loading/Loading";
import { useContext, useState } from "react";
import { AuthUserContext } from "../../Contexts/AutUserContext/AuthUserProvider";

export default function SinglePost() {
  const { userData } = useContext(AuthUserContext);
  const { postId } = useParams();
  const queryClient = useQueryClient();

  /* =========================
     GET POST DETAILS
  ========================== */

  async function postDetails() {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/posts/${postId}`,
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      }
    );
    return response.data.data.post;
  }

  /* =========================
     GET COMMENTS
  ========================== */

  async function getComments() {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/posts/${postId}/comments?page=1&limit=10`,
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      }
    );
    return response.data.data.comments;
  }

  const { data: post, isLoading } = useQuery({
    queryKey: ["singlePost", postId],
    queryFn: postDetails,
    enabled: !!postId,
  });

  const { data: comments } = useQuery({
    queryKey: ["postComments", postId],
    queryFn: getComments,
    enabled: !!postId,
  });

  /* =========================
     DELETE COMMENT (OPTIMISTIC)
  ========================== */

  const deleteCommentMutation = useMutation({
    mutationFn: async ({ commentId }) => {
      return axios.delete(
        `${import.meta.env.VITE_BASE_URL}/posts/${postId}/comments/${commentId}`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
    },

    onMutate: async ({ commentId }) => {
      await queryClient.cancelQueries(["postComments", postId]);

      const previousComments = queryClient.getQueryData([
        "postComments",
        postId,
      ]);

      queryClient.setQueryData(["postComments", postId], (old) =>
        old?.filter((comment) => comment._id !== commentId)
      );

      return { previousComments };
    },

    onError: (_err, _vars, context) => {
      queryClient.setQueryData(
        ["postComments", postId],
        context.previousComments
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries(["postComments", postId]);
    },
  });

  /* =========================
     UPDATE COMMENT (FORMDATA + OPTIMISTIC)
  ========================== */

  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const updateCommentMutation = useMutation({
    mutationFn: async ({ commentId, content }) => {
      const formData = new FormData();
      formData.append("content", content);

      return axios.put(
        `${import.meta.env.VITE_BASE_URL}/posts/${postId}/comments/${commentId}`,
        formData,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
    },

    onMutate: async ({ commentId, content }) => {
      await queryClient.cancelQueries(["postComments", postId]);

      const previousComments = queryClient.getQueryData([
        "postComments",
        postId,
      ]);

      queryClient.setQueryData(["postComments", postId], (old) =>
        old?.map((comment) =>
          comment._id === commentId
            ? { ...comment, content }
            : comment
        )
      );

      return { previousComments };
    },

    onError: (_err, _vars, context) => {
      queryClient.setQueryData(
        ["postComments", postId],
        context.previousComments
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries(["postComments", postId]);
    },
  });

  if (isLoading) return <Loading />;

  return (
    <div className="max-w-4xl mx-auto py-6 text-white">

      {/* Post */}
      <div className="bg-white/5 p-6 rounded-xl border border-white/10 mb-6">
        <h2 className="text-xl font-bold mb-3">{post?.body}</h2>

        {post?.image && (
          <img
            src={post.image}
            alt="post"
            className="rounded-xl w-full"
          />
        )}
      </div>

      {/* Comments */}
      <div className="bg-white/5 p-6 rounded-xl border border-white/10">

        <h3 className="text-lg font-semibold mb-4">
          Comments ({post?.commentsCount})
        </h3>

        {comments?.map((comment) => (
          <div
            key={comment._id}
            className="bg-white/5 p-4 rounded-xl border border-white/10 mb-4"
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-2">
              <img
                src={comment.commentCreator.photo}
                className="w-8 h-8 rounded-full"
              />

              <div>
                <p className="font-semibold text-sm">
                  {comment.commentCreator.name}
                </p>

                <p className="text-white/50 text-xs">
                  {new Date(comment.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Edit Mode */}
            {editingId === comment._id ? (
              <>
                <input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="bg-white/10 p-1 rounded text-white w-full"
                />

                <button
                  onClick={() => {
                    updateCommentMutation.mutate({
                      commentId: comment._id,
                      content: editText,
                    });
                    setEditingId(null);
                  }}
                  className="text-green-400 text-xs mt-2 mr-3"
                >
                  Save
                </button>

                <button
                  onClick={() => setEditingId(null)}
                  className="text-gray-400 text-xs"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <p className="text-white/80 text-sm">
                  {comment.content}
                </p>

                {/* Owner Controls */}
                {comment.commentCreator._id === userData?._id && (
                  <div className="flex gap-4 mt-2">
                    <button
                      onClick={() => {
                        setEditingId(comment._id);
                        setEditText(comment.content);
                      }}
                      className="text-blue-400 text-xs"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        deleteCommentMutation.mutate({
                          commentId: comment._id,
                        })
                      }
                      className="text-red-400 text-xs"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
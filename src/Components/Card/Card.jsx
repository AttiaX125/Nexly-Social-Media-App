import React, { useEffect, useRef, useState } from "react";
import CreateComment from "../CreateComment/CreateComment";
import { FaComment, FaEllipsisV, FaRegBookmark } from "react-icons/fa";
import { useNavigate } from "react-router";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IoIosHeart, IoIosShareAlt } from "react-icons/io";
export default function Card({
  avatar,
  username,
  time,
  content,
  image,
  privacy,
  likesCount,
  sharesCount,
  topComment,
  onLike,
  onComment,
  comment,
  commentsCount,
  postId,
  isLiked,
  isBookmarked,
  onBookmark,
  isOwnPost,
  onDelete,
  onUpdate,
  isShare,
  sharedPost
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareText, setShareText] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editText, setEditText] = useState(content);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef(null);
  const postDetailsRoute = useNavigate();
  const queryClient = useQueryClient();

  // Detect overflow
  useEffect(() => {
    if (textRef.current) {
      setIsOverflowing(
        textRef.current.scrollHeight > textRef.current.clientHeight,
      );
    }
  }, [content]);

  /*=========================== Share Post====================== */
const shareMutation = useMutation({
  mutationFn: ({ postId, body }) =>
    axios.post(
      `${import.meta.env.VITE_BASE_URL}/posts/${postId}/share`,
      { body },
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      }
    ),

  // 🔥 OPTIMISTIC UPDATE
  onMutate: async ({ postId }) => {
    await queryClient.cancelQueries({ queryKey: ["allPosts"] });

    const previousPosts = queryClient.getQueryData(["allPosts"]);

    queryClient.setQueryData(["allPosts"], (old = []) =>
      old.map((post) => {
        if (post._id === postId) {
          return {
            ...post,
            sharesCount: (post.sharesCount || 0) + 1,
          };
        }
        return post;
      })
    );

    return { previousPosts };
  },

  // 🔥 SUCCESS → add new shared post
  onSuccess: (res) => {
    const newSharedPost = res.data.data.post;

    queryClient.setQueryData(["allPosts"], (old = []) => [
      newSharedPost,
      ...old,
    ]);
  },

  // 🔥 ERROR → rollback
  onError: (_err, _vars, context) => {
    queryClient.setQueryData(["allPosts"], context.previousPosts);
  },

  // 🔥 FINAL SYNC
  onSettled: () => {
    queryClient.invalidateQueries({ queryKey: ["allPosts"] });
  },
});
  return (
    <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 sm:p-6 shadow-xl mb-6 relative w-full">
      {/* 3 DOT MENU */}
      {isOwnPost && (
        <div className="absolute top-1 right-13">
          <FaEllipsisV
            className="cursor-pointer text-white/60"
            onClick={() => setMenuOpen(!menuOpen)}
          />

          {menuOpen && (
            <div className="absolute right-0 mt-2 bg-black border border-white/20 rounded-lg p-2 text-sm z-50">
              <button
                onClick={() => {
                  setEditModal(true);
                  setMenuOpen(false);
                }}
                className="block px-3 py-1 hover:text-blue-400"
              >
                Edit
              </button>

              <button
                onClick={() => {
                  setConfirmDelete(true);
                  setMenuOpen(false);
                }}
                className="block px-3 py-1 hover:text-red-400"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      )}
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src={avatar}
            alt="avatar"
            className="w-11 h-11 rounded-full object-cover border border-white/20"
          />

          <div>
            <h4 className="text-white font-semibold">{username}</h4>
            <span className="text-white/50 text-sm">{time}</span>
          </div>
        </div>
        <div className="absolute top-0 right-5 ">
          <FaRegBookmark
            className={`cursor-pointer transition ${
              isBookmarked
                ? "text-blue-600 "
                : "text-white/60 hover:text-blue-400"
            }`}
            size={26}
            onClick={() => onBookmark(postId)}
          />
        </div>
        <span className="text-white/40 text-sm capitalize">{privacy}</span>
      </div>
      {/* If it's a shared post */}
      {isShare && sharedPost && (
        <div className="mt-4 border border-white/20 rounded-xl p-4 bg-white/5 backdrop-blur-xl">
          {/* Header of original post */}
          <div className="flex items-center gap-3">
            <img
              src={sharedPost.user.photo}
              alt={sharedPost.user.name}
              className="w-10 h-10 rounded-full object-cover border border-white/20"
            />
            <div>
              <h5 className="text-white font-semibold text-sm">
                {sharedPost.user.name} (@{sharedPost.user.username})
              </h5>
              <span className="text-white/40 text-xs">
                {new Date(sharedPost.createdAt).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Body */}
          <p className="text-white/85 mt-2 overflow-y-auto scrollbar-hide">{sharedPost.body}</p>

          {/* Image */}
          {sharedPost.image && (
            <img
              src={sharedPost.image}
              alt="shared"
              className="mt-2  rounded-xl w-full max-h-100 object-cover"
            />
          )}
        </div>
      )}
      {isShare && (
        <span className="text-white/40 text-sm">
          Shared by {username} · {new Date(time).toLocaleString()}
        </span>
      )}
      {/* Content */}
      <div className="relative mt-4">
        <p
          ref={textRef}
          className={`text-white/85 leading-relaxed ${
            isExpanded ? "" : "overflow-hidden"
          }`}
          style={
            !isExpanded
              ? {
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }
              : {}
          }
        >
          {content}
        </p>

        {!isExpanded && isOverflowing && (
          <div className="absolute bottom-0 left-0 w-full h-6 bg-linear-to-t from-[#0F172A] to-transparent pointer-events-none" />
        )}
      </div>

      {/* See More Button */}
      {isOverflowing && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-purple-400 text-sm mt-2 hover:underline transition"
        >
          {isExpanded ? "See less" : "See more"}
        </button>
      )}

      {/* Image */}
      {image && (
        <img
          src={image}
          alt="post"
          className="mt-4 rounded-xl w-full  object-cover"
        />
      )}

      {/* Counts */}
      <div className="flex gap-6 mt-4 text-white/60 text-sm ">
        <span className="flex items-center justify-center gap-2">{likesCount} <IoIosHeart size={15} /></span> 
        <span
          onClick={function () {
            postDetailsRoute(`/postDetails/${postId}`);
          }}
          className="cursor-pointer flex items-center gap-2"
        >
          {commentsCount} <FaComment size={14} />
        </span>
        <span className="flex items-center gap-2">{sharesCount}  <IoIosShareAlt size={15} /></span>
      </div>

      {/* Actions */}
      <div className="flex justify-between sm:justify-start sm:gap-8 mt-5 text-white/60">
        <button
          onClick={onLike}
          className={`transition cursor-pointer ${isLiked ? "text-rose-500 font-semibold" : "hover:text-purple-500 text-white/60"}`}
        >
          <IoIosHeart size={23} />
        </button>
        <button
          onClick={onComment}
          className="hover:text-purple-400 transition cursor-pointer"
        >
          <FaComment size={20} />
        </button>
        <button
          onClick={() => setShowShareModal(true)}
          className="hover:text-purple-400 transition cursor-pointer"
        >
          <IoIosShareAlt size={22} />
        </button>
      </div>
      {showShareModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-6 rounded-2xl w-96">
            <h3 className="text-white mb-3 font-semibold">Share Post</h3>
            <textarea
              value={shareText}
              onChange={(e) => setShareText(e.target.value)}
              placeholder="Add a comment..."
              className="w-full p-2 rounded bg-white/10 text-white"
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  shareMutation.mutate({
                    postId,
                    body: shareText || `Sharing this post`,
                  });

                  setShowShareModal(false);
                  setShareText("");
                }}
                className="bg-blue-600 px-4 py-1 rounded text-white"
              >
                Share
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Top Comment */}
      {topComment && (
        <div className="mt-5 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl p-4 transition hover:bg-white/15">
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <img
              src={topComment.commentCreator?.photo}
              alt={topComment.commentCreator?.name}
              className="w-10 h-10 rounded-full object-cover border border-white/20"
            />

            {/* Content */}
            <div className="flex-1 overflow-y-hidden scrollbar-hide">
              {/* Name + Date */}
              <div className="flex justify-between items-center">
                <h5 className="text-white font-semibold text-sm">
                  {topComment.commentCreator?.name}
                </h5>

                <span className="text-white/40 text-xs ">
                  {new Date(topComment.createdAt).toLocaleString()}
                </span>
              </div>

              {/* Comment Text */}
              <p className="text-white/75 text-sm mt-1 leading-relaxed ">
                {topComment.content}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-xl ">
            <p>Are you sure?</p>
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => {
                  onDelete(postId);
                  setConfirmDelete(false);
                }}
                className="bg-red-500 text-white px-4 py-1 rounded cursor-pointer"
              >
                Delete
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="bg-gray-300 text-gray-900 px-4 py-1 rounded cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-xl w-96">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full  p-2 text-gray-200"
            />

            <div className="flex gap-4 mt-4">
              <button
                onClick={() => {
                  onUpdate(postId, editText);
                  setEditModal(false);
                }}
                className="bg-linear-to-br from-[#6366F1] to-[#8B5CF6] text-white px-4 py-1 rounded cursor-pointer"
              >
                Save
              </button>

              <button
                onClick={() => setEditModal(false)}
                className="bg-gray-300 text-gray-900 px-4 py-1 rounded cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {comment && <CreateComment postId={postId} closeComment={onComment}/>}
    </div>
  );
}

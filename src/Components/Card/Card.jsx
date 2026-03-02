import React, { useEffect, useRef, useState } from "react";
import { AuthUserContext } from "../../Contexts/AutUserContext/AuthUserProvider";
import CreateComment from "../CreateComment/CreateComment";
import { FaEllipsisV, FaRegBookmark } from "react-icons/fa";
import { useNavigate } from "react-router";
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
  onShare,
  comment,
  commentsCount,
  postId,
  isLiked,
  isBookmarked,
  onBookmark,
  isOwnPost,
  onDelete,
  onUpdate,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editText, setEditText] = useState(content);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef(null);
  const postDetailsRoute = useNavigate();

  // Detect overflow
  useEffect(() => {
    if (textRef.current) {
      setIsOverflowing(
        textRef.current.scrollHeight > textRef.current.clientHeight,
      );
    }
  }, [content]);
  return (
    <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 shadow-xl mb-6 relative">
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
          className="mt-4 rounded-xl w-full object-cover"
        />
      )}

      {/* Counts */}
      <div className="flex gap-6 mt-4 text-white/60 text-sm">
        <span>{likesCount} Likes</span>
        <span
          onClick={function () {
            postDetailsRoute(`/postDetails/${postId}`);
          }}
          className="cursor-pointer"
        >
          {commentsCount} comments
        </span>
        <span>{sharesCount} Shares</span>
      </div>

      {/* Actions */}
      <div className="flex gap-8 mt-5 text-white/60">
        <button
          onClick={onLike}
          className={`transition cursor-pointer ${isLiked ? "text-blue-500 font-semibold" : "hover:text-purple-400 text-white/60"}`}
        >
          Like
        </button>
        <button
          onClick={onComment}
          className="hover:text-purple-400 transition cursor-pointer"
        >
          Comment
        </button>
        <button
          onClick={onShare}
          className="hover:text-purple-400 transition cursor-pointer"
        >
          Share
        </button>
      </div>
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
            <div className="flex-1">
              {/* Name + Date */}
              <div className="flex justify-between items-center">
                <h5 className="text-white font-semibold text-sm">
                  {topComment.commentCreator?.name}
                </h5>

                <span className="text-white/40 text-xs">
                  {new Date(topComment.createdAt).toLocaleString()}
                </span>
              </div>

              {/* Comment Text */}
              <p className="text-white/75 text-sm mt-1 leading-relaxed">
                {topComment.content}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl">
            <p>Are you sure?</p>
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => {
                  onDelete(postId);
                  setConfirmDelete(false);
                }}
                className="bg-red-500 text-white px-4 py-1 rounded"
              >
                Delete
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="bg-gray-300 px-4 py-1 rounded"
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
          <div className="bg-white p-6 rounded-xl w-96">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full border p-2"
            />

            <div className="flex gap-4 mt-4">
              <button
                onClick={() => {
                  onUpdate(postId, editText);
                  setEditModal(false);
                }}
                className="bg-blue-500 text-white px-4 py-1 rounded"
              >
                Save
              </button>

              <button
                onClick={() => setEditModal(false)}
                className="bg-gray-300 px-4 py-1 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {comment && <CreateComment postId={postId} />}
    </div>
  );
}

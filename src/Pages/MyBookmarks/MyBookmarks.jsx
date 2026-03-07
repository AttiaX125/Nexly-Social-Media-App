import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loading from "../Loading/Loading";
import { FaCommentDots, FaHeart, FaRegBookmark, FaShare } from "react-icons/fa";

export default function MyBookmarks() {

  const { data: bookmarks, isLoading } = useQuery({
    queryKey: ["BookMarks"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/bookmarks`, {
        headers: { token: localStorage.getItem("token") },
      });
      return res.data.data.bookmarks;
    },
  });

  if (isLoading) return <Loading />;

  if (!bookmarks || bookmarks.length === 0)
    return (
      <div className="max-w-4xl mx-auto py-6 text-white">
        <h1 className="text-xl font-semibold">No bookmarks yet 😢</h1>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6 p-4">
      <div>
        <h1 className="text-2xl font-bold text-white">Bookmarks</h1>
        <p className="text-white/50 text-sm mt-1">Your saved posts will appear here</p>
      </div>

      {bookmarks.map((book) => (
        <div
          key={book._id}
          className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-lg relative"
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <img src={book.user.photo} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
            <div>
              <h4 className="text-white font-semibold text-sm">{book.user.name}</h4>
              <p className="text-white/50 text-xs">{new Date(book.createdAt).toLocaleString()}</p>
            </div>
          </div>

          {/* Body */}
          <p className="text-white/80 text-sm mb-4 overflow-y-hidden scrollbar-hide">{book.body}</p>

          {/* Optional Image */}
          {book.image && (
            <div className="w-full h-60 bg-white/10 rounded-xl flex items-center justify-center text-white/30 mb-4">
              <img src={book.image} alt="Post" className="w-full h-full rounded-xl object-cover" />
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-6 items-center mt-5 text-white/60 text-sm">
            <button className="flex items-center gap-2 transition">
              {book.likesCount} <FaHeart className="hover:text-rose-400" />
            </button>
            <button className="flex items-center gap-2 transition hover:text-purple-400">
              {book.commentsCount} <FaCommentDots />
            </button>
            <button className="flex items-center gap-2 transition">
              {book.sharesCount} <FaShare className="hover:text-blue-400" />
            </button>

            <FaRegBookmark size={28} className="text-blue-500 absolute top-0 right-5" />
          </div>
        </div>
      ))}
    </div>
  );
}
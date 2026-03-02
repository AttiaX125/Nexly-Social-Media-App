import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Loading from "../Loading/Loading";
import { FaCommentDots, FaHeart, FaRegBookmark, FaShare  } from "react-icons/fa";
import { AiFillLike } from "react-icons/ai";

export default function MyBookmarks() {
    /*Functions Handlers */
    async function getBookMarks (){
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/bookmarks`,{
            headers:{
                token : localStorage.getItem('token')
            }
        })
        console.log('resposne',response)
        return response.data.data.bookmarks
    }

    /*================================= */
   const {data, isLoading} = useQuery({
        queryKey: ["BookMarks"],
        queryFn: getBookMarks
        
    })
    console.log('data', data)
    console.log('isLoading', isLoading)
    if (isLoading){
        return <Loading/>
    }
  return (
    <div className="max-w-4xl mx-auto py-6">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">
          Bookmarks
        </h1>
        <p className="text-white/50 text-sm mt-1">
          Your saved posts will appear here
        </p>
      </div>

      {/* Content Container */}
      <div className="space-y-6">

        {/* 🔹 Example Bookmark Card (Static Design) */}
        {data ? <div>
            {data.map( (book) =>{
               
        return (
            <div key={book._id} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-lg mb-4 relative">

          {/* Post Header */}
          <div className="flex items-center gap-3 mb-4">

            <img
              src={book.user.photo}
              alt="avatar"
              className="w-10 h-10 rounded-full object-cover"
            />

            <div>
              <h4 className="text-white font-semibold text-sm">
                {book.user.name}
              </h4>
              <p className="text-white/50 text-xs">
                 {new Date(book.createdAt).toLocaleString()}
              </p>
            </div>

          </div>

          {/* Post Content */}
          <p className="text-white/80 text-sm mb-4">
            {book.body}
          </p>

          {/* Optional Image */}
         {book.image &&  <div className="w-full h-60 bg-white/10 rounded-xl flex items-center justify-center text-white/30">
            <img src={book.image} alt="Post Image" className="w-full h-full" />
          </div>}

          {/* Actions */}
          <div className="flex justify-end gap-6 items-center mt-5 text-white/60 text-sm ">

            <button className=" transition flex items-center justify-center gap-2">
                {book.likesCount}   <span className="hover:text-rose-400"><FaHeart /></span>
            </button>

            <button className="hover:text-purple-400 transition flex items-center justify-center gap-2">
                {book.commentsCount}  <span><FaCommentDots /></span>
            </button>
            <button className=" transition flex items-center justify-center gap-2">
                {book.sharesCount}    <span className="hover:text-blue-400"><FaShare /></span>
            </button>

            <div className="text-blue-500 font-medium absolute top-0 right-5 ">
              <FaRegBookmark size={30}/>
            </div>

          </div>

        </div>
        )
               
})}
        </div> : <div>
            <h1>there is no hambozo</h1></div>}

        {/* You will map your data here */}

      </div>
    </div>
  );
}
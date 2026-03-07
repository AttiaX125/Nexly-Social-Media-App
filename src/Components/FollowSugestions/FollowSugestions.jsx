import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export default function FollowSugestions() {

  const queryClient = useQueryClient();

  /* =======================
     GET SUGGESTIONS (QUERY)
  ======================= */
  async function getFollowSuggestion() {
    const response = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/users/suggestions?limit=10`,
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      }
    );
    
    return response.data.data.suggestions;
  }

  const { data: suggestions, isLoading } = useQuery({
    queryKey: ["followSuggestions"],
    queryFn: getFollowSuggestion,
  });

  /* =======================
     FOLLOW USER (MUTATION)
  ======================= */
  const { mutate: followUser, isPending } = useMutation({
    mutationFn: async (userId) => {
      return await axios.put(
        `${import.meta.env.VITE_BASE_URL}/users/${userId}/follow`,
        {},
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        }
      );
    },
    onSuccess: () => {
      // refresh suggestions after follow
      queryClient.invalidateQueries(["followSuggestions"]);
    },
  });

  if (isLoading) {
    return (
      <div className="text-white/60 text-sm">
        Loading suggestions...
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-lg h-105 overflow-y-auto
                    [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

      <h3 className="text-white font-semibold text-sm mb-3">
        People You May Know
      </h3>

      <div className="h-px bg-white/10 mb-4" />

      <div className="space-y-4">

        {suggestions?.map((user) => (
          <div
            key={user._id}
            className="flex items-center justify-between"
          >

            {/* User Info */}
            <div className="flex items-center gap-3">

              <img
                src={user.photo}
                alt={user.name}
                className="w-10 h-10 rounded-full object-cover border border-white/20"
              />

              <div>
                <h4 className="text-white text-sm font-medium">
                  {user.name}
                </h4>
                <p className="text-white/50 text-xs">
                  @{user.username}
                </p>
              </div>

            </div>

            {/* Follow Button */}
            <button
              onClick={() => followUser(user._id)}
              disabled={isPending}
              className="bg-linear-to-br from-[#6366F1] to-[#8B5CF6] cursor-pointer disabled:opacity-50
                         text-white text-xs px-4 py-1.5 rounded-full transition"
            >
              Follow
            </button>

          </div>
        ))}

      </div>
    </div>
  );
}
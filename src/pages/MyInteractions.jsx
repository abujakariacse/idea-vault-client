import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import Loading from "../components/Loading";
import { Heart, MessageSquare } from "lucide-react";

export default function MyInteractions() {
  const [likedIdeas, setLikedIdeas] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("comments");

  useEffect(() => {
    document.title = "My Interactions | IdeaVault";
    fetchInteractions();
  }, []);

  const fetchInteractions = async () => {
    try {
      const res = await api.get("/users/my-interactions");
      setLikedIdeas(res.data.likedIdeas);
      setComments(res.data.comments);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => new Date(date).toLocaleDateString();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Interactions</h1>
        <p className="text-gray-500 dark:text-gray-400">
          View ideas you've liked and comments you've made.
        </p>
      </div>
      <div className="flex gap-4 mb-6 border-b dark:border-gray-700">
        {/* <button onClick={() => setTab('liked')} className={`pb-2 px-4 font-medium ${tab === 'liked' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}>Liked Ideas ({likedIdeas.length})</button> */}
        <button
          onClick={() => setTab("comments")}
          className={`pb-2 px-4 font-medium ${tab === "comments" ? "border-b-2 border-primary text-primary" : "text-gray-500"}`}
        >
          Comments ({comments.length})
        </button>
      </div>

      {loading ? (
        <Loading />
      ) : tab === "liked" ? (
        likedIdeas.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No liked ideas yet</p>
        ) : (
          <div className="space-y-4">
            {likedIdeas.map((idea) => (
              <Link
                key={idea._id}
                to={`/ideas/${idea._id}`}
                className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md"
              >
                {idea.image && (
                  <img
                    src={idea.image}
                    alt={idea.title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{idea.title}</h3>
                  <p className="text-sm text-gray-500">
                    {idea.category} • {idea.author?.name}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Heart className="w-4 h-4 fill-red-500 text-red-500" /> {idea.likeCount}
                </div>
              </Link>
            ))}
          </div>
        )
      ) : comments.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No comments yet</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment._id} className="p-4 bg-white dark:bg-gray-800 rounded-lg">
              <Link
                to={`/ideas/${comment.idea?._id}`}
                className="font-semibold text-gray-900 dark:text-white hover:text-primary"
              >
                {comment.idea?.title}
              </Link>
              <p className="text-gray-600 dark:text-gray-300 mt-2">{comment.text}</p>
              <p className="text-xs text-gray-400 mt-2">{formatDate(comment.createdAt)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

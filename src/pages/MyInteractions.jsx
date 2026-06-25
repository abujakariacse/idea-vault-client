import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import Loading from "../components/Loading";
import { Heart, MessageSquare, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

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

  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`);
      setComments(comments.filter(c => c._id !== commentId));
      toast.success("Comment deleted");
    } catch (err) {
      toast.error("Failed to delete comment");
    }
  };

  const handleUnlike = async (e, ideaId) => {
    e.preventDefault();
    try {
      await api.post(`/ideas/${ideaId}/like`);
      setLikedIdeas(likedIdeas.filter(idea => idea._id !== ideaId));
      toast.success("Removed from liked ideas");
    } catch (err) {
      toast.error("Failed to unlike");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Interactions</h1>
        <p className="text-gray-500 dark:text-gray-400">
          View ideas you've liked and comments you've made.
        </p>
      </div>
      <div className="flex gap-4 mb-6 border-b dark:border-gray-700">
        <button 
          onClick={() => setTab('comments')} 
          className={`pb-2 px-4 font-medium transition-colors ${tab === 'comments' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
        >
          Comments ({comments.length})
        </button>
        <button 
          onClick={() => setTab('liked')} 
          className={`pb-2 px-4 font-medium transition-colors ${tab === 'liked' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
        >
          Liked Ideas ({likedIdeas.length})
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
                <div className="flex items-center gap-4 text-gray-500">
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4 fill-red-500 text-red-500" /> {idea.likeCount}
                  </span>
                  <button 
                    onClick={(e) => handleUnlike(e, idea._id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Unlike Idea"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
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
            <div key={comment._id} className="p-4 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm relative group">
              <Link
                to={`/ideas/${comment.idea?._id}`}
                className="font-semibold text-gray-900 dark:text-white hover:text-primary transition-colors pr-10 block"
              >
                {comment.idea?.title || "Deleted Idea"}
              </Link>
              <button
                onClick={() => handleDeleteComment(comment._id)}
                className="absolute top-4 right-4 p-2 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                title="Delete Comment"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <p className="text-gray-700 dark:text-gray-300 mt-3">{comment.text}</p>
              <p className="text-xs font-medium text-gray-400 mt-3">{formatDate(comment.createdAt)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

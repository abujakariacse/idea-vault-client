import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import Loading from "../components/Loading";
import toast from "react-hot-toast";
import { Heart, MessageSquare, Calendar, Tag, User } from "lucide-react";

export default function IdeaDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [idea, setIdea] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Idea Details | IdeaVault";
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [ideaRes, commentsRes] = await Promise.all([
        api.get(`/ideas/${id}`),
        api.get(`/comments/idea/${id}`),
      ]);
      setIdea(ideaRes.data);
      setComments(commentsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      toast.error("Please login first");
      return;
    }
    try {
      const res = await api.post(`/ideas/${id}/like`);
      setIdea((prev) => ({ ...prev, likeCount: res.data.likeCount }));
      toast.success(res.data.liked ? "Idea liked!" : "Like removed");
    } catch (err) {
      toast.error("Failed to like idea");
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const res = await api.post("/comments", { ideaId: id, text: newComment });
      setComments((prev) => [res.data, ...prev]);
      setNewComment("");
      toast.success("Comment added");
    } catch (err) {
      toast.error("Failed to add comment");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      toast.success("Comment deleted");
    } catch (err) {
      toast.error("Failed to delete comment");
    }
  };

  if (loading) return <Loading />;
  if (!idea) return <div className="text-center py-12">Idea not found</div>;

  const isLiked =
    user && idea.likes?.some((like) => like.toString() === (user.id || user._id)?.toString());
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
        {idea.image && (
          <img
            src={idea.image}
            alt={idea.title}
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
        )}
        <span className="inline-block px-3 py-1 text-sm bg-primary/10 text-primary rounded-full mb-4">
          {idea.category}
        </span>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{idea.title}</h1>
        <div className="flex items-center gap-4 mb-6">
          <img
            src={idea.author?.photo || `https://ui-avatars.com/api/?name=${idea.author?.name}`}
            alt={idea.author?.name}
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-medium text-gray-900 dark:text-white">{idea.author?.name}</p>
            <p className="text-sm text-gray-500">{formatDate(idea.createdAt)}</p>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{idea.detailedDescription}</p>
        {idea.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {idea.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-600 dark:text-gray-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <div className="flex flex-wrap gap-4 border-t dark:border-gray-700 pt-6">
          {idea.targetAudience && (
            <div>
              <p className="text-sm text-gray-500 mb-1">Target Audience</p>
              <p className="font-medium text-gray-900 dark:text-white">{idea.targetAudience}</p>
            </div>
          )}
          {idea.estimatedBudget && (
            <div>
              <p className="text-sm text-gray-500 mb-1">Budget</p>
              <p className="font-medium text-gray-900 dark:text-white">{idea.estimatedBudget}</p>
            </div>
          )}
          {idea.problemStatement && (
            <div className="w-full">
              <p className="text-sm text-gray-500 mb-1">Problem Statement</p>
              <p className="font-medium text-gray-900 dark:text-white">{idea.problemStatement}</p>
            </div>
          )}
          {idea.proposedSolution && (
            <div className="w-full">
              <p className="text-sm text-gray-500 mb-1">Proposed Solution</p>
              <p className="font-medium text-gray-900 dark:text-white">{idea.proposedSolution}</p>
            </div>
          )}
        </div>
        {/* <button onClick={handleLike} className={`flex items-center gap-2 px-4 py-2 mt-6 rounded-lg ${isLiked ? 'bg-red-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200'} hover:opacity-90`}>
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} /> {idea.likeCount || 0} Likes
        </button> */}
      </div>

      <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Comments ({comments.length})
        </h2>
        {user && (
          <form onSubmit={handleComment} className="mb-6">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add your comment..."
              className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-primary outline-none resize-none"
              rows="3"
            />
            <button
              type="submit"
              className="mt-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Post Comment
            </button>
          </form>
        )}
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment._id}
              className="flex gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
            >
              <img
                src={
                  comment.user?.photo || `https://ui-avatars.com/api/?name=${comment.user?.name}`
                }
                alt={comment.user?.name}
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-gray-900 dark:text-white">{comment.user?.name}</p>
                  {user && user.id === comment.user?._id && (
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="text-sm text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{comment.text}</p>
                <p className="text-xs text-gray-400 mt-2">{formatDate(comment.createdAt)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

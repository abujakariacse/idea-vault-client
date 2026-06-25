import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import Loading from "../components/Loading";
import toast from "react-hot-toast";
import { Heart, ThumbsDown, MessageSquare, Calendar, Tag, User, Target, DollarSign, Lightbulb, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

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
      setIdea((prev) => ({ 
        ...prev, 
        likeCount: res.data.likeCount,
        dislikeCount: res.data.dislikeCount,
        likes: res.data.liked ? [...prev.likes, user.id || user._id] : prev.likes.filter(uid => uid !== (user.id || user._id)),
        dislikes: prev.dislikes?.filter(uid => uid !== (user.id || user._id)) || []
      }));
    } catch (err) {
      toast.error("Failed to like idea");
    }
  };

  const handleDislike = async () => {
    if (!user) {
      toast.error("Please login first");
      return;
    }
    try {
      const res = await api.post(`/ideas/${id}/dislike`);
      setIdea((prev) => ({ 
        ...prev, 
        likeCount: res.data.likeCount,
        dislikeCount: res.data.dislikeCount,
        dislikes: res.data.disliked ? [...(prev.dislikes || []), user.id || user._id] : prev.dislikes.filter(uid => uid !== (user.id || user._id)),
        likes: prev.likes?.filter(uid => uid !== (user.id || user._id)) || []
      }));
    } catch (err) {
      toast.error("Failed to dislike idea");
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
  if (!idea) return <div className="text-center py-12 text-2xl font-bold text-gray-500">Idea not found</div>;

  const currentUserId = user?.id || user?._id;
  const isLiked = idea.likes?.some((uid) => uid.toString() === currentUserId?.toString());
  const isDisliked = idea.dislikes?.some((uid) => uid.toString() === currentUserId?.toString());
  
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden mb-8"
        >
          {idea.image && (
            <div className="w-full h-80 md:h-96 relative">
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent z-10" />
              <img src={idea.image} alt={idea.title} className="w-full h-full object-cover" />
              <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 z-20">
                <span className="inline-block px-4 py-1.5 text-sm font-semibold bg-primary text-white rounded-full mb-4 shadow-lg">
                  {idea.category}
                </span>
                <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 leading-tight drop-shadow-md">
                  {idea.title}
                </h1>
              </div>
            </div>
          )}

          <div className="p-6 md:p-10">
            {!idea.image && (
              <div className="mb-8">
                <span className="inline-block px-4 py-1.5 text-sm font-semibold bg-primary/10 text-primary rounded-full mb-4">
                  {idea.category}
                </span>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
                  {idea.title}
                </h1>
              </div>
            )}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b dark:border-gray-700 pb-8 mb-8">
              <div className="flex items-center gap-4">
                <img
                  src={idea.author?.photo || `https://ui-avatars.com/api/?name=${idea.author?.name}`}
                  alt={idea.author?.name}
                  className="w-14 h-14 rounded-full ring-4 ring-primary/20"
                />
                <div>
                  <p className="font-bold text-lg text-gray-900 dark:text-white">{idea.author?.name}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Calendar className="w-4 h-4" /> {formatDate(idea.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button 
                  onClick={handleLike} 
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all ${
                    isLiked 
                      ? 'bg-primary text-white shadow-md shadow-primary/30 scale-105' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} /> 
                  <span>{idea.likeCount || 0}</span>
                </button>
                
                <button 
                  onClick={handleDislike} 
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all ${
                    isDisliked 
                      ? 'bg-red-500 text-white shadow-md shadow-red-500/30 scale-105' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <ThumbsDown className={`w-5 h-5 ${isDisliked ? 'fill-current' : ''}`} /> 
                  <span>{idea.dislikeCount || 0}</span>
                </button>
              </div>
            </div>

            <div className="prose dark:prose-invert max-w-none mb-10">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">About this Idea</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg whitespace-pre-wrap">
                {idea.detailedDescription}
              </p>
            </div>

            {idea.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-10">
                {idea.tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 px-4 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-full text-sm font-medium text-gray-600 dark:text-gray-300"
                  >
                    <Tag className="w-3 h-3" /> {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl">
              {idea.targetAudience && (
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Target Audience</h4>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{idea.targetAudience}</p>
                  </div>
                </div>
              )}
              {idea.estimatedBudget && (
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 shrink-0">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Estimated Budget</h4>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{idea.estimatedBudget}</p>
                  </div>
                </div>
              )}
              {idea.problemStatement && (
                <div className="flex gap-4 md:col-span-2">
                  <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Problem Statement</h4>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{idea.problemStatement}</p>
                  </div>
                </div>
              )}
              {idea.proposedSolution && (
                <div className="flex gap-4 md:col-span-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Proposed Solution</h4>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">{idea.proposedSolution}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Comments Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 md:p-10"
        >
          <div className="flex items-center gap-2 mb-8">
            <MessageSquare className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Discussion ({comments.length})
            </h2>
          </div>

          {user ? (
            <form onSubmit={handleComment} className="mb-10">
              <div className="flex gap-4">
                <img
                  src={user.photo || `https://ui-avatars.com/api/?name=${user.name}`}
                  alt={user.name}
                  className="w-10 h-10 rounded-full hidden sm:block"
                />
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts or feedback..."
                    className="w-full p-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none transition-all"
                    rows="3"
                  />
                  <div className="flex justify-end mt-3">
                    <button
                      type="submit"
                      disabled={!newComment.trim()}
                      className="px-6 py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Post Comment
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 text-center mb-10 border border-gray-100 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-300">Please login to join the discussion.</p>
            </div>
          )}

          <div className="space-y-6">
            {comments.map((comment, index) => (
              <motion.div
                key={comment._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex gap-4 p-5 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <img
                  src={comment.user?.photo || `https://ui-avatars.com/api/?name=${comment.user?.name}`}
                  alt={comment.user?.name}
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-gray-900 dark:text-white">{comment.user?.name}</h4>
                    {user && user.id === comment.user?._id && (
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{comment.text}</p>
                  <p className="text-xs text-gray-400 mt-3 font-medium">{formatDate(comment.createdAt)}</p>
                </div>
              </motion.div>
            ))}
            {comments.length === 0 && (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-lg">No comments yet. Be the first to share your thoughts!</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

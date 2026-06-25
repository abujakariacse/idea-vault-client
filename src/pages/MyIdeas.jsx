import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import Loading from "../components/Loading";
import toast from "react-hot-toast";
import { Edit, Trash2, Eye, Heart, ThumbsDown, X, PenTool } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MyIdeas() {
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editIdea, setEditIdea] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    document.title = "My Ideas | IdeaVault";
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    try {
      const res = await api.get("/users/my-ideas");
      setIdeas(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/ideas/${id}`);
      setIdeas((prev) => prev.filter((i) => i._id !== id));
      toast.success("Idea deleted");
      setDeleteConfirm(null);
    } catch (err) {
      toast.error("Failed to delete idea");
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put(`/ideas/${editIdea._id}`, editForm);
      setIdeas((prev) => prev.map((i) => (i._id === res.data._id ? res.data : i)));
      toast.success("Idea updated");
      setEditIdea(null);
    } catch (err) {
      toast.error("Failed to update idea");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Ideas</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage and edit your submitted startup concepts.
        </p>
      </div>
      {loading ? (
        <Loading />
      ) : ideas.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            You haven't shared any ideas yet
          </p>
          <Link to="/dashboard/add-idea" className="text-primary hover:underline mt-2 inline-block">
            Submit your first idea
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Idea Name</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Category</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Engagement</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">Date Added</th>
                  <th className="px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {ideas.map((idea, index) => (
                  <motion.tr 
                    key={idea._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {idea.image ? (
                          <img src={idea.image} alt={idea.title} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                            {idea.title.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white line-clamp-1">{idea.title}</p>
                          <p className="text-xs text-gray-500 line-clamp-1">{idea.shortDescription}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary whitespace-nowrap">
                        {idea.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 text-sm">
                        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                          <Heart className="w-3.5 h-3.5 text-red-500" /> {idea.likeCount || 0}
                        </span>
                        <span className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
                          <ThumbsDown className="w-3.5 h-3.5" /> {idea.dislikeCount || 0}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {new Date(idea.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          to={`/ideas/${idea._id}`}
                          className="p-1.5 text-gray-500 hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button 
                          onClick={() => { setEditIdea(idea); setEditForm(idea); }}
                          className="p-1.5 text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setDeleteConfirm(idea._id)}
                          className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AnimatePresence>
        {editIdea && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="px-6 py-4 border-b dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <PenTool className="w-5 h-5" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Edit Idea</h3>
                </div>
                <button 
                  onClick={() => setEditIdea(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleEdit} className="flex flex-col overflow-hidden">
                <div className="p-6 overflow-y-auto space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Idea Title</label>
                    <input
                      type="text"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                      placeholder="Give it a catchy name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Short Description</label>
                    <textarea
                      value={editForm.shortDescription}
                      onChange={(e) => setEditForm({ ...editForm, shortDescription: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                      rows="2"
                      placeholder="A quick summary of your idea"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Detailed Description</label>
                    <textarea
                      value={editForm.detailedDescription}
                      onChange={(e) => setEditForm({ ...editForm, detailedDescription: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                      rows="6"
                      placeholder="Explain the problem, solution, and vision in detail"
                    />
                  </div>
                </div>
                
                <div className="px-6 py-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEditIdea(null)}
                    className="px-5 py-2.5 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-6 py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark shadow-sm hover:shadow-md transition-all"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteConfirm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-sm shadow-2xl"
            >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Delete Idea?</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">This action cannot be undone.</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg"
              >
                Cancel
              </button>
            </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

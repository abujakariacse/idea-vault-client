import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";
import IdeaCard from "../components/IdeaCard";
import Loading from "../components/Loading";
import toast from "react-hot-toast";

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
          <Link to="/add-idea" className="text-primary hover:underline mt-2 inline-block">
            Submit your first idea
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ideas.map((idea) => (
            <div key={idea._id} className="relative">
              <IdeaCard idea={idea} />
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={() => {
                    setEditIdea(idea);
                    setEditForm(idea);
                  }}
                  className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteConfirm(idea._id)}
                  className="p-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editIdea && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Edit Idea</h3>
            <form onSubmit={handleEdit} className="space-y-4">
              <input
                type="text"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <textarea
                value={editForm.shortDescription}
                onChange={(e) => setEditForm({ ...editForm, shortDescription: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
                rows="2"
              />
              <textarea
                value={editForm.detailedDescription}
                onChange={(e) => setEditForm({ ...editForm, detailedDescription: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
                rows="4"
              />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 py-2 bg-primary text-white rounded-lg">
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditIdea(null)}
                  className="flex-1 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-sm">
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
          </div>
        </div>
      )}
    </div>
  );
}

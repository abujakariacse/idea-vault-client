import { useState, useEffect } from "react";
import api from "../utils/api";
import Loading from "../components/Loading";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";

export default function AdminDashboard({ type }) {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchData();
  }, [type]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/${type}`);
      setData(res.data);
    } catch (err) {
      toast.error(`Failed to load ${type}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      setData(data.map(u => u._id === userId ? { ...u, role: newRole } : u));
      toast.success("User role updated");
    } catch (err) {
      toast.error("Failed to update role");
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await api.delete(`/admin/${type}/${deleteConfirm}`);
      setData(data.filter((item) => item._id !== deleteConfirm));
      toast.success("Deleted successfully");
    } catch (err) {
      toast.error("Failed to delete");
    } finally {
      setDeleteConfirm(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 capitalize">Manage {type}</h1>

        {loading ? (
          <Loading />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b dark:border-gray-700 text-gray-700 dark:text-gray-300">
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Info</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item._id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="py-3 px-4 font-mono text-sm text-gray-500">{item._id.substring(0, 8)}...</td>
                    <td className="py-3 px-4">
                      {type === "users" && (
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{item.name}</p>
                          <p className="text-sm text-gray-500">{item.email}</p>
                        </div>
                      )}
                      {type === "ideas" && (
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{item.title}</p>
                          <p className="text-sm text-gray-500">By {item.author?.name || "Unknown"}</p>
                        </div>
                      )}
                      {type === "comments" && (
                        <div>
                          <p className="text-gray-900 dark:text-white truncate max-w-md">{item.text}</p>
                          <p className="text-sm text-gray-500">By {item.user?.name || "Unknown"} on {item.idea?.title}</p>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {type === "users" && (
                        <select
                          value={item.role}
                          onChange={(e) => handleRoleChange(item._id, e.target.value)}
                          disabled={item._id === (user?.id || user?._id) || (item.role === 'super-admin' && user?.role !== 'super-admin')}
                          className="mr-4 px-2 py-1 text-sm border rounded-lg bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary/50 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                          {user?.role === 'super-admin' && <option value="super-admin">Super Admin</option>}
                        </select>
                      )}
                      <button
                        onClick={() => setDeleteConfirm(item._id)}
                        disabled={item._id === (user?.id || user?._id) || (item.role === 'super-admin' && user?.role !== 'super-admin')}
                        className="text-red-500 hover:text-red-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data.length === 0 && <p className="text-center py-6 text-gray-500">No {type} found.</p>}
          </div>
        )}
      </motion.div>

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
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Confirm Deletion</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">Are you sure you want to delete this {type.slice(0, -1)}? This action cannot be undone.</p>
              <div className="flex gap-2">
                <button
                  onClick={handleDelete}
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

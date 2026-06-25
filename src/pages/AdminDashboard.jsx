import { useState, useEffect } from "react";
import api from "../utils/api";
import Loading from "../components/Loading";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/${activeTab}`);
      setData(res.data);
    } catch (err) {
      toast.error(`Failed to load ${activeTab}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await api.delete(`/admin/${activeTab}/${deleteConfirm}`);
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Admin Dashboard</h1>
        <div className="flex gap-4 border-b dark:border-gray-700 mb-6">
          {["users", "ideas", "comments"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 capitalize font-semibold transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

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
                      {activeTab === "users" && (
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{item.name}</p>
                          <p className="text-sm text-gray-500">{item.email}</p>
                        </div>
                      )}
                      {activeTab === "ideas" && (
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{item.title}</p>
                          <p className="text-sm text-gray-500">By {item.author?.name || "Unknown"}</p>
                        </div>
                      )}
                      {activeTab === "comments" && (
                        <div>
                          <p className="text-gray-900 dark:text-white truncate max-w-md">{item.text}</p>
                          <p className="text-sm text-gray-500">By {item.user?.name || "Unknown"} on {item.idea?.title}</p>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => setDeleteConfirm(item._id)}
                        className="text-red-500 hover:text-red-700 font-semibold"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data.length === 0 && <p className="text-center py-6 text-gray-500">No {activeTab} found.</p>}
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
              <p className="text-gray-600 dark:text-gray-300 mb-6">Are you sure you want to delete this {activeTab.slice(0, -1)}? This action cannot be undone.</p>
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

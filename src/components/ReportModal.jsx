import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, Loader } from "lucide-react";
import toast from "react-hot-toast";
import api from "../utils/api";

export default function ReportModal({ isOpen, onClose, ideaId }) {
  const [reason, setReason] = useState("Spam");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        return toast.error("Image must be less than 5MB");
      }
      setPhoto(file);
    }
  };

  const uploadToImgBB = async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);

    const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
    if (!apiKey) {
      throw new Error("ImgBB API key is missing. Please configure it in your environment.");
    }

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (data.success) {
      return data.data.url;
    } else {
      throw new Error("Failed to upload image");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let photoUrl = "";
      if (photo) {
        photoUrl = await uploadToImgBB(photo);
      }

      await api.post(`/ideas/${ideaId}/report`, {
        reason,
        additionalInfo,
        photoUrl,
      });

      toast.success("Report submitted successfully");
      setReason("Spam");
      setAdditionalInfo("");
      setPhoto(null);
      onClose();
    } catch (err) {
      toast.error(err.message || "Failed to submit report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Report Idea</h2>
              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Reason for Reporting
                </label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  required
                >
                  <option value="Spam">Spam</option>
                  <option value="Inappropriate Content">Inappropriate Content</option>
                  <option value="Plagiarism">Plagiarism</option>
                  <option value="Harassment">Harassment</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Additional Information (Optional)
                </label>
                <textarea
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                  placeholder="Provide any additional details..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Upload Evidence (Optional)
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer bg-gray-50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 text-gray-400 mb-3" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {photo ? photo.name : "Click to upload an image"}
                      </p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
                  </label>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 px-4 rounded-xl font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 px-4 rounded-xl font-medium bg-red-600 hover:bg-red-700 text-white transition-colors flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
                >
                  {loading ? <Loader className="w-5 h-5 animate-spin" /> : "Submit Report"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

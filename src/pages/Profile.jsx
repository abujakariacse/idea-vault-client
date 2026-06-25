import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import toast from "react-hot-toast";
import { User, Camera, AlertTriangle } from "lucide-react";

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || "", photo: user?.photo || "" });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        return toast.error("Image must be less than 5MB");
      }
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const uploadToImgBB = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
    if (!apiKey) throw new Error("ImgBB API key is missing.");
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (data.success) return data.data.url;
    throw new Error("Failed to upload image");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let finalPhotoUrl = form.photo;
      if (photoFile) {
        finalPhotoUrl = await uploadToImgBB(photoFile);
      }
      const res = await api.put("/users/profile", { ...form, photo: finalPhotoUrl });
      setUser(res.data);
      setForm({ ...form, photo: finalPhotoUrl });
      setPhotoFile(null);
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome, {user?.name}!
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage your profile information and account settings.
        </p>
      </div>

      {user?.warnedUntil && new Date(user.warnedUntil) > new Date() && (
        <div className="mb-8 p-5 bg-orange-50 border-l-4 border-orange-500 dark:bg-orange-900/20 dark:border-orange-600 rounded-r-xl flex gap-4 shadow-sm">
          <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg font-bold text-orange-800 dark:text-orange-400">Account Restricted</h3>
            <p className="text-orange-700 dark:text-orange-300 mt-1">
              Your account has received a warning and is temporarily restricted from posting new ideas until <strong>{new Date(user.warnedUntil).toLocaleDateString()}</strong>. Please review our community guidelines.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 w-full">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <User className="w-6 h-6 text-primary" /> Profile Details
        </h2>

        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="flex items-center gap-6 pb-6 border-b border-gray-100 dark:border-gray-700">
            <label className="relative group cursor-pointer block w-24 h-24 rounded-full">
              <img
                src={photoPreview || form.photo || `https://ui-avatars.com/api/?name=${form.name}`}
                alt={form.name}
                className="w-full h-full rounded-full object-cover border-4 border-gray-50 dark:border-gray-700"
              />
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Camera className="w-6 h-6" />
              </div>
              <input type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
            </label>
            <div>
              <p className="font-medium text-gray-900 dark:text-white mb-1">Profile Photo</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                Click the image to change your avatar.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow"
                placeholder="Your Name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full px-4 py-3 border rounded-xl bg-gray-50 dark:bg-gray-700/50 dark:border-gray-600 dark:text-gray-400 text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-2">Email cannot be changed directly.</p>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors disabled:opacity-50 shadow-md"
            >
              {loading ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

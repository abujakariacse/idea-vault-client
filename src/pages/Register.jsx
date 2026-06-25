import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { Eye, EyeOff, Upload, X } from "lucide-react";

export default function Register() {
  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", photo: "", password: "" });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
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

  const validatePassword = (pwd) => {
    if (pwd.length < 6) return "Password must be at least 6 characters";
    if (!/[A-Z]/.test(pwd)) return "Password must have at least 1 uppercase letter";
    if (!/[a-z]/.test(pwd)) return "Password must have at least 1 lowercase letter";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = validatePassword(form.password);
    if (error) {
      toast.error(error);
      return;
    }
    setLoading(true);
    try {
      let photoUrl = form.photo;
      if (photoFile) {
        photoUrl = await uploadToImgBB(photoFile);
      }

      await register(form.name, form.email, photoUrl, form.password);
      navigate("/");
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Registration failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initGoogle = () => {
      if (window.google) {
        if (!window._googleInitialized) {
          window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            callback: async (response) => {
              try {
                await googleLogin(response.credential);
                toast.success("Registration/Login successful");
                navigate("/");
              } catch (err) {
                toast.error(typeof err === "string" ? err : "Google login failed");
              }
            },
          });
          window._googleInitialized = true;
        }

        window.google.accounts.id.renderButton(document.getElementById("google-signup-btn"), {
          theme: document.documentElement.classList.contains("dark") ? "filled_black" : "outline",
          size: "large",
          text: "signup_with",
          width: "300",
        });
      }
    };

    if (window.google) {
      initGoogle();
    } else {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initGoogle;
      document.body.appendChild(script);
      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    }
  }, [googleLogin, navigate]);

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700 transition-all duration-300">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center tracking-tight">
          Create Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow"
              placeholder="John Doe"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Profile Photo (Optional)
            </label>
            {photoPreview ? (
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-700 mx-auto">
                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    setPhotoFile(null);
                    setPhotoPreview(null);
                  }}
                  className="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            ) : (
              <label className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed rounded-xl cursor-pointer bg-gray-50 dark:bg-gray-700/50 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <Upload className="w-5 h-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-500 dark:text-gray-400">Upload Photo</span>
                <input type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
              </label>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 font-medium">
              Min 6 chars, 1 uppercase, 1 lowercase
            </p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors disabled:opacity-50 mt-2 shadow-md"
          >
            {loading ? "Creating..." : "Register"}
          </button>
        </form>
        <div className="my-8 flex items-center gap-4">
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600"></div>
          <span className="text-sm text-gray-500 font-medium">or continue with</span>
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600"></div>
        </div>
        <div className="flex justify-center w-full min-h-[44px]">
          <div id="google-signup-btn"></div>
        </div>
        <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-300">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary hover:text-primary-dark font-bold hover:underline transition-colors"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

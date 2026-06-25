import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { toast.error('All fields required'); return; }
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Login successful');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err);
    } finally { setLoading(false); }
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
                toast.success('Login successful');
                navigate(from, { replace: true });
              } catch (err) {
                toast.error(typeof err === 'string' ? err : 'Google login failed');
              }
            }
          });
          window._googleInitialized = true;
        }
        
        window.google.accounts.id.renderButton(
          document.getElementById("google-signin-btn"),
          { 
            theme: document.documentElement.classList.contains('dark') ? 'filled_black' : 'outline', 
            size: "large", 
            text: "continue_with",
            width: "300"
          }
        );
      }
    };

    if (window.google) {
      initGoogle();
    } else {
      const script = document.createElement('script');
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
  }, [googleLogin, navigate, from]);

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700 transition-all duration-300">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center tracking-tight">Welcome Back</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Password</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-shadow" placeholder="••••••••" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <span className="text-sm text-primary hover:text-primary-dark cursor-pointer block text-right mt-2 transition-colors">Forgot Password?</span>
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-colors disabled:opacity-50 mt-2 shadow-md">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="my-8 flex items-center gap-4">
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600"></div>
          <span className="text-sm text-gray-500 font-medium">or continue with</span>
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600"></div>
        </div>
        <div className="flex justify-center w-full min-h-[44px]">
          <div id="google-signin-btn"></div>
        </div>
        <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-300">
          Don't have an account? <Link to="/register" className="text-primary hover:text-primary-dark font-bold hover:underline transition-colors">Register</Link>
        </p>
      </div>
    </div>
  );
}
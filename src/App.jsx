import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import FloatingChat from "./components/FloatingChat";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Ideas from "./pages/Ideas";
import IdeaDetails from "./pages/IdeaDetails";
import AddIdea from "./pages/AddIdea";
import MyIdeas from "./pages/MyIdeas";
import MyInteractions from "./pages/MyInteractions";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const DocumentTitle = ({ children }) => {
  const location = useLocation();
  document.title = children ? `${children} | IdeaVault` : "IdeaVault";
  return null;
};

function AppContent() {
  const { loading } = useAuth();
  const { theme } = useTheme();
  const location = useLocation();

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );

  return (
    <div className={`min-h-screen flex flex-col ${theme}`}>
      <ScrollToTop />
      <Navbar />
      <main className="flex-1 overflow-hidden">
        <div key={location.pathname} className="animate-page-in">
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/ideas" element={<Ideas />} />
            <Route
              path="/ideas/:id"
              element={
                <ProtectedRoute>
                  <IdeaDetails />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-idea"
              element={
                <ProtectedRoute>
                  <AddIdea />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-ideas"
              element={
                <ProtectedRoute>
                  <MyIdeas />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-interactions"
              element={
                <ProtectedRoute>
                  <MyInteractions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>
      <Footer />
      <FloatingChat />
      <Toaster
        position="bottom-left"
        toastOptions={{
          duration: 3000,
          style: {
            background: theme === "dark" ? "#1f2937" : "#fff",
            color: theme === "dark" ? "#f9fafb" : "#111",
          },
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../utils/api";
import IdeaCard from "../components/IdeaCard";
import Loading from "../components/Loading";
import { Search, ChevronLeft, ChevronRight, LayoutGrid, ArrowUpDown } from "lucide-react";
import { motion } from "framer-motion";

const categories = ["Tech", "AI", "Health", "Education", "Finance", "Productivity"];
const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "most_liked", label: "Most Liked" },
  { value: "oldest", label: "Oldest" },
];

export default function Ideas() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "newest";
  const page = parseInt(searchParams.get("page") || "1");

  useEffect(() => {
    document.title = "Ideas | IdeaVault";
    fetchIdeas();
  }, [searchParams]);

  const fetchIdeas = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (category) params.append("category", category);
      if (sort) params.append("sort", sort);
      params.append("page", page);
      params.append("limit", 9);
      const res = await api.get(`/ideas?${params.toString()}`);
      setIdeas(res.data.ideas);
      setPagination({ page: res.data.page, pages: res.data.pages });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    params.set("page", "1");
    setSearchParams(params);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Browse Ideas</h1>
        
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-2 flex flex-col md:flex-row gap-2 md:items-center"
        >
          {/* Search Bar */}
          <div className="flex-1 flex items-center px-4 py-2.5 bg-gray-50 dark:bg-gray-900/50 rounded-xl focus-within:ring-2 focus-within:ring-primary/50 transition-all border border-transparent focus-within:border-primary/20 dark:focus-within:border-primary/20 group">
            <Search className="w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors shrink-0" />
            <input
              type="text"
              placeholder="Search ideas..."
              defaultValue={search}
              onKeyDown={(e) => {
                if (e.key === "Enter") updateFilter("search", e.target.value);
              }}
              className="w-full pl-3 bg-transparent border-none outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400 text-sm"
            />
          </div>

          <div className="hidden md:block w-px h-8 bg-gray-200 dark:bg-gray-700 mx-2"></div>

          {/* Filters */}
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-48 group">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <LayoutGrid className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
              </div>
              <select
                value={category}
                onChange={(e) => updateFilter("category", e.target.value)}
                className="w-full pl-9 pr-8 py-3 appearance-none bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-transparent hover:border-gray-200 dark:hover:border-gray-600 focus:border-primary focus:ring-2 focus:ring-primary/50 dark:text-gray-200 outline-none transition-all cursor-pointer text-sm font-medium"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {/* Custom Dropdown Arrow */}
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>

            <div className="relative flex-1 md:w-48 group">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <ArrowUpDown className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
              </div>
              <select
                value={sort}
                onChange={(e) => updateFilter("sort", e.target.value)}
                className="w-full pl-9 pr-8 py-3 appearance-none bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-transparent hover:border-gray-200 dark:hover:border-gray-600 focus:border-primary focus:ring-2 focus:ring-primary/50 dark:text-gray-200 outline-none transition-all cursor-pointer text-sm font-medium"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {/* Custom Dropdown Arrow */}
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {loading ? (
        <Loading />
      ) : ideas.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">No ideas found</p>
          <Link to="/add-idea" className="text-primary hover:underline mt-2 inline-block">
            Be the first to add one
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ideas.map((idea) => (
              <IdeaCard key={idea._id} idea={idea} />
            ))}
          </div>
          {pagination.pages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={() => updateFilter("page", String(page - 1))}
                disabled={page <= 1}
                className="p-2 border rounded-lg disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-gray-600 dark:text-gray-300">
                Page {page} of {pagination.pages}
              </span>
              <button
                onClick={() => updateFilter("page", String(page + 1))}
                disabled={page >= pagination.pages}
                className="p-2 border rounded-lg disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

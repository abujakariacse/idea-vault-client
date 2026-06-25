import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../utils/api";
import IdeaCard from "../components/IdeaCard";
import Loading from "../components/Loading";
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";

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
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search ideas..."
              defaultValue={search}
              onKeyDown={(e) => {
                if (e.key === "Enter") updateFilter("search", e.target.value);
              }}
              className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-primary outline-none"
            />
          </div>
          <select
            value={category}
            onChange={(e) => updateFilter("category", e.target.value)}
            className="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-primary outline-none"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => updateFilter("sort", e.target.value)}
            className="px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-primary outline-none"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
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

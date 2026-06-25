import { Link } from "react-router-dom";
import { Heart, ThumbsDown } from "lucide-react";
import { motion } from "framer-motion";

export default function IdeaCard({ idea }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow flex flex-col h-full"
    >
      {idea.image && <img src={idea.image} alt={idea.title} className="w-full h-40 object-cover" />}
      <div className="p-5 flex flex-col flex-1">
        <div className="mb-auto">
          <span className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full mb-3">
            {idea.category}
          </span>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
            {idea.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
            {idea.shortDescription}
          </p>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <img
              src={idea.author?.photo || `https://ui-avatars.com/api/?name=${idea.author?.name}`}
              alt={idea.author?.name}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{idea.author?.name}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-500 text-sm">
            <span className="flex items-center gap-1"><Heart className="w-4 h-4 text-red-500" /> {idea.likeCount || 0}</span>
            <span className="flex items-center gap-1"><ThumbsDown className="w-4 h-4" /> {idea.dislikeCount || 0}</span>
          </div>
        </div>
        <Link
          to={`/ideas/${idea._id}`}
          className="block w-full text-center py-2 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm font-semibold transition-colors mt-auto"
        >
          View Details
        </Link>
      </div>
    </motion.div>
  );
}

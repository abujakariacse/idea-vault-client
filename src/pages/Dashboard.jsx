import { Link, Outlet, useLocation } from 'react-router-dom';
import { PlusCircle, BookOpen, MessageSquare, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Overview & Profile', path: '/dashboard' },
    { icon: <PlusCircle className="w-5 h-5" />, label: 'Add Idea', path: '/dashboard/add-idea' },
    { icon: <BookOpen className="w-5 h-5" />, label: 'My Ideas', path: '/dashboard/my-ideas' },
    { icon: <MessageSquare className="w-5 h-5" />, label: 'My Interactions', path: '/dashboard/my-interactions' },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)] bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-white dark:bg-gray-800 shadow-sm border-r border-gray-100 dark:border-gray-700 md:min-h-[calc(100vh-64px)] z-10 flex-shrink-0">
        <div className="p-6">
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100 dark:border-gray-700 hidden md:flex">
            <img src={user?.photo || `https://ui-avatars.com/api/?name=${user?.name}`} alt={user?.name} className="w-12 h-12 rounded-full object-cover border-2 border-primary/20" />
            <div className="overflow-hidden">
              <h3 className="font-bold text-gray-900 dark:text-white truncate">{user?.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
          
          <div className="space-y-2 flex flex-row md:flex-col overflow-x-auto md:overflow-visible pb-2 md:pb-0">
            {menuItems.map((item, i) => (
              <Link 
                key={i} 
                to={item.path} 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 whitespace-nowrap md:whitespace-normal ${
                  (item.path === '/dashboard' ? location.pathname === '/dashboard' : location.pathname.startsWith(item.path))
                    ? 'bg-primary text-white shadow-md' 
                    : 'text-gray-600 dark:text-gray-300 hover:bg-primary/10 dark:hover:bg-gray-700 hover:text-primary dark:hover:text-primary-400'
                }`}
              >
                {item.icon}<span className="font-semibold">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-auto">
        <div className="max-w-6xl mx-auto w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
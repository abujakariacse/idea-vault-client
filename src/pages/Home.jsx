import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import Banner from '../components/Banner';
import IdeaCard from '../components/IdeaCard';
import Loading from '../components/Loading';
import { TrendingUp, Users, Zap, Award, ArrowRight, Cpu, Brain, Heart, BookOpen, DollarSign, Briefcase } from 'lucide-react';

export default function Home() {
  const [trendingIdeas, setTrendingIdeas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = 'Home | IdeaVault';
    api.get('/ideas/trending').then(res => setTrendingIdeas(res.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  const categories = [
    { name: 'Tech', icon: <Cpu className="w-8 h-8 mb-3 mx-auto text-primary group-hover:scale-110 transition-transform" /> },
    { name: 'AI', icon: <Brain className="w-8 h-8 mb-3 mx-auto text-primary group-hover:scale-110 transition-transform" /> },
    { name: 'Health', icon: <Heart className="w-8 h-8 mb-3 mx-auto text-primary group-hover:scale-110 transition-transform" /> },
    { name: 'Education', icon: <BookOpen className="w-8 h-8 mb-3 mx-auto text-primary group-hover:scale-110 transition-transform" /> },
    { name: 'Finance', icon: <DollarSign className="w-8 h-8 mb-3 mx-auto text-primary group-hover:scale-110 transition-transform" /> },
    { name: 'Productivity', icon: <Briefcase className="w-8 h-8 mb-3 mx-auto text-primary group-hover:scale-110 transition-transform" /> }
  ];
  const steps = [
    { icon: <Zap className="w-8 h-8" />, title: 'Share Your Idea', desc: 'Submit your startup concept with all the details and pitch your vision.' },
    { icon: <Users className="w-8 h-8" />, title: 'Get Feedback', desc: 'Receive comments, suggestions, and validation from the community.' },
    { icon: <TrendingUp className="w-8 h-8" />, title: 'Watch It Grow', desc: 'Track likes and engagement as your idea gains real traction.' }
  ];
  const contributors = [
    { name: 'Sarah Chen', ideas: 12, avatar: 'https://i.pravatar.cc/100?img=1' },
    { name: 'Alex Rivera', ideas: 8, avatar: 'https://i.pravatar.cc/100?img=2' },
    { name: 'Jordan Kim', ideas: 7, avatar: 'https://i.pravatar.cc/100?img=3' }
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 transition-colors">
      <Banner />
      
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex justify-between items-end mb-10">
          <div>
            <span className="text-primary font-bold tracking-wider uppercase text-sm mb-2 block">Top Rated</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Trending Ideas</h2>
          </div>
          <Link to="/ideas" className="hidden md:flex items-center text-primary hover:text-primary-dark font-semibold group transition-colors">
            View All <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        {loading ? <Loading /> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trendingIdeas.map(idea => <IdeaCard key={idea._id} idea={idea} />)}
          </div>
        )}
        <div className="mt-10 flex justify-center md:hidden">
          <Link to="/ideas" className="px-6 py-3 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-semibold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
            View All Ideas
          </Link>
        </div>
      </section>

      <section className="bg-white dark:bg-gray-800 border-y border-gray-100 dark:border-gray-700 py-20 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">Popular Categories</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">Explore startup concepts across various industries.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map(cat => (
              <Link key={cat.name} to={`/ideas?category=${cat.name}`} className="p-6 bg-gray-50 dark:bg-gray-700 rounded-2xl text-center border border-gray-100 dark:border-gray-600 hover:border-primary dark:hover:border-primary hover:shadow-lg transition-all group hover:-translate-y-1">
                {cat.icon}
                <span className="font-bold text-gray-700 dark:text-gray-200 group-hover:text-primary transition-colors">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">How It Works</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">Your journey from an abstract concept to a validated startup idea.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-gray-200 via-primary/50 to-gray-200 dark:from-gray-700 dark:via-primary/50 dark:to-gray-700 -z-10"></div>
          {steps.map((step, i) => (
            <div key={i} className="text-center relative">
              <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary shadow-xl shadow-primary/5 border border-gray-100 dark:border-gray-700 transform transition-transform hover:-translate-y-2 hover:shadow-primary/20">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{step.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-xs mx-auto">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-primary/5 dark:bg-primary/10 py-20 border-t border-primary/10 dark:border-primary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">Top Contributors</h2>
              <p className="text-gray-600 dark:text-gray-400">The most active minds in our community.</p>
            </div>
            <Award className="w-12 h-12 text-primary hidden md:block opacity-80" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contributors.map((c, i) => (
              <div key={i} className="flex items-center gap-5 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                <img src={c.avatar} alt={c.name} className="w-16 h-16 rounded-full ring-4 ring-primary/10" />
                <div>
                  <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-1">{c.name}</h4>
                  <p className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full inline-block">{c.ideas} ideas shared</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
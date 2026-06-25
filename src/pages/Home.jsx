import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import Banner from '../components/Banner';
import IdeaCard from '../components/IdeaCard';
import Loading from '../components/Loading';
import { TrendingUp, Users, Zap, Award, ArrowRight, Cpu, Brain, Heart, BookOpen, DollarSign, Briefcase, Mail, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

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

  const testimonials = [
    { text: "IdeaVault helped me validate my SaaS idea before I spent 6 months building it. The feedback was invaluable!", author: "Michael B.", role: "Founder, TechFlow" },
    { text: "I met my technical co-founder here through the comments section of my AI project. Best community ever.", author: "Lisa K.", role: "CEO, AI-Gen" }
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 transition-colors">
      <Banner />
      
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
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
          <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trendingIdeas.map(idea => (
              <motion.div key={idea._id} variants={fadeInUp}>
                <IdeaCard idea={idea} />
              </motion.div>
            ))}
          </motion.div>
        )}
        <div className="mt-10 flex justify-center md:hidden">
          <Link to="/ideas" className="px-6 py-3 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-semibold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
            View All Ideas
          </Link>
        </div>
      </motion.section>

      <section className="bg-white dark:bg-gray-800 border-y border-gray-100 dark:border-gray-700 py-20 transition-colors">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">Popular Categories</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">Explore startup concepts across various industries.</p>
          </div>
          <motion.div variants={staggerContainer} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map(cat => (
              <motion.div key={cat.name} variants={fadeInUp}>
                <Link to={`/ideas?category=${cat.name}`} className="block p-6 bg-gray-50 dark:bg-gray-700 rounded-2xl text-center border border-gray-100 dark:border-gray-600 hover:border-primary dark:hover:border-primary hover:shadow-lg transition-all group">
                  {cat.icon}
                  <span className="font-bold text-gray-700 dark:text-gray-200 group-hover:text-primary transition-colors">{cat.name}</span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">How It Works</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">Your journey from an abstract concept to a validated startup idea.</p>
          </div>
          <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-gray-200 via-primary/50 to-gray-200 dark:from-gray-700 dark:via-primary/50 dark:to-gray-700 -z-10"></div>
            {steps.map((step, i) => (
              <motion.div key={i} variants={fadeInUp} className="text-center relative">
                <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary shadow-xl shadow-primary/5 border border-gray-100 dark:border-gray-700 transform transition-transform hover:-translate-y-2 hover:shadow-primary/20">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-xs mx-auto">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <section className="bg-primary text-white py-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Success Stories</h2>
            <p className="text-primary-100 max-w-2xl mx-auto text-lg">Hear from creators who validated their ideas.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((test, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl relative">
                <span className="text-6xl text-white/20 absolute top-4 left-6 font-serif">"</span>
                <p className="text-lg md:text-xl font-medium leading-relaxed mb-6 relative z-10">{test.text}</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary font-bold text-xl">
                    {test.author.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold">{test.author}</h4>
                    <p className="text-primary-100 text-sm">{test.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <section className="bg-primary/5 dark:bg-primary/10 py-20 border-t border-primary/10 dark:border-primary/20">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-2">Top Contributors</h2>
              <p className="text-gray-600 dark:text-gray-400">The most active minds in our community.</p>
            </div>
            <Award className="w-12 h-12 text-primary hidden md:block opacity-80" />
          </div>
          <motion.div variants={staggerContainer} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contributors.map((c, i) => (
              <motion.div key={i} variants={fadeInUp} className="flex items-center gap-5 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                <img src={c.avatar} alt={c.name} className="w-16 h-16 rounded-full ring-4 ring-primary/10" />
                <div>
                  <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-1">{c.name}</h4>
                  <p className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full inline-block">{c.ideas} ideas shared</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <section className="bg-white dark:bg-gray-900 py-24 border-t border-gray-100 dark:border-gray-800">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <Mail className="w-16 h-16 text-primary mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">Join Our Newsletter</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-xl mx-auto text-lg">
            Get the top startup ideas and validation frameworks delivered to your inbox every week.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => { e.preventDefault(); alert("Subscribed!"); }}>
            <input 
              type="email" 
              placeholder="Enter your email" 
              required
              className="flex-1 px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
            <button type="submit" className="px-6 py-3 bg-primary text-white font-bold rounded-xl shadow-md hover:bg-primary-dark transition-colors whitespace-nowrap flex items-center justify-center gap-2">
              Subscribe <CheckCircle className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      </section>
    </div>
  );
}
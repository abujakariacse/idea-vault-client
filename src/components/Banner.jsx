import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    title: "Unlock Your Startup Potential",
    description: "Share your innovative ideas and get feedback from the community of creators.",
    cta: "Explore Ideas",
    image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200",
    cta_url: "ideas",
  },
  {
    title: "Collaborate & Innovate Together",
    description: "Connect with like-minded entrepreneurs and build something amazing.",
    cta: "Add Your Idea",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200",
    cta_url: "/dashboad/ideas",
  },
  {
    title: "Turn Ideas Into Reality",
    description: "Get validation and support to bring your startup vision to life.",
    cta: "Get Started",
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1200",
    cta_url: "/dashboard",
  },
];

export default function Banner() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[500px] md:h-[600px] overflow-hidden">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${i === current ? "opacity-100 scale-100 z-20 pointer-events-auto" : "opacity-0 scale-105 z-0 pointer-events-none"}`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/60 to-transparent z-10"></div>
          <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 z-20 flex items-center">
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
              <div className="max-w-2xl transform transition-all duration-700 translate-y-0">
                <span className="inline-block py-1 px-3 rounded-full bg-white/70 border border-primary/50 text-primary-100 font-medium text-sm mb-6 tracking-wide uppercase shadow-sm">
                  IdeaVault Vision
                </span>
                <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg tracking-tight">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-xl text-gray-200 mb-10 leading-relaxed font-light drop-shadow-md">
                  {slide.description}
                </p>
                <Link
                  to={slide?.cta_url}
                  className="inline-flex items-center justify-center px-8 py-4 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-all duration-300 shadow-xl hover:shadow-primary/30 hover:-translate-y-1 group"
                >
                  {slide?.cta}
                  <svg
                    className="ml-2 w-5 h-5 pointer-events-none transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    ></path>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={prev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-all border border-white/20 hover:scale-110 group"
      >
        <ChevronLeft className="w-6 h-6 text-white opacity-70 group-hover:opacity-100" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 p-3 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-all border border-white/20 hover:scale-110 group"
      >
        <ChevronRight className="w-6 h-6 text-white opacity-70 group-hover:opacity-100" />
      </button>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-2 rounded-full transition-all duration-300 ${i === current ? "w-8 bg-primary shadow-[0_0_10px_rgba(79,70,229,0.5)]" : "w-2 bg-white/50 hover:bg-white/80"}`}
          ></button>
        ))}
      </div>
    </div>
  );
}

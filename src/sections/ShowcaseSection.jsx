import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Project links
const projectLinks = {
  analytica: {
    github: "https://github.com/Troy2727/analytica.git",
    vercel: "https://analytica-phi.vercel.app"
  },
  brainwave: {
    github: "https://github.com/Troy2727/brainwave-AI.git",
    vercel: "https://brainwave-ai-gamma.vercel.app"
  },
  prepwise: {
    github: "https://github.com/Troy2727/ai_mock_interview.git",
    vercel: "https://ai-mock-interview-nine-ivory.vercel.app"
  }
};

gsap.registerPlugin(ScrollTrigger);

const AppShowcase = () => {
  const sectionRef = useRef(null);
  const analyticaRef = useRef(null);
  const brainwaveRef = useRef(null);
  const prepwiseRef = useRef(null);

  useGSAP(() => {
    // Animation for the main section
    gsap.fromTo(
      sectionRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1.5 }
    );

    // Animations for each app showcase
    const cards = [analyticaRef.current, brainwaveRef.current, prepwiseRef.current];

    cards.forEach((card, index) => {
      gsap.fromTo(
        card,
        {
          y: 50,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: 0.3 * (index + 1),
          scrollTrigger: {
            trigger: card,
            start: "top bottom-=100",
          },
        }
      );
    });
  }, []);

  return (
    <div id="work" ref={sectionRef} className="app-showcase">
      <div className="w-full">
        <div className="showcaselayout">
          <div ref={analyticaRef} className="first-project-wrapper">
            <div className="image-wrapper bg-white p-0">
              <img src="/images/project1.png" alt="Analytica Analytics Tool" className="max-w-full max-h-full object-contain" />
            </div>
            <div className="text-content">
              <h2>
                Analytica
              </h2>
              <p className="text-white-50 md:text-xl">
                Analytica is a free and open-source analytics tool that requires just one line of code to set up.
                It comes with built-in Discord notifications and works seamlessly with any website, giving you all the analytics data you need to make informed decisions.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="bg-black-200 py-1 px-3 rounded-full text-xs">Next.js</span>
                <span className="bg-black-200 py-1 px-3 rounded-full text-xs">shadcn/ui</span>
                <span className="bg-black-200 py-1 px-3 rounded-full text-xs">Discord</span>
                <span className="bg-black-200 py-1 px-3 rounded-full text-xs">Supabase</span>
                <span className="bg-black-200 py-1 px-3 rounded-full text-xs">Vercel</span>
              </div>
              <div className="flex gap-4 mt-4">
                <a href={projectLinks.analytica.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white-50 hover:text-white transition-colors">
                  <img src="/images/logos/github.svg" alt="GitHub" className="w-6 h-6" />
                  <span>GitHub</span>
                </a>
                <a href={projectLinks.analytica.vercel} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white-50 hover:text-white transition-colors">
                  <img src="/images/logos/vercel-circle.svg" alt="Vercel" className="w-6 h-6" />
                  <span>Vercel</span>
                </a>
              </div>
            </div>
          </div>

          <div className="project-list-wrapper overflow-hidden">
            <div className="project" ref={brainwaveRef}>
              <div className="image-wrapper bg-white p-0">
                <img
                  src="/images/project2.jpg"
                  alt="Brainwave AI Website"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <h2>Brainwave AI - Modern UI/UX Website</h2>
              <p className="text-white-50 text-sm mt-2">
                A modern UI/UX website for an AI platform with sleek animations and responsive design.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="bg-black-200 py-1 px-3 rounded-full text-xs">React</span>
                <span className="bg-black-200 py-1 px-3 rounded-full text-xs">Tailwind CSS</span>
                <span className="bg-black-200 py-1 px-3 rounded-full text-xs">Framer Motion</span>
                <span className="bg-black-200 py-1 px-3 rounded-full text-xs">Vite</span>
              </div>
              <div className="flex gap-4 mt-3">
                <a href={projectLinks.brainwave.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white-50 hover:text-white transition-colors">
                  <img src="/images/logos/github.svg" alt="GitHub" className="w-6 h-6" />
                  <span>GitHub</span>
                </a>
                <a href={projectLinks.brainwave.vercel} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white-50 hover:text-white transition-colors">
                  <img src="/images/logos/vercel-circle.svg" alt="Vercel" className="w-6 h-6" />
                  <span>Vercel</span>
                </a>
              </div>
            </div>

            <div className="project" ref={prepwiseRef}>
              <div className="image-wrapper bg-white p-0">
                <img src="/images/project3.png" alt="Prepwise Interview Platform" className="max-w-full max-h-full object-contain" />
              </div>
              <h2>Prepwise: AI Interview Preparation Platform</h2>
              <p className="text-white-50 text-sm mt-2">
                An AI-powered platform that helps you prepare for job interviews with realistic mock interviews and personalized feedback.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="bg-black-200 py-1 px-3 rounded-full text-xs">Next.js</span>
                <span className="bg-black-200 py-1 px-3 rounded-full text-xs">Vapi</span>
                <span className="bg-black-200 py-1 px-3 rounded-full text-xs">Tailwind CSS</span>
                <span className="bg-black-200 py-1 px-3 rounded-full text-xs">Firebase</span>
              </div>
              <div className="flex gap-4 mt-3">
                <a href={projectLinks.prepwise.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white-50 hover:text-white transition-colors">
                  <img src="/images/logos/github.svg" alt="GitHub" className="w-6 h-6" />
                  <span>GitHub</span>
                </a>
                <a href={projectLinks.prepwise.vercel} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white-50 hover:text-white transition-colors">
                  <img src="/images/logos/vercel-circle.svg" alt="Vercel" className="w-6 h-6" />
                  <span>Vercel</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppShowcase;

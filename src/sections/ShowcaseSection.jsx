import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Project links
const projectLinks = {
  brainwave: {
    github: "https://github.com/Troy2727/brainwave-AI.git",
    vercel: "https://brainwave-ai-gamma.vercel.app"
  },
  prepwise: {
    github: "https://github.com/Troy2727/ai_mock_interview.git",
    vercel: "https://ai-mock-interview-gamma-six.vercel.app"
  }
};

gsap.registerPlugin(ScrollTrigger);

const AppShowcase = () => {
  const sectionRef = useRef(null);
  const rydeRef = useRef(null);
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
    const cards = [rydeRef.current, brainwaveRef.current, prepwiseRef.current];

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
          <div ref={rydeRef} className="first-project-wrapper">
            <div className="image-wrapper bg-white p-0">
              <img src="/images/project1.png" alt="Ryde App Interface" className="max-w-full max-h-full object-contain" />
            </div>
            <div className="text-content">
              <h2>
                On-Demand Rides Made Simple with a Powerful, User-Friendly App
                called Ryde
              </h2>
              <p className="text-white-50 md:text-xl">
                An app built with React Native, Expo, & TailwindCSS for a fast,
                user-friendly experience.
              </p>
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
              <div className="flex gap-4 mt-2">
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
              <h2>Prepwise: Job Interview Platform with Vapi AI Voice Agents</h2>
              <div className="flex gap-4 mt-2">
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

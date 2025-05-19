import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Project links
const projectLinks = {
  coeditflow: {
    github: "https://github.com/Troy2727/coedit_flow.git",
    vercel: "https://coeditflow.vercel.app"
  },
  analytica: {
    github: "https://github.com/Troy2727/analytica.git",
    vercel: "https://analytica-phi.vercel.app"
  },
  spotify: {
    github: "https://github.com/Troy2727/spotify_clone.git",
    vercel: "https://spotify-clone-jade-pi-29.vercel.app"
  }
};

gsap.registerPlugin(ScrollTrigger);

const AppShowcase = () => {
  const sectionRef = useRef(null);
  const coeditflowRef = useRef(null);
  const analyticaRef = useRef(null);
  const spotifyRef = useRef(null);

  useGSAP(() => {
    // Animation for the main section
    gsap.fromTo(
      sectionRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1.5 }
    );

    // Animations for each app showcase
    const cards = [coeditflowRef.current, analyticaRef.current, spotifyRef.current];

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
          <div ref={coeditflowRef} className="first-project-wrapper">
            <div className="image-wrapper bg-white p-0">
              <img src="/images/project1.png" alt="CoEditFlow Collaborative Document Editor" className="max-w-full max-h-full object-contain" />
            </div>
            <div className="text-content">
              <h2>
                CoEditFlow - Real-Time Collaborative Document Editor
              </h2>
              <p className="text-white-50 md:text-xl">
                A real-time collaborative document editor inspired by Google Docs, built using modern web technologies to showcase advanced frontend and backend integration.
                This project demonstrates proficiency in building scalable, real-time applications with a focus on user experience and performance.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="bg-black-200 py-1 px-3 rounded-full text-xs">Next.js</span>
                <span className="bg-black-200 py-1 px-3 rounded-full text-xs">TypeScript</span>
                <span className="bg-black-200 py-1 px-3 rounded-full text-xs">Tailwind CSS</span>
                <span className="bg-black-200 py-1 px-3 rounded-full text-xs">Socket.io</span>
                <span className="bg-black-200 py-1 px-3 rounded-full text-xs">MongoDB</span>
              </div>
              <div className="flex gap-4 mt-4">
                <a href={projectLinks.coeditflow.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white-50 hover:text-white transition-colors">
                  <img src="/images/logos/github.svg" alt="GitHub" className="w-6 h-6" />
                  <span>GitHub</span>
                </a>
                <a href={projectLinks.coeditflow.vercel} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white-50 hover:text-white transition-colors">
                  <img src="/images/logos/vercel-circle.svg" alt="Vercel" className="w-6 h-6" />
                  <span>Vercel</span>
                </a>
              </div>
            </div>
          </div>

          <div className="project-list-wrapper overflow-hidden">
            <div className="project" ref={analyticaRef}>
              <div className="image-wrapper bg-white p-0">
                <img
                  src="/images/project2.png"
                  alt="Analytica Analytics Tool"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <h2>
                Analytica
              </h2>
              <p className="text-white-50 md:text-xl">
                Analytica is a free and open-source analytics tool that requires just one line of code to set up.
                It comes with built-in Discord notifications and works seamlessly with any website.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="bg-black-200 py-1 px-3 rounded-full text-xs">Next.js</span>
                <span className="bg-black-200 py-1 px-3 rounded-full text-xs">shadcn/ui</span>
                <span className="bg-black-200 py-1 px-3 rounded-full text-xs">Discord</span>
                <span className="bg-black-200 py-1 px-3 rounded-full text-xs">Supabase</span>
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

            <div className="project" ref={spotifyRef}>
              <div className="image-wrapper bg-white p-0">
                <img
                  src="/images/project3.png"
                  alt="Spotify Clone"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <h2>
                Spotify Clone
              </h2>
              <p className="text-white-50 md:text-xl">
                This project combines the power of real-time communication and a sleek music streaming interface to deliver an interactive and enjoyable user experience.
                With this app, you can listen to music, interact with users, chat in real-time, and manage your albums and songs.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="bg-black-200 py-1 px-3 rounded-full text-xs">React</span>
                <span className="bg-black-200 py-1 px-3 rounded-full text-xs">Node.js</span>
                <span className="bg-black-200 py-1 px-3 rounded-full text-xs">MongoDB</span>
                <span className="bg-black-200 py-1 px-3 rounded-full text-xs">Socket.IO</span>
                <span className="bg-black-200 py-1 px-3 rounded-full text-xs">TypeScript</span>
              </div>
              <div className="flex gap-4 mt-4">
                <a href={projectLinks.spotify.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white-50 hover:text-white transition-colors">
                  <img src="/images/logos/github.svg" alt="GitHub" className="w-6 h-6" />
                  <span>GitHub</span>
                </a>
                <a href={projectLinks.spotify.vercel} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white-50 hover:text-white transition-colors">
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

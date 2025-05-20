import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Project links
const projectLinks = {
  livedocs: {
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
  const livedocsRef = useRef(null);
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
    const cards = [livedocsRef.current, analyticaRef.current, spotifyRef.current];

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
          <div ref={livedocsRef} className="first-project-wrapper">
            <div className="image-wrapper bg-white p-0">
              <img src="/images/project1.png" alt="Live Docs Application - Collaborative Document Editor" className="max-w-full max-h-full object-contain" />
            </div>
            <div className="text-content">
              <h2>
                Live Docs Application - Real-Time Collaborative Document Editor
              </h2>
              <p className="text-white-50 text-base md:text-lg leading-relaxed">
                📄 Real-Time Collaborative Document Editor

Live Docs Application is a full-featured, real-time collaborative document editor inspired by Google Docs. Built with modern web technologies, it enables multiple users to edit documents simultaneously while showcasing seamless frontend–backend integration. The platform includes live cursors, inline commenting, role-based permissions, and version history — all supported by a scalable real-time infrastructure. This project demonstrates advanced knowledge of state synchronization, WebSockets, access control, and conflict resolution, with a strong focus on performance and user experience.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="bg-black-200 py-1 px-3 rounded-full text-xs">Next.js</span>
                <span className="bg-black-200 py-1 px-3 rounded-full text-xs">TypeScript</span>
                <span className="bg-black-200 py-1 px-3 rounded-full text-xs">Tailwind CSS</span>
                <span className="bg-black-200 py-1 px-3 rounded-full text-xs">Socket.io</span>
                <span className="bg-black-200 py-1 px-3 rounded-full text-xs">MongoDB</span>
              </div>
              <div className="flex gap-4 mt-4">
                <a href={projectLinks.livedocs.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white-50 hover:text-white transition-colors">
                  <img src="/images/logos/github.svg" alt="GitHub" className="w-6 h-6" />
                  <span>GitHub</span>
                </a>
                <a href={projectLinks.livedocs.vercel} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white-50 hover:text-white transition-colors">
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
              <p className="text-white-50 text-base md:text-lg leading-relaxed">
                Analytica is a free, open-source analytics and event tracking tool built for developers. With a one-line integration, it enables real-time monitoring of user journeys, custom event tracking, and performance insights. Analytica features Discord notifications out of the box, allowing developers and teams to receive instant alerts about critical user interactions or traffic spikes. Designed to be fast, privacy-conscious, and developer-friendly, it works with any website and can be self-hosted for full control over your data.
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
              <p className="text-white-50 text-base md:text-lg leading-relaxed">
                This advanced Spotify Clone is more than just a music player — it's a real-time, social streaming platform. Users can stream music, manage albums and playlists, chat live, and see who's online. The app also includes a real-time activity feed, showing what other users are listening to, similar to Spotify's friend activity feature. Built with a focus on interactivity and smooth UX, this project showcases proficiency in media streaming, real-time communication, presence tracking, and dynamic frontend design.
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

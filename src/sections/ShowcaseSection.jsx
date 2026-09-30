import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Project links
const projectLinks = {
  fanclash: {
    live: "https://fanclash.io"
  },
  analytica: {
    github: "https://github.com/Troy2727/analytica.git",
    vercel: "https://analytica-phi.vercel.app"
  },
  livedocs: {
    github: "https://github.com/Troy2727/coedit_flow.git",
    vercel: "https://coeditflow.vercel.app"
  }
};

gsap.registerPlugin(ScrollTrigger);

const AppShowcase = () => {
  const sectionRef = useRef(null);
  const fanclashRef = useRef(null);
  const analyticaRef = useRef(null);
  const livedocsRef = useRef(null);

  useGSAP(() => {
    // Animation for the main section
    gsap.fromTo(
      sectionRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1.5 }
    );

    // Animations for each app showcase
    const cards = [fanclashRef.current, analyticaRef.current, livedocsRef.current];

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
          <div ref={fanclashRef} className="first-project-wrapper">
            <div className="image-wrapper p-0 h-auto aspect-[5/4]">
              <img src="/images/fanclash.jpg" alt="FanClash - Live Video Debate Arena for Sports Fans" className="max-w-full max-h-full object-contain" />
            </div>
            <div className="text-content">
              <h2>
                FanClash - Live Video Debate Arena for Sports Fans
              </h2>
              <p className="text-white-50 text-base md:text-lg leading-relaxed">
                FanClash is a production sports platform where rival fans form teams, challenge each other, and argue live on stage while the audience votes on a winner. A debate is modeled as a state machine — pending, accepted, scheduled, live, completed — where live is the only state that accepts votes, keeping scoring tamper-resistant and the results auditable. The Go API serves real-time video rooms, chat, presence, and leaderboards on top of MySQL and Redis, while the React 19 frontend handles subscriptions, localization, and production error tracking. Designed monolith-first for early traffic with a clear path to scale.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="bg-black-200 py-1 px-3 rounded-full text-xs flex items-center gap-1.5">
                  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg" alt="" className="w-4 h-4" />
                  React 19
                </span>
                <span className="bg-black-200 py-1 px-3 rounded-full text-xs flex items-center gap-1.5">
                  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/go/go-original.svg" alt="" className="w-4 h-4" />
                  Go
                </span>
                <span className="bg-black-200 py-1 px-3 rounded-full text-xs flex items-center gap-1.5">
                  <img src="/images/logos/mysql.svg" alt="" className="w-5 h-5" />
                  MySQL
                </span>
                <span className="bg-black-200 py-1 px-3 rounded-full text-xs flex items-center gap-1.5">
                  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/redis/redis-original.svg" alt="" className="w-4 h-4" />
                  Redis
                </span>
                <span className="bg-black-200 py-1 px-3 rounded-full text-xs flex items-center gap-1.5">
                  <img src="/images/logos/stripe.svg" alt="" className="w-4 h-4" />
                  Stripe
                </span>
                <span className="bg-black-200 py-1 px-3 rounded-full text-xs flex items-center gap-1.5">
                  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original.svg" alt="" className="w-5 h-5" />
                  Docker
                </span>
              </div>
              <div className="flex gap-4 mt-4">
                <a href={projectLinks.fanclash.live} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white-50 hover:text-white transition-colors">
                  <img src="/images/logos/vercel-circle.svg" alt="Live Site" className="w-6 h-6" />
                  <span>Live Site</span>
                </a>
              </div>
            </div>
          </div>

          <div className="project-list-wrapper overflow-hidden">
            <div className="project" ref={analyticaRef}>
              <div className="image-wrapper p-0 xl:h-auto xl:aspect-video">
                <img
                  src="/images/analytica-card.jpg"
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
                <span className="bg-black-200 py-1 px-3 rounded-full text-xs flex items-center gap-1.5">
                  <img src="/images/logos/nextjs.svg" alt="" className="w-4 h-4" />
                  Next.js
                </span>
                <span className="bg-black-200 py-1 px-3 rounded-full text-xs flex items-center gap-1.5">
                  <img src="/images/logos/shadcn-ui.svg" alt="" className="w-4 h-4" />
                  shadcn/ui
                </span>
                <span className="bg-black-200 py-1 px-3 rounded-full text-xs flex items-center gap-1.5">
                  <img src="/images/logos/discord.svg" alt="" className="w-4 h-4" />
                  Discord
                </span>
                <span className="bg-black-200 py-1 px-3 rounded-full text-xs flex items-center gap-1.5">
                  <img src="/images/logos/supabase.svg" alt="" className="w-4 h-4" />
                  Supabase
                </span>
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

            <div className="project" ref={livedocsRef}>
              <div className="image-wrapper p-0">
                <img
                  src="/images/project1.jpg"
                  alt="Live Docs Application - Collaborative Document Editor"
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <h2>
                Live Docs - Real-Time Collaborative Document Editor
              </h2>
              <p className="text-white-50 text-base md:text-lg leading-relaxed">
                Live Docs Application is a full-featured, real-time collaborative document editor inspired by Google Docs. Built with modern web technologies, it enables multiple users to edit documents simultaneously while showcasing seamless frontend–backend integration. The platform includes live cursors, inline commenting, role-based permissions, and version history — all supported by a scalable real-time infrastructure. This project demonstrates advanced knowledge of state synchronization, WebSockets, access control, and conflict resolution, with a strong focus on performance and user experience.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="bg-black-200 py-1 px-3 rounded-full text-xs flex items-center gap-1.5">
                  <img src="/images/logos/nextjs.svg" alt="" className="w-4 h-4" />
                  Next.js
                </span>
                <span className="bg-black-200 py-1 px-3 rounded-full text-xs flex items-center gap-1.5">
                  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" alt="" className="w-4 h-4" />
                  TypeScript
                </span>
                <span className="bg-black-200 py-1 px-3 rounded-full text-xs flex items-center gap-1.5">
                  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/tailwindcss/tailwindcss-original.svg" alt="" className="w-4 h-4" />
                  Tailwind CSS
                </span>
                <span className="bg-black-200 py-1 px-3 rounded-full text-xs flex items-center gap-1.5">
                  <img src="/images/logos/socketio.svg" alt="" className="w-4 h-4" />
                  Socket.io
                </span>
                <span className="bg-black-200 py-1 px-3 rounded-full text-xs flex items-center gap-1.5">
                  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mongodb/mongodb-original.svg" alt="" className="w-4 h-4" />
                  MongoDB
                </span>
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
        </div>
      </div>
    </div>
  );
};

export default AppShowcase;

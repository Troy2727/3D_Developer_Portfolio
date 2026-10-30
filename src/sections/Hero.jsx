import { lazy, Suspense } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useMediaQuery } from "react-responsive";

import AnimatedCounter from "../components/AnimatedCounter";
import Button from "../components/Button";

// Loaded after first paint so the headline doesn't wait on the 3D library
const HeroExperience = lazy(() => import("../components/models/hero_models/HeroExperience"));

const Hero = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" }); // below Tailwind's md breakpoint

  useGSAP(() => {
    gsap.fromTo(
      ".hero-text h1",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, stagger: 0.2, duration: 1, ease: "power2.inOut" }
    );
  });

  return (
    <section id="hero" className="relative overflow-hidden">
      <div className="absolute top-0 left-0 z-10">
        <img src="/images/bg.png" alt="" />
      </div>

      <div className="hero-layout">
        {/* LEFT: Hero Content */}
        <header className="@container flex flex-col justify-center xl:w-[45%] w-full md:px-10 px-5 xl:max-w-[45%]">
          <div className="flex flex-col gap-5 md:gap-7">
            <div className="hero-text">
              <h1>
                <span className="text-white font-bold">Full-stack engineer</span>
              </h1>
              <h1>
                <span className="text-white font-bold mr-[0.3em]">who ships</span>
                <span className="word-gradient word-gradient-2">real products.</span>
              </h1>
            </div>

            <p className="text-white-50 text-base md:text-lg relative z-10 pointer-events-none max-w-full md:max-w-[95%]">
              Hi, I'm Alex. I build production apps end to end in Go, Python, JavaScript, TypeScript, and React, from live video platforms to local AI tools.
            </p>

            <Button
              text="See My Work"
              className="md:w-80 md:h-16 w-full h-12 mt-2"
              id="work"
            />

            {/* Proof on the first screen, next to the call to action */}
            {/* One row of three cards when there's room (≥340px), a stacked list on the narrowest phones */}
            <div className="@container/proof">
            <ul className="grid grid-cols-1 @min-[340px]/proof:grid-cols-3 gap-2 md:gap-3 max-w-xl">
              <li className="@container">
                <div className="proof-item">
                  <span className="proof-icon bg-red-400/10 border-red-400/25 text-red-400">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" />
                      <path d="M22 10v6" />
                      <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />
                    </svg>
                  </span>
                  <span>
                    <span className="proof-value">MIT xPRO</span>
                    <span className="proof-label">Certified</span>
                  </span>
                </div>
              </li>
              <li className="@container">
                <a href="https://fanclash.io" target="_blank" rel="noopener noreferrer" className="proof-item hover:border-orange-400/50 transition-colors">
                  <span className="proof-icon bg-orange-400/10 border-orange-400/25 text-orange-400">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
                      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
                    </svg>
                  </span>
                  <span>
                    <span className="proof-value">
                      FanClash
                      <span className="relative flex size-2">
                        <span className="absolute inline-flex size-full rounded-full bg-green-400 opacity-75 animate-ping" />
                        <span className="relative inline-flex size-2 rounded-full bg-green-400" />
                      </span>
                    </span>
                    <span className="proof-label">Founder ↗</span>
                  </span>
                </a>
              </li>
              <li className="@container">
                <div className="proof-item">
                  <span className="proof-icon bg-purple-400/10 border-purple-400/25 text-purple-400">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
                      <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
                      <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
                    </svg>
                  </span>
                  <span>
                    <span className="proof-value">18+ projects</span>
                    <span className="proof-label">Completed</span>
                  </span>
                </div>
              </li>
            </ul>
            </div>
          </div>
        </header>

        {/* RIGHT: 3D Model or Visual - only one canvas is mounted per breakpoint */}
        {isMobile ? (
          <div className="w-full h-[45vh] mt-6 relative">
            <Suspense fallback={null}>
              <HeroExperience />
            </Suspense>
          </div>
        ) : (
          <figure className="xl:w-[55%] w-full flex items-center justify-center">
            <div className="hero-3d-layout">
              <Suspense fallback={null}>
                <HeroExperience />
              </Suspense>
            </div>
          </figure>
        )}
      </div>

      <AnimatedCounter />
    </section>
  );
};

export default Hero;

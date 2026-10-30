import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useMediaQuery } from "react-responsive";

import AnimatedCounter from "../components/AnimatedCounter";
import Button from "../components/Button";
import HeroExperience from "../components/models/hero_models/HeroExperience";

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
              Hi, I'm Alex. I build production apps end to end in Go, Python, TypeScript, and React, from live video platforms to local AI tools.
            </p>

            <Button
              text="See My Work"
              className="md:w-80 md:h-16 w-full h-12 mt-2"
              id="counter"
            />

            {/* Proof on the first screen, next to the call to action */}
            <ul className="flex flex-wrap items-center gap-x-5 gap-y-3 text-white-50 text-sm md:text-base">
              <li>🎓 MIT xPRO Certified</li>
              <li className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-green-400" />
                <span>
                  Founder of{" "}
                  <a href="https://fanclash.io" target="_blank" rel="noopener noreferrer" className="text-white underline underline-offset-4 hover:text-white-50">
                    FanClash
                  </a>
                </span>
              </li>
              <li>12+ completed projects</li>
            </ul>
          </div>
        </header>

        {/* RIGHT: 3D Model or Visual - only one canvas is mounted per breakpoint */}
        {isMobile ? (
          <div className="w-full h-[45vh] mt-6 relative">
            <HeroExperience />
          </div>
        ) : (
          <figure className="xl:w-[55%] w-full flex items-center justify-center">
            <div className="hero-3d-layout">
              <HeroExperience />
            </div>
          </figure>
        )}
      </div>

      <AnimatedCounter />
    </section>
  );
};

export default Hero;

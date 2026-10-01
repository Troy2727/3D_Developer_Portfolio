import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useMediaQuery } from "react-responsive";

import AnimatedCounter from "../components/AnimatedCounter";
import Button from "../components/Button";
import { words } from "../constants";
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
              <h1 className="flex items-center flex-nowrap whitespace-nowrap mb-2">
                <span className="text-white font-bold mr-[0.3em]">Shaping</span>
                <div className="inline-block h-[1.5em] w-[210px] md:w-[calc(4.8em+48px)] relative overflow-hidden">
                  <span className="slide">
                    <span className="wrapper">
                      {words.map((word, index) => (
                        <span
                          key={index}
                          className="flex items-center gap-2"
                        >
                          <img
                            src={word.imgPath}
                            alt="person"
                            className="xl:size-10 md:size-8 size-6 p-1 rounded-full bg-white-50"
                          />
                          <span className={`word-gradient word-gradient-${(index % 4) + 1}`}>{word.text}</span>
                        </span>
                      ))}
                    </span>
                  </span>
                </div>
              </h1>
              <h1>
                <span className="text-white font-bold mr-[0.3em]">into</span>
                <span className="text-white font-bold mr-[0.3em]">Real</span>
                <span className="text-white font-bold mr-[0.3em]">Projects</span>
              </h1>
              <h1>
                <span className="text-white font-bold mr-[0.3em]">that</span>
                <span className="text-white font-bold mr-[0.3em]">Deliver</span>
                <span className="text-white font-bold mr-[0.3em]">Results</span>
              </h1>
            </div>

            <p className="text-white-50 text-sm md:text-lg relative z-10 pointer-events-none max-w-full md:max-w-[95%]">
              Hi, I'm Alex. As a certified graduate of MIT xPRO's Professional Certificate in Coding: Full Stack Development with MERN. I specialize in Python, JavaScript, TypeScript, React, and Three.js many more development.
            </p>

            <Button
              text="See My Work"
              className="md:w-80 md:h-16 w-full h-12 mt-2"
              id="counter"
            />
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

import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import AnimatedCounter from "../components/AnimatedCounter";
import Button from "../components/Button";
import { words } from "../constants";
import HeroExperience from "../components/models/hero_models/HeroExperience";

const Hero = () => {
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
        <header className="flex flex-col justify-center md:w-[45%] w-full md:px-10 px-5 xl:max-w-[45%]">
          <div className="flex flex-col gap-5 md:gap-7">
            <div className="hero-text">
              <h1 className="flex items-center flex-nowrap whitespace-nowrap mb-2">
                <span className="word-gradient word-gradient-1 mr-2">Shaping</span>
                <div className="inline-block h-[40px] md:h-[60px] w-[210px] md:w-[320px] relative overflow-hidden">
                  <span className="slide">
                    <span className="wrapper">
                      {words.map((word, index) => (
                        <span
                          key={index}
                          className="flex items-center gap-2 pb-2"
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
                <span className="word-gradient word-gradient-2">into</span>
                <span className="word-gradient word-gradient-3">Real</span>
                <span className="word-gradient word-gradient-4">Projects</span>
              </h1>
              <h1>
                <span className="word-gradient word-gradient-1">that</span>
                <span className="word-gradient word-gradient-2">Deliver</span>
                <span className="word-gradient word-gradient-3">Results</span>
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

        {/* RIGHT: 3D Model or Visual */}
        <figure className="md:w-[55%] hidden md:flex md:items-center md:justify-center">
          <div className="hero-3d-layout">
            <HeroExperience />
          </div>
        </figure>

        {/* Mobile 3D Experience - Improved version */}
        <div className="md:hidden w-full h-[40vh] mt-6 relative">
          <HeroExperience />
        </div>
      </div>

      <AnimatedCounter />
    </section>
  );
};

export default Hero;

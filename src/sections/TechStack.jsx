import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useState } from "react";

import TitleHeader from "../components/TitleHeader";
import { techStackImgs } from "../constants";

const TechStack = () => {
  // State to track which card is being touched
  const [touchedCardIndex, setTouchedCardIndex] = useState(null);

  // Handle touch start event
  const handleTouchStart = (index) => {
    setTouchedCardIndex(index);
  };

  // Handle touch end event with delay
  const handleTouchEnd = () => {
    // Add a delay before removing the touched state
    setTimeout(() => {
      setTouchedCardIndex(null);
    }, 500); // 500ms delay for more noticeable effect
  };

  // Animate the tech cards in the skills section
  useGSAP(() => {
    // This animation is triggered when the user scrolls to the #skills wrapper
    // The animation starts when the top of the wrapper is at the center of the screen
    // The animation is staggered, meaning each card will animate in sequence
    // The animation ease is set to "power2.inOut", which is a slow-in fast-out ease
    gsap.fromTo(
      ".tech-card",
      {
        // Initial values
        y: 50, // Move the cards down by 50px
        opacity: 0, // Set the opacity to 0
      },
      {
        // Final values
        y: 0, // Move the cards back to the top
        opacity: 1, // Set the opacity to 1
        duration: 1, // Duration of the animation
        ease: "power2.inOut", // Ease of the animation
        stagger: 0.2, // Stagger the animation by 0.2 seconds
        scrollTrigger: {
          trigger: "#skills", // Trigger the animation when the user scrolls to the #skills wrapper
          start: "top center", // Start the animation when the top of the wrapper is at the center of the screen
        },
      }
    );
  });

  return (
    <div id="skills" className="flex-center section-padding">
      <div className="w-full h-full md:px-10 px-5">
        <TitleHeader
          title="My Preferred Tech Stack"
          sub=""
        />
        <div className="mt-6 md:mt-10">
          {/* All tech stack icons in a single grid */}
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-8 max-w-[1000px] mx-auto">
            {techStackImgs.map((techStackIcon, index) => (
              <div
                key={index}
                className={`tech-card rounded-full mx-auto ${touchedCardIndex === index ? 'touched' : ''}`}
                onTouchStart={() => handleTouchStart(index)}
                onTouchEnd={() => handleTouchEnd(index)}
                onTouchCancel={() => handleTouchEnd(index)}
              >
                <div className="tech-card-animated-bg"></div>
                <div className="tech-card-content">
                  <img
                    src={techStackIcon.imgPath}
                    alt={techStackIcon.name}
                  />
                  <p className="line-clamp-2">{techStackIcon.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechStack;

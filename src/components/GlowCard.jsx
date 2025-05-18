import { useRef, useState } from "react";

const GlowCard = ({ card, index, children }) => {
  // refs for all the cards
  const cardRefs = useRef([]);
  // State to track if the card is being touched
  const [isTouched, setIsTouched] = useState(false);

  // when mouse moves over a card, rotate the glow effect
  const handleMouseMove = (index) => (e) => {
    // get the current card
    const card = cardRefs.current[index];
    if (!card) return;

    // get the mouse position relative to the card
    const rect = card.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - rect.width / 2;
    const mouseY = e.clientY - rect.top - rect.height / 2;

    // calculate the angle from the center of the card to the mouse
    let angle = Math.atan2(mouseY, mouseX) * (180 / Math.PI);

    // adjust the angle so that it's between 0 and 360
    angle = (angle + 360) % 360;

    // set the angle as a CSS variable
    card.style.setProperty("--start", angle + 60);
  };

  // Handle touch start event
  const handleTouchStart = (e) => {
    setIsTouched(true);

    // Get the current card
    const card = cardRefs.current[index];
    if (!card) return;

    // Get touch position relative to the card
    const rect = card.getBoundingClientRect();
    const touch = e.touches[0];
    const touchX = touch.clientX - rect.left - rect.width / 2;
    const touchY = touch.clientY - rect.top - rect.height / 2;

    // Calculate angle from center of card to touch point
    let angle = Math.atan2(touchY, touchX) * (180 / Math.PI);
    angle = (angle + 360) % 360;

    // Set the angle as CSS variable
    card.style.setProperty("--start", angle + 60);
  };

  // Handle touch move event
  const handleTouchMove = (e) => {
    if (!isTouched) return;

    // Get the current card
    const card = cardRefs.current[index];
    if (!card) return;

    // Get touch position relative to the card
    const rect = card.getBoundingClientRect();
    const touch = e.touches[0];
    const touchX = touch.clientX - rect.left - rect.width / 2;
    const touchY = touch.clientY - rect.top - rect.height / 2;

    // Calculate angle from center of card to touch point
    let angle = Math.atan2(touchY, touchX) * (180 / Math.PI);
    angle = (angle + 360) % 360;

    // Set the angle as CSS variable
    card.style.setProperty("--start", angle + 60);
  };

  // Handle touch end event
  const handleTouchEnd = () => {
    // Add a small delay before removing the touched state
    setTimeout(() => {
      setIsTouched(false);
    }, 300);
  };

  // return the card component with mouse and touch events
  return (
    <div
      ref={(el) => (cardRefs.current[index] = el)}
      onMouseMove={handleMouseMove(index)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      className={`card card-border timeline-card rounded-xl p-10 mb-5 h-full flex flex-col ${isTouched ? 'touched' : ''}`}
    >
      <div className="glow"></div>
      <div className="flex items-center gap-1 mb-5">
        {Array.from({ length: 5 }, (_, i) => (
          <img key={i} src="/images/star.png" alt="star" className="size-5" />
        ))}
      </div>
      <div className="mb-5 flex-grow">
        <p className="text-white-50 text-lg">{card.review}</p>
      </div>
      <div className="mt-auto">
        {children}
      </div>
    </div>
  );
};

export default GlowCard;

import { useState, useEffect } from "react";
import { navLinks } from "../constants";

const NavBar = () => {
  // track if the user has scrolled down the page
  const [scrolled, setScrolled] = useState(false);
  // track if the mobile menu is open
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // create an event listener for when the user scrolls
    const handleScroll = () => {
      // check if the user has scrolled down at least 10px
      // if so, set the state to true
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    // add the event listener to the window
    window.addEventListener("scroll", handleScroll);

    // cleanup the event listener when the component is unmounted
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when clicking a link
  const handleMobileNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className={`navbar ${scrolled ? "scrolled" : "not-scrolled"}`}>
      <div className="inner max-w-7xl mx-auto">
        <a href="#hero" className="logo">
          Alex JSMaestro
        </a>

        {/* Desktop Navigation */}
        <nav className="desktop">
          <ul>
            {navLinks.map(({ link, name }) => (
              <li key={name} className="group">
                <a href={link}>
                  <span>{name}</span>
                  <span className="underline" />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden flex flex-col justify-center items-center gap-1.5 z-50 p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          <span className={`block w-7 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-7 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
          <span className={`block w-7 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>

        {/* Mobile Navigation */}
        <div className={`fixed top-0 left-0 w-full h-full bg-black z-50 lg:hidden transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`} style={{ minHeight: '100vh' }}>
          <div className="flex justify-between items-center p-6">
            <a href="#hero" className="text-white text-2xl font-bold">Alex JSMaestro</a>
            <button
              className="text-white p-2"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <nav className="h-full flex flex-col justify-center items-center">
            <ul className="flex flex-col items-center gap-8 w-full px-8 max-w-md mx-auto">
              {navLinks.map(({ link, name }) => (
                <li key={name} className="w-full mb-2">
                  <a
                    href={link}
                    onClick={handleMobileNavClick}
                    className="text-3xl font-bold text-white block py-4 text-center"
                  >
                    {name}
                  </a>
                </li>
              ))}
              <li className="mt-10 w-full">
                <a
                  href="#contact"
                  onClick={handleMobileNavClick}
                  className="block w-full text-center px-6 py-5 bg-white text-black rounded-lg font-bold text-xl"
                >
                  Contact me
                </a>
              </li>
            </ul>
          </nav>
        </div>

        {/* Contact Button (Desktop) */}
        <a href="#contact" className="contact-btn group hidden lg:flex">
          <div className="inner">
            <span>Contact me</span>
          </div>
        </a>
      </div>
    </header>
  );
}

export default NavBar;

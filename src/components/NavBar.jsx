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
      <div className="inner">
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
          className="lg:hidden flex flex-col justify-center items-center gap-1.5 z-50"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
          <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>

        {/* Mobile Navigation */}
        <div className={`fixed inset-0 bg-black z-40 lg:hidden transition-all duration-300 ${mobileMenuOpen ? 'opacity-95 visible' : 'opacity-0 invisible'}`}>
          <nav className="h-full flex flex-col justify-center items-center">
            <ul className="flex flex-col items-center gap-8">
              {navLinks.map(({ link, name }) => (
                <li key={name} className="text-2xl font-semibold">
                  <a
                    href={link}
                    onClick={handleMobileNavClick}
                    className="text-white-50 hover:text-white transition-colors"
                  >
                    {name}
                  </a>
                </li>
              ))}
              <li className="mt-6">
                <a
                  href="#contact"
                  onClick={handleMobileNavClick}
                  className="px-6 py-3 bg-white text-black rounded-lg hover:bg-black-50 hover:text-white transition-colors"
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

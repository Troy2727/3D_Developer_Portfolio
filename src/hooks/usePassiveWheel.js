import { useEffect } from 'react';

// This hook adds a passive wheel event listener to the document
// to prevent the "Added non-passive event listener to a scroll-blocking 'wheel' event" warning
export function usePassiveWheel() {
  useEffect(() => {
    // Add a passive wheel event listener to the document
    const preventDefault = () => {
      // Do nothing, just a passive listener
    };

    document.addEventListener('wheel', preventDefault, { passive: true });

    // Clean up
    return () => {
      document.removeEventListener('wheel', preventDefault);
    };
  }, []);
}

export default usePassiveWheel;

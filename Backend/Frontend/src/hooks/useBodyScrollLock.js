import { useEffect } from 'react';

function useBodyScrollLock(isLocked) {
  useEffect(() => {
    if (isLocked) {
      // Save current scroll position
      const scrollY = window.scrollY;
      
      // Lock the body scroll
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      
      return () => {
        // Restore scroll position when unlocking
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isLocked]);
}

export default useBodyScrollLock;

import { useLocation } from '@solidjs/router';

export function useScrollToAnchor() {
  const location = useLocation();
  let isFirstTime = true;
  const scrollToAnchor = () => {
    if (!isFirstTime) return;
    const anchorId = location.hash.slice(1);
    if (anchorId) {
      const element = document.getElementById(anchorId);
      if (element) {
        isFirstTime = false;
        element.scrollIntoView({ behavior: 'smooth' });

        element.classList.add('animate-border');

        setTimeout(() => {
          element.classList.remove('animate-border');
        }, 4000);
      }
    } else {
      isFirstTime = false;
    }
  };

  return { scrollToAnchor };
}

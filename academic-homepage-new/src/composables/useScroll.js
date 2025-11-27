export function useScroll(sections) {
  let scrollHandler = null;
  
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const initScrollListener = () => {
    scrollHandler = () => {
      const scrollTop = document.querySelector('.content').scrollTop;
      sections.forEach(section => {
        const el = document.getElementById(section.id);
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const navItem = document.querySelector(`.navigation li[data-section="${section.id}"]`);
        if (navItem) {
          if (rect.top <= 50 && rect.bottom >= 50) {
            navItem.classList.add('active');
          } else {
            navItem.classList.remove('active');
          }
        }
      });
    };
    
    document.querySelector('.content').addEventListener('scroll', scrollHandler);
    
    document.querySelectorAll('.navigation li').forEach((li, index) => {
      li.setAttribute('data-section', sections[index].id);
    });
  };
  
  const cleanupScrollListener = () => {
    if (scrollHandler) {
      document.querySelector('.content').removeEventListener('scroll', scrollHandler);
    }
  };
  
  return {
    scrollToSection,
    initScrollListener,
    cleanupScrollListener
  };
}
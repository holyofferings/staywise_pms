  <a 
    href="#hero" 
    onClick={(e) => {
      e.preventDefault();
      // Dispatch custom event for scrolling to top
      window.dispatchEvent(new Event('scrollToTop'));
      window.history.pushState(null, '', '#hero');
    }}
    className="underline-offset-4 hover:underline"
  >
    Home
  </a>

  <a 
    href="#about" 
    onClick={(e) => {
      e.preventDefault();
      // Dispatch custom event for scrolling to section
      window.dispatchEvent(new CustomEvent('scrollToSection', {
        detail: { sectionId: 'about' }
      }));
      window.history.pushState(null, '', '#about');
    }}
    className="underline-offset-4 hover:underline"
  >
    About
  </a>

  <a 
    href="#services" 
    onClick={(e) => {
      e.preventDefault();
      // Dispatch custom event for scrolling to section
      window.dispatchEvent(new CustomEvent('scrollToSection', {
        detail: { sectionId: 'services' }
      }));
      window.history.pushState(null, '', '#services');
    }}
    className="underline-offset-4 hover:underline"
  >
    Services
  </a>

  <a 
    href="#pricing" 
    onClick={(e) => {
      e.preventDefault();
      // Dispatch custom event for scrolling to section
      window.dispatchEvent(new CustomEvent('scrollToSection', {
        detail: { sectionId: 'pricing' }
      }));
      window.history.pushState(null, '', '#pricing');
    }}
    className="underline-offset-4 hover:underline"
  >
    Pricing
  </a>

  <a 
    href="#contact" 
    onClick={(e) => {
      e.preventDefault();
      // Dispatch custom event for scrolling to section
      window.dispatchEvent(new CustomEvent('scrollToSection', {
        detail: { sectionId: 'contact' }
      }));
      window.history.pushState(null, '', '#contact');
    }}
    className="underline-offset-4 hover:underline"
  >
    Contact
  </a> 
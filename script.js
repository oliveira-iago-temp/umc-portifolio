const revealItems = document.querySelectorAll(".reveal");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const navAnchorLinks = document.querySelectorAll(".nav-links a");

// Fallback para navegadores sem IntersectionObserver.
const showImmediately = () => {
  revealItems.forEach((item) => item.classList.add("is-visible"));
};

if (!("IntersectionObserver" in window)) {
  showImmediately();
} else {
  // Revela elementos uma vez quando entram na viewport.
  const observer = new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      }
    },
    {
      root: null,
      threshold: 0.12,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  revealItems.forEach((item) => observer.observe(item));
}

if (navToggle && navLinks) {
  // Controla abertura/fechamento do menu mobile.
  const setMenuState = (open) => {
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    navLinks.classList.toggle("is-open", open);
  };

  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    setMenuState(!isOpen);
  });

  navAnchorLinks.forEach((link) => {
    // Fecha o menu ao navegar para uma âncora.
    link.addEventListener("click", () => setMenuState(false));
  });

  window.addEventListener("resize", () => {
    // Garante estado fechado ao voltar para layout desktop.
    if (window.innerWidth > 720) {
      setMenuState(false);
    }
  });
}

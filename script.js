const revealItems = document.querySelectorAll(".reveal");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const navAnchorLinks = document.querySelectorAll(".nav-links a");
const experienceCards = document.querySelectorAll(".xp-card");
const experienceInnerAccordions = document.querySelectorAll(
  ".xp-desc-card, .xp-tech-card"
);

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

if (experienceInnerAccordions.length > 0) {
  const mobileQuery = window.matchMedia("(max-width: 720px)");

  // Salva o estado padrão definido no HTML para restaurar no mobile.
  experienceInnerAccordions.forEach((item) => {
    item.dataset.defaultOpen = item.hasAttribute("open") ? "true" : "false";
  });

  const syncExperienceAccordions = () => {
    const isMobile = mobileQuery.matches;

    experienceInnerAccordions.forEach((item) => {
      if (!isMobile) {
        item.setAttribute("open", "");
        return;
      }

      if (item.dataset.defaultOpen === "true") {
        item.setAttribute("open", "");
      } else {
        item.removeAttribute("open");
      }
    });
  };

  syncExperienceAccordions();

  if (typeof mobileQuery.addEventListener === "function") {
    mobileQuery.addEventListener("change", syncExperienceAccordions);
  } else {
    mobileQuery.addListener(syncExperienceAccordions);
  }
}

if (experienceCards.length > 0) {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const getCardBody = (card) => card.querySelector(".xp-body");

  const setBodyBaseStyle = (body) => {
    if (!body) return;
    body.style.overflow = "hidden";
  };

  const openCard = (card) => {
    const body = getCardBody(card);
    if (!body) {
      card.setAttribute("open", "");
      return;
    }

    if (prefersReducedMotion) {
      card.setAttribute("open", "");
      body.style.height = "auto";
      return;
    }

    if (card.dataset.animating === "true") return;
    card.dataset.animating = "true";

    card.setAttribute("open", "");
    setBodyBaseStyle(body);
    body.style.transition = "none";
    body.style.height = "0px";
    body.getBoundingClientRect();

    const targetHeight = `${body.scrollHeight}px`;
    body.style.transition = "height 240ms ease";
    body.style.height = targetHeight;

    const onEnd = () => {
      body.style.transition = "";
      body.style.height = "auto";
      card.dataset.animating = "false";
      body.removeEventListener("transitionend", onEnd);
    };

    body.addEventListener("transitionend", onEnd);
  };

  const closeCard = (card) => {
    if (!card.hasAttribute("open")) return;
    const body = getCardBody(card);
    if (!body) {
      card.removeAttribute("open");
      return;
    }

    if (prefersReducedMotion) {
      card.removeAttribute("open");
      body.style.height = "";
      return;
    }

    if (card.dataset.animating === "true") return;
    card.dataset.animating = "true";

    setBodyBaseStyle(body);
    const startHeight = `${body.scrollHeight}px`;
    body.style.transition = "none";
    body.style.height = startHeight;
    body.getBoundingClientRect();

    body.style.transition = "height 220ms ease";
    body.style.height = "0px";

    const onEnd = () => {
      card.removeAttribute("open");
      body.style.transition = "";
      body.style.height = "";
      card.dataset.animating = "false";
      body.removeEventListener("transitionend", onEnd);
    };

    body.addEventListener("transitionend", onEnd);
  };

  experienceCards.forEach((card) => {
    const summary = card.querySelector(":scope > .xp-summary");
    const body = getCardBody(card);
    setBodyBaseStyle(body);

    if (body) {
      if (card.hasAttribute("open")) {
        body.style.height = "auto";
      } else {
        body.style.height = "0px";
      }
    }

    if (!summary) return;

    summary.addEventListener("click", (event) => {
      event.preventDefault();

      if (card.hasAttribute("open")) {
        closeCard(card);
        return;
      }

      experienceCards.forEach((otherCard) => {
        if (otherCard === card) return;
        closeCard(otherCard);
      });

      openCard(card);
    });
  });
}

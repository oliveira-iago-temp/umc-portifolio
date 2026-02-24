const revealItems = document.querySelectorAll(".reveal");

const showImmediately = () => {
  revealItems.forEach((item) => item.classList.add("is-visible"));
};

if (!("IntersectionObserver" in window)) {
  showImmediately();
} else {
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

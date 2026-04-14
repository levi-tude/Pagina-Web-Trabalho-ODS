const navToggle = document.getElementById("nav-toggle");
const siteNav = document.getElementById("site-nav");
const navLinks = document.querySelectorAll('.site-nav a[href^="#"]');
const toTopButton = document.getElementById("to-top");
const revealItems = document.querySelectorAll(".reveal");
const energyTabs = Array.from(document.querySelectorAll(".energy-tab"));
const energyPanels = Array.from(document.querySelectorAll(".energy-panel"));
const contactForm = document.getElementById("contact-form");
const formFeedback = document.getElementById("form-feedback");

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    siteNav.classList.toggle("open");
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    const target = targetId ? document.querySelector(targetId) : null;
    if (!target) return;

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });

    if (siteNav && siteNav.classList.contains("open")) {
      siteNav.classList.remove("open");
      navToggle?.setAttribute("aria-expanded", "false");
    }
  });
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 760 && siteNav?.classList.contains("open")) {
    siteNav.classList.remove("open");
    navToggle?.setAttribute("aria-expanded", "false");
  }
});

window.addEventListener("scroll", () => {
  if (!toTopButton) return;
  if (window.scrollY > 350) {
    toTopButton.classList.add("visible");
  } else {
    toTopButton.classList.remove("visible");
  }
});

toTopButton?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.12 }
);

revealItems.forEach((item) => observer.observe(item));

const setActiveEnergy = (target) => {
  energyTabs.forEach((tab) => {
    const isActive = tab.dataset.energyTarget === target;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
    tab.tabIndex = isActive ? 0 : -1;
  });

  energyPanels.forEach((panel) => {
    const isActive = panel.dataset.energyPanel === target;
    panel.classList.toggle("is-active", isActive);
    panel.hidden = !isActive;
  });
};

if (energyTabs.length && energyPanels.length) {
  const initialActiveTab = energyTabs.find((tab) => tab.classList.contains("is-active")) ?? energyTabs[0];
  if (initialActiveTab?.dataset.energyTarget) {
    setActiveEnergy(initialActiveTab.dataset.energyTarget);
  }

  energyTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.energyTarget;
      if (!target) return;
      setActiveEnergy(target);
    });

    tab.addEventListener("keydown", (event) => {
      const tabCount = energyTabs.length;
      if (!tabCount) return;

      let nextIndex = index;
      if (event.key === "ArrowRight") nextIndex = (index + 1) % tabCount;
      if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabCount) % tabCount;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = tabCount - 1;
      if (nextIndex === index) return;

      event.preventDefault();
      energyTabs[nextIndex].focus();
      const target = energyTabs[nextIndex].dataset.energyTarget;
      if (!target) return;
      setActiveEnergy(target);
    });
  });
}

if (contactForm && formFeedback) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    formFeedback.textContent = "Mensagem enviada com sucesso! Obrigado pela participacao.";
    contactForm.reset();
  });
}

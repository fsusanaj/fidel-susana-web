(function () {
  "use strict";

  const doc = document;
  const body = doc.body;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const header = doc.getElementById("header");
  const progressBar = doc.getElementById("scrollProgress");
  const menuToggle = doc.getElementById("menuToggle");
  const nav = doc.getElementById("nav");
  const year = doc.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  /* ---------- Scroll state ---------- */
  let ticking = false;

  function updateScrollUI() {
    const scrollY = window.scrollY || window.pageYOffset;
    const maxScroll = doc.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? Math.min(scrollY / maxScroll, 1) : 0;

    if (header) {
      header.classList.toggle("is-scrolled", scrollY > 12);
    }

    if (progressBar) {
      progressBar.style.transform = "scaleX(" + progress + ")";
    }

    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollUI);
      ticking = true;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  updateScrollUI();

  /* ---------- Mobile menu ---------- */
  function closeMenu() {
    body.classList.remove("menu-open");
    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Abrir menú");
    }
  }

  function openMenu() {
    body.classList.add("menu-open");
    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "true");
      menuToggle.setAttribute("aria-label", "Cerrar menú");
    }
  }

  if (menuToggle) {
    menuToggle.addEventListener("click", function () {
      if (body.classList.contains("menu-open")) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  if (nav) {
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
  }

  doc.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 900) {
      closeMenu();
    }
  });

  /* ---------- Reveal on scroll ---------- */
  const revealEls = Array.from(doc.querySelectorAll(".reveal"));

  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------- Animated counters ---------- */
  const counters = Array.from(doc.querySelectorAll(".counter"));

  function animateCounter(el) {
    const target = parseInt(el.dataset.target || "0", 10);
    const duration = prefersReducedMotion ? 0 : 1600;
    const start = performance.now();

    function frame(now) {
      const elapsed = now - start;
      const progress = duration === 0 ? 1 : Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased).toString();

      if (progress < 1) {
        window.requestAnimationFrame(frame);
      }
    }

    window.requestAnimationFrame(frame);
  }

  if (counters.length && "IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );

    counters.forEach(function (counter) {
      counterObserver.observe(counter);
    });
  } else {
    counters.forEach(function (counter) {
      counter.textContent = counter.dataset.target || "0";
    });
  }

  /* ---------- Card spotlight ---------- */
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    doc.querySelectorAll(".service-card").forEach(function (card) {
      card.addEventListener("pointermove", function (event) {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--mx", event.clientX - rect.left + "px");
        card.style.setProperty("--my", event.clientY - rect.top + "px");
      });
    });

    doc.querySelectorAll(".scene").forEach(function (scene) {
      const card = scene.querySelector(".dash-card");
      const phone = scene.querySelector(".phone");
      if (!card) return;

      scene.addEventListener("pointermove", function (event) {
        const rect = scene.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;

        card.style.animation = "none";
        card.style.transform =
          "rotateY(" + (-6 + x * 4) + "deg) rotateX(" + (2 - y * 4) + "deg) translateY(" + y * -6 + "px)";

        if (phone && !prefersReducedMotion) {
          phone.style.transform = "rotate(" + (-7 + x * 3) + "deg) translateY(" + y * 8 + "px)";
        }
      });

      scene.addEventListener("pointerleave", function () {
        card.style.animation = "";
        card.style.transform = "";
        if (phone) {
          phone.style.transform = "";
        }
      });
    });
  }

  /* ---------- FAQ accordion ---------- */
  const faqItems = Array.from(doc.querySelectorAll(".faq-item"));

  faqItems.forEach(function (item) {
    const button = item.querySelector(".faq-question");
    if (!button) return;

    button.addEventListener("click", function () {
      const isOpen = item.classList.contains("is-open");

      faqItems.forEach(function (other) {
        other.classList.remove("is-open");
        const otherButton = other.querySelector(".faq-question");
        if (otherButton) {
          otherButton.setAttribute("aria-expanded", "false");
        }
      });

      if (!isOpen) {
        item.classList.add("is-open");
        button.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ---------- Scroll spy ---------- */
  const navLinks = Array.from(doc.querySelectorAll('.nav > a[href^="#"]:not(.nav-cta)'));
  const spySections = navLinks
    .map(function (link) {
      return doc.querySelector(link.getAttribute("href"));
    })
    .filter(Boolean);

  if (spySections.length && "IntersectionObserver" in window) {
    const spyObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          navLinks.forEach(function (link) {
            const active = link.getAttribute("href") === "#" + entry.target.id;
            link.classList.toggle("is-active", active);
            if (active) {
              link.setAttribute("aria-current", "true");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    spySections.forEach(function (section) {
      spyObserver.observe(section);
    });
  }

  /* ---------- Contact form ---------- */
  const form = doc.getElementById("contactForm");
  const status = doc.getElementById("formStatus");
  const toast = doc.getElementById("toast");
  let toastTimer;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 5000);
  }

  function setFieldState(field, valid) {
    if (!field) return;
    field.classList.toggle("is-invalid", !valid);
    const input = field.querySelector("input, textarea, select");
    if (input) {
      input.setAttribute("aria-invalid", valid ? "false" : "true");
    }
  }

  if (form) {
    const nameField = form.querySelector("#name");
    const emailField = form.querySelector("#email");
    const messageField = form.querySelector("#message");

    [nameField, emailField, messageField].forEach(function (input) {
      if (!input) return;
      input.addEventListener("input", function () {
        const wrapper = input.closest(".field");
        if (wrapper && wrapper.classList.contains("is-invalid")) {
          setFieldState(wrapper, true);
        }
      });
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      const name = nameField ? nameField.value.trim() : "";
      const email = emailField ? emailField.value.trim() : "";
      const message = messageField ? messageField.value.trim() : "";
      const company = (form.querySelector("#company") || {}).value || "";
      const service = (form.querySelector("#service") || {}).value || "";

      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
      const nameValid = name.length >= 2;
      const messageValid = message.length >= 10;

      setFieldState(nameField ? nameField.closest(".field") : null, nameValid);
      setFieldState(emailField ? emailField.closest(".field") : null, emailValid);
      setFieldState(messageField ? messageField.closest(".field") : null, messageValid);

      if (!nameValid) {
        if (nameField) nameField.focus();
        if (status) {
          status.className = "form-status is-error";
          status.textContent = "Revisa tu nombre para continuar.";
        }
        return;
      }

      if (!emailValid) {
        if (emailField) emailField.focus();
        if (status) {
          status.className = "form-status is-error";
          status.textContent = "Revisa tu email para continuar.";
        }
        return;
      }

      if (!messageValid) {
        if (messageField) messageField.focus();
        if (status) {
          status.className = "form-status is-error";
          status.textContent = "Cuéntame un poco más sobre tu proyecto (mínimo 10 caracteres).";
        }
        return;
      }

      const subject = "Nuevo proyecto" + (service ? ": " + service : "") + " — " + name;
      const bodyLines = [
        "Hola Fidel, te escribo desde tu web.",
        "",
        "*" + subject + "*",
        "",
        message,
        "",
        "—",
        "Nombre: " + name,
        "Email: " + email,
      ];

      if (company.trim()) {
        bodyLines.push("Empresa: " + company.trim());
      }
      if (service) {
        bodyLines.push("Servicio de interés: " + service);
      }

      const whatsapp =
        "https://wa.me/527778930598?text=" +
        encodeURIComponent(bodyLines.join("\n"));

      if (status) {
        status.className = "form-status is-success";
        status.textContent =
          "Mensaje preparado. Se abrirá WhatsApp para enviarlo; si no ocurre, escríbeme al +52 777 893 0598.";
      }

      showToast("Abriendo WhatsApp…");
      window.open(whatsapp, "_blank", "noopener");

      window.setTimeout(function () {
        form.reset();
      }, 600);
    });
  }
})();

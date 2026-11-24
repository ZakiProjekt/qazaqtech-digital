/* ==========================================================================
   QazaqTech Digital — Интерактивті JavaScript сценарийлері (ES6+)
   БӨЖ 4: Веб-технологиялар (HTML5, CSS3, JavaScript)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initStickyHeader();
  initMobileMenu();
  initBackToTop();
  initThemeToggle();
  initStatsCounter();
  initServiceFilter();
  initCostCalculator();
  initFaqAccordion();
  initContactForm();
});

/* 1. Жоғарғы панельге (Header) айналдыру кезінде көлеңке қосу */
function initStickyHeader() {
  const header = document.getElementById("siteHeader");
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 20);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* 2. Интерактивті мобильді мәзір (Hamburger Menu) */
function initMobileMenu() {
  const toggleBtn = document.getElementById("menuToggle");
  const nav = document.getElementById("mainNav");
  if (!toggleBtn || !nav) return;

  toggleBtn.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggleBtn.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggleBtn.setAttribute("aria-expanded", "false");
    });
  });
}

/* 3. «Басына оралу» түймесі (Back to Top) */
function initBackToTop() {
  const btn = document.getElementById("backToTop");
  if (!btn) return;

  window.addEventListener("scroll", () => {
    btn.classList.toggle("visible", window.scrollY > 260);
  }, { passive: true });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* 4. Жарық / Күңгірт тақырыпты ауыстыру (localStorage сақтаумен) */
function initThemeToggle() {
  const btn = document.getElementById("themeToggle");
  if (!btn) return;

  const savedTheme = localStorage.getItem("qt-theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
    btn.textContent = "☀";
  }

  btn.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark-theme");
    btn.textContent = isDark ? "☀" : "☾";
    localStorage.setItem("qt-theme", isDark ? "dark" : "light");
  });
}

/* 5. Статистика санағышы (Animated Counters) */
function initStatsCounter() {
  const counters = document.querySelectorAll("[data-counter]");
  if (!counters.length) return;

  const animate = (el) => {
    const target = Number(el.dataset.counter);
    const suffix = el.dataset.suffix || "";
    const duration = 900;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const value = Math.floor(progress * target);
      el.textContent = value + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target + suffix;
      }
    };
    requestAnimationFrame(step);
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });
    counters.forEach((c) => observer.observe(c));
  } else {
    counters.forEach(animate);
  }
}

/* 6. Қызметтерді санат бойынша сүзгілеу (services.html) */
function initServiceFilter() {
  const buttons = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".service-card");
  if (!buttons.length || !cards.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const category = btn.dataset.filter;
      cards.forEach((card) => {
        const match = category === "all" || card.dataset.category === category;
        card.classList.toggle("hidden", !match);
      });
    });
  });
}

/* 7. Жоба құнын есептеу интерактивті калькуляторы (services.html) */
function initCostCalculator() {
  const typeEl = document.getElementById("projectType");
  const pagesEl = document.getElementById("pageCount");
  const pagesOut = document.getElementById("pageCountValue");
  const seoEl = document.getElementById("optSeo");
  const multiLangEl = document.getElementById("optLang");
  const supportEl = document.getElementById("optSupport");
  const totalPriceEl = document.getElementById("calcTotalPrice");
  const timelineEl = document.getElementById("calcTimeline");

  if (!typeEl || !pagesEl || !totalPriceEl) return;

  const basePrices = {
    landing: 180000,
    corporate: 350000,
    shop: 620000,
    portal: 850000
  };

  const baseDays = {
    landing: 7,
    corporate: 14,
    shop: 24,
    portal: 35
  };

  const calculate = () => {
    const type = typeEl.value;
    const pages = Math.max(1, Math.min(20, Number(pagesEl.value) || 1));
    if (pagesOut) pagesOut.textContent = `${pages} бет`;

    let total = basePrices[type] + Math.max(0, pages - 1) * 28000;
    let days = baseDays[type] + Math.floor(pages / 2);

    if (seoEl && seoEl.checked) {
      total += 65000;
      days += 3;
    }
    if (multiLangEl && multiLangEl.checked) {
      total += 80000;
      days += 4;
    }
    if (supportEl && supportEl.checked) {
      total += 55000;
    }

    totalPriceEl.textContent = total.toLocaleString("ru-RU") + " ₸";
    if (timelineEl) {
      timelineEl.textContent = `Болжамды орындау мерзімі: ${days} жұмыс күні`;
    }
  };

  [typeEl, pagesEl, seoEl, multiLangEl, supportEl].forEach((el) => {
    if (el) el.addEventListener("input", calculate);
    if (el) el.addEventListener("change", calculate);
  });

  calculate();
}

/* 8. FAQ Аккордеоны (services.html) */
function initFaqAccordion() {
  const items = document.querySelectorAll(".faq-item");
  if (!items.length) return;

  items.forEach((item) => {
    const btn = item.querySelector(".faq-question");
    if (!btn) return;
    btn.addEventListener("click", () => {
      const isOpen = item.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(isOpen));
      const icon = btn.querySelector(".faq-icon");
      if (icon) icon.textContent = isOpen ? "−" : "+";
    });
  });
}

/* 9. Кері байланыс формасын валидациялау (contact.html) */
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const nameInput = document.getElementById("fullName");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const messageInput = document.getElementById("message");
  const statusBox = document.getElementById("formStatus");

  const setError = (input, msg) => {
    const errEl = document.getElementById(input.id + "Error");
    if (errEl) errEl.textContent = msg;
    input.classList.toggle("invalid", Boolean(msg));
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    let valid = true;

    const nameVal = nameInput.value.trim();
    if (nameVal.length < 3) {
      setError(nameInput, "Аты-жөніңіз кемінде 3 таңбадан тұруы тиіс.");
      valid = false;
    } else {
      setError(nameInput, "");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(emailInput.value.trim())) {
      setError(emailInput, "Жарамды электрондық пошта мекенжайын енгізіңіз.");
      valid = false;
    } else {
      setError(emailInput, "");
    }

    const phoneDigits = phoneInput.value.replace(/\D/g, "");
    if (phoneDigits.length < 10) {
      setError(phoneInput, "Телефон нөмірі кемінде 10 цифрдан тұруы тиіс.");
      valid = false;
    } else {
      setError(phoneInput, "");
    }

    if (messageInput.value.trim().length < 10) {
      setError(messageInput, "Хабарлама мәтіні кемінде 10 таңба болуы керек.");
      valid = false;
    } else {
      setError(messageInput, "");
    }

    if (valid && statusBox) {
      statusBox.className = "form-status success";
      statusBox.textContent = `Рақмет, ${nameVal}! Өтініміңіз сәтті қабылданды. Менеджер 30 минут ішінде хабарласады.`;
      form.reset();
    }
  });
}

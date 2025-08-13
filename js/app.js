/*
  File: js/app.js
  Purpose: Load resume JSON and inject dynamically into DOM with beautiful animations
*/

const DATA_URL = "http://localhost:5000/api/db";
const FALLBACK_URL = "data/resume.json";

const $ = (sel) => document.querySelector(sel);
const el = (tag, props = {}) =>
  Object.assign(document.createElement(tag), props);

// Theme management
function initTheme() {
  const savedTheme = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);
  updateThemeButton(savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "light" ? "dark" : "light";

  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  updateThemeButton(newTheme);

  // Add theme switch animation
  addThemeSwitchEffect();
}

function updateThemeButton(theme) {
  const button = $("#themeToggle");
  const icon = button.querySelector(".theme-icon");

  if (theme === "light") {
    icon.textContent = "🌙";
    icon.title = "Switch to Dark Mode";
  } else {
    icon.textContent = "☀️";
    icon.title = "Switch to Light Mode";
  }
}

// Add particle effect for theme switch
function addThemeSwitchEffect() {
  const particles = [];
  const colors = ["#4f8cff", "#ff6b6b", "#51cf66", "#ffd43b"];

  for (let i = 0; i < 20; i++) {
    const particle = el("div", {
      className: "theme-particle",
      style: `
        position: fixed;
        width: 4px;
        height: 4px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        animation: particleExplode 1s ease-out forwards;
      `,
    });

    document.body.appendChild(particle);

    // Random direction
    const angle = (Math.PI * 2 * i) / 20;
    const velocity = 100 + Math.random() * 100;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity;

    particle.style.setProperty("--vx", vx + "px");
    particle.style.setProperty("--vy", vy + "px");

    setTimeout(() => {
      document.body.removeChild(particle);
    }, 1000);
  }
}

// Add loading animation
function showLoading() {
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => card.classList.add("loading"));
}

function hideLoading() {
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => card.classList.remove("loading"));
}

async function loadData() {
  try {
    showLoading();
    // Try Flask API first
    const res = await fetch(DATA_URL, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    // Simulate loading time for better UX
    await new Promise((resolve) => setTimeout(resolve, 800));
    return data;
  } catch (err) {
    console.error("Error loading data from API:", err);
    console.log("Trying fallback to local JSON file...");

    // Fallback to local JSON file if API is not available
    try {
      const fallbackRes = await fetch(FALLBACK_URL, {
        headers: { Accept: "application/json" },
      });
      if (!fallbackRes.ok) throw new Error("HTTP " + fallbackRes.status);
      const fallbackData = await fallbackRes.json();
      console.log("✅ Using fallback data from local JSON file");
      return fallbackData;
    } catch (fallbackErr) {
      console.error("Error loading fallback data:", fallbackErr);
      showGlobalError(
        "Error loading data. Please check if the Flask API is running or the JSON file exists."
      );
      return null;
    }
  } finally {
    hideLoading();
  }
}

function showGlobalError(message) {
  const header = document.querySelector(".site-header");
  const banner = el("div", { textContent: message });
  banner.style.cssText =
    "margin-top:8px;padding:10px;border-radius:10px;border:1px solid #eab308;background:#fde68a;color:#111;";
  header.appendChild(banner);
}

function fillPersonal(personal) {
  if (!personal) return;

  // Animate name appearance with bounce effect
  const nameEl = $("#fullName");
  nameEl.style.opacity = "0";
  nameEl.style.transform = "translateY(20px) scale(0.8)";
  nameEl.textContent = personal.fullName || "—";

  setTimeout(() => {
    nameEl.style.transition = "all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)";
    nameEl.style.opacity = "1";
    nameEl.style.transform = "translateY(0) scale(1)";
  }, 100);

  $("#title").textContent = personal.title || "—";
  $("#summary").textContent = personal.summary || "";

  if (personal.avatar) {
    const avatar = $("#avatar");
    avatar.style.opacity = "0";
    avatar.style.transform = "scale(0.8) rotate(-10deg)";
    avatar.src = personal.avatar;

    avatar.onload = () => {
      setTimeout(() => {
        avatar.style.transition =
          "all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)";
        avatar.style.opacity = "1";
        avatar.style.transform = "scale(1) rotate(0deg)";
      }, 200);
    };
  }

  const contacts = $("#contacts");
  contacts.innerHTML = "";
  (personal.contacts || []).forEach((c, index) => {
    const row = el("div", { className: "contact-row" });
    row.style.opacity = "0";
    row.style.transform = "translateX(-20px) scale(0.9)";

    const label = el("small", { textContent: (c.label || "") + ":" });
    if (c.href) {
      const a = el("a", {
        href: c.href,
        textContent: c.value || c.href,
        target: "_blank",
        rel: "noopener noreferrer",
        style:
          "cursor: pointer; text-decoration: underline; color: var(--brand);",
      });

      // Add click event for debugging
      a.addEventListener("click", (e) => {
        console.log("Link clicked:", c.href);
        window.open(c.href, "_blank");
        e.preventDefault();
      });

      row.append(label, a);
    } else {
      const span = el("span", { textContent: c.value || "" });
      row.append(label, span);
    }
    contacts.append(row);

    // Stagger animation for contacts with bounce
    setTimeout(() => {
      row.style.transition = "all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)";
      row.style.opacity = "1";
      row.style.transform = "translateX(0) scale(1)";
    }, 300 + index * 100);
  });
}

function fillSkills(skills) {
  const box = $("#skillsList");
  box.innerHTML = "";
  (skills || []).forEach((s, index) => {
    const item = el("div", { className: "skill" });
    item.style.opacity = "0";
    item.style.transform = "translateY(20px) scale(0.8)";

    const title = el("p", {
      className: "skill-title",
      textContent: s.name || "",
    });
    const prog = el("div", { className: "progress" });
    const bar = el("span");
    prog.append(bar);
    item.append(title, prog);
    box.append(item);

    // Stagger animation for skills with enhanced timing
    setTimeout(() => {
      item.style.transition = "all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)";
      item.style.opacity = "1";
      item.style.transform = "translateY(0) scale(1)";

      // Animate progress bar with bounce effect
      requestAnimationFrame(() => {
        const level = Math.max(0, Math.min(100, Number(s.level || 0)));
        bar.style.transition =
          "width 1.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)";
        bar.style.width = `${level}%`;
      });
    }, 400 + index * 150);
  });
}

function fillTimeline(list, mountSelector) {
  const box = $(mountSelector);
  box.innerHTML = "";
  (list || []).forEach((item, index) => {
    const wrap = el("div", { className: "timeline-item" });
    wrap.style.opacity = "0";
    wrap.style.transform = "translateX(-30px) scale(0.95)";

    const top = el("div", { className: "timeline-top" });
    const title = el("p", {
      className: "timeline-title",
      textContent: item.institution || item.company || item.project || "",
    });
    const meta = el("small", {
      className: "timeline-meta",
      textContent: [
        item.degree || item.role || "",
        `${item.start || ""} - ${item.end || "Present"}`,
      ]
        .filter(Boolean)
        .join(" | "),
    });
    const desc = el("p", {
      className: "timeline-desc",
      textContent: item.description || "",
    });

    top.append(title, meta);
    wrap.append(top, desc);
    box.append(wrap);

    // Stagger animation for timeline items with enhanced effects
    setTimeout(() => {
      wrap.style.transition = "all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)";
      wrap.style.opacity = "1";
      wrap.style.transform = "translateX(0) scale(1)";
    }, 500 + index * 200);
  });
}

function fillCertificates(certs) {
  const section = $("#certificates");
  const list = $("#certificatesList");
  list.innerHTML = "";
  if (!certs || certs.length === 0) {
    section.hidden = true;
    return;
  }
  section.hidden = false;
  section.style.opacity = "0";
  section.style.transform = "translateY(20px) scale(0.9)";

  certs.forEach((c, index) => {
    const card = el("div", { className: "card-item" });
    card.style.opacity = "0";
    card.style.transform = "translateY(20px) scale(0.8)";

    const title = el("p", {
      className: "timeline-title",
      textContent: c.title || "",
    });
    const meta = el("small", {
      className: "timeline-meta",
      textContent: [c.issuer, c.date].filter(Boolean).join(" • "),
    });
    card.append(title, meta);
    if (c.link)
      card.append(
        el("a", {
          href: c.link,
          textContent: c.link,
          target: "_blank",
          rel: "noopener",
        })
      );
    list.append(card);

    // Stagger animation for certificates with bounce
    setTimeout(() => {
      card.style.transition = "all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)";
      card.style.opacity = "1";
      card.style.transform = "translateY(0) scale(1)";
    }, 600 + index * 150);
  });

  // Animate section appearance with enhanced timing
  setTimeout(() => {
    section.style.transition = "all 1s cubic-bezier(0.68, -0.55, 0.265, 1.55)";
    section.style.opacity = "1";
    section.style.transform = "translateY(0) scale(1)";
  }, 700);
}

function fillInterests(interests) {
  const section = $("#interests");
  const ul = $("#interestsList");
  ul.innerHTML = "";
  if (!interests || interests.length === 0) {
    section.hidden = true;
    return;
  }
  section.hidden = false;
  section.style.opacity = "0";
  section.style.transform = "translateY(20px) scale(0.9)";

  interests.forEach((name, index) => {
    const li = el("li", { className: "chip", textContent: name });
    li.style.opacity = "0";
    li.style.transform = "scale(0.8) rotate(-5deg)";
    ul.append(li);

    // Stagger animation for interests with rotation
    setTimeout(() => {
      li.style.transition = "all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)";
      li.style.opacity = "1";
      li.style.transform = "scale(1) rotate(0deg)";
    }, 800 + index * 100);
  });

  // Animate section appearance
  setTimeout(() => {
    section.style.transition = "all 1s cubic-bezier(0.68, -0.55, 0.265, 1.55)";
    section.style.opacity = "1";
    section.style.transform = "translateY(0) scale(1)";
  }, 900);
}

function fillAchievements(achievements) {
  const section = $("#achievements");
  const list = $("#achievementsList");
  list.innerHTML = "";
  if (!achievements || achievements.length === 0) {
    section.hidden = true;
    return;
  }
  section.hidden = false;
  section.style.opacity = "0";
  section.style.transform = "translateY(20px) scale(0.9)";

  achievements.forEach((a, index) => {
    const card = el("div", { className: "card-item" });
    card.style.opacity = "0";
    card.style.transform = "translateY(20px) scale(0.8)";

    const title = el("p", {
      className: "timeline-title",
      textContent: a.title || "",
    });
    const meta = el("small", {
      className: "timeline-meta",
      textContent: a.description || "",
    });
    card.append(title, meta);
    if (a.link)
      card.append(
        el("a", {
          href: a.link,
          textContent: "View Profile",
          target: "_blank",
          rel: "noopener",
        })
      );
    list.append(card);

    // Stagger animation for achievements with bounce
    setTimeout(() => {
      card.style.transition = "all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)";
      card.style.opacity = "1";
      card.style.transform = "translateY(0) scale(1)";
    }, 600 + index * 150);
  });

  // Animate section appearance with enhanced timing
  setTimeout(() => {
    section.style.transition = "all 1s cubic-bezier(0.68, -0.55, 0.265, 1.55)";
    section.style.opacity = "1";
    section.style.transform = "translateY(0) scale(1)";
  }, 700);
}

// Add scroll animations with enhanced effects
function addScrollAnimations() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0) scale(1)";
          entry.target.style.transition =
            "all 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)";
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll(".card").forEach((card) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(30px) scale(0.9)";
    card.style.transition = "all 0.8s ease";
    observer.observe(card);
  });
}

// Enhanced typing effect with cursor animation
function addTypingEffect() {
  const title = document.querySelector(".site-header h1");
  if (!title) return;

  const text = title.textContent;
  title.textContent = "";
  title.style.borderRight = "2px solid var(--accent)";
  title.style.animation = "blink 1s infinite";

  let i = 0;
  const typeWriter = () => {
    if (i < text.length) {
      title.textContent += text.charAt(i);
      i++;
      setTimeout(typeWriter, 80);
    } else {
      title.style.borderRight = "none";
      title.style.animation = "none";
    }
  };

  setTimeout(typeWriter, 500);
}

// Add floating particles effect
function addFloatingParticles() {
  const colors = ["#4f8cff", "#ff6b6b", "#51cf66", "#ffd43b"];

  for (let i = 0; i < 15; i++) {
    const particle = el("div", {
      className: "floating-particle",
      style: `
        position: fixed;
        width: ${2 + Math.random() * 4}px;
        height: ${2 + Math.random() * 4}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        border-radius: 50%;
        pointer-events: none;
        z-index: 1;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        opacity: 0.3;
        animation: floatParticle ${10 + Math.random() * 20}s linear infinite;
      `,
    });

    document.body.appendChild(particle);
  }
}

async function init() {
  // Initialize theme
  initTheme();

  // Add event listener for theme toggle
  $("#themeToggle").addEventListener("click", toggleTheme);

  // Add floating particles
  addFloatingParticles();

  // Add scroll animations
  addScrollAnimations();

  // Add typing effect
  addTypingEffect();

  const data = await loadData();
  if (!data) return; // error already shown

  // Fill all sections with animations
  fillPersonal(data.personal);
  fillSkills(data.skills);
  fillTimeline(data.education, "#educationList");
  fillTimeline(data.experience, "#experienceList");
  fillAchievements(data.achievements);
  fillInterests(data.interests);

  // Add some interactive features
  addInteractiveFeatures();
}

function addInteractiveFeatures() {
  // Enhanced click effects to skills with ripple effect
  document.querySelectorAll(".skill").forEach((skill) => {
    skill.addEventListener("click", (e) => {
      // Create ripple effect
      const ripple = el("div", {
        className: "ripple",
        style: `
          position: absolute;
          border-radius: 50%;
          background: rgba(255,255,255,0.3);
          transform: scale(0);
          animation: ripple 0.6s linear;
          pointer-events: none;
          left: ${e.offsetX}px;
          top: ${e.offsetY}px;
          width: 20px;
          height: 20px;
        `,
      });

      skill.appendChild(ripple);
      setTimeout(() => skill.removeChild(ripple), 600);

      // Bounce effect
      skill.style.transform = "scale(0.95)";
      setTimeout(() => {
        skill.style.transform = "scale(1)";
      }, 150);
    });
  });

  // Enhanced hover effects to timeline items
  document.querySelectorAll(".timeline-item").forEach((item) => {
    item.addEventListener("mouseenter", () => {
      item.style.transform = "translateX(8px) scale(1.02)";
      item.style.boxShadow = "0 12px 35px var(--brand-glow)";
    });

    item.addEventListener("mouseleave", () => {
      item.style.transform = "translateX(0) scale(1)";
      item.style.boxShadow = "0 8px 25px rgba(79, 140, 255, 0.15)";
    });
  });

  // Add hover sound effect simulation (visual feedback)
  document.querySelectorAll(".chip").forEach((chip) => {
    chip.addEventListener("mouseenter", () => {
      chip.style.animation = "bounce 0.6s ease";
    });
  });
}

// Add CSS animations dynamically
function addDynamicCSS() {
  const style = el("style");
  style.textContent = `
    @keyframes particleExplode {
      0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
      100% { transform: translate(calc(-50% + var(--vx)), calc(-50% + var(--vy))) scale(0); opacity: 0; }
    }

    @keyframes blink {
      0%, 50% { border-right-color: var(--accent); }
      51%, 100% { border-right-color: transparent; }
    }

    @keyframes floatParticle {
      0% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(180deg); }
      100% { transform: translateY(0px) rotate(360deg); }
    }

    @keyframes ripple {
      to { transform: scale(4); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
}

document.addEventListener("DOMContentLoaded", () => {
  addDynamicCSS();
  init();
});

const liveTimeElements = document.querySelectorAll("[data-live-time]");
const currentYearElement = document.getElementById("currentYear");
const navToggle = document.querySelector(".nav-toggle");
const siteHeader = document.querySelector(".site-header");
const navLinks = document.querySelectorAll(".site-nav a");
const revealElements = document.querySelectorAll(".reveal");
const sections = document.querySelectorAll("main section[id]");
const copyEmailButton = document.querySelector("[data-copy-email]");
const typedTextElement = document.getElementById("typedText");
const backToTopLink = document.querySelector("[data-back-to-top]");
const resumeDownloadLink = document.querySelector("[data-resume-download]");

document.body.classList.add("js-enabled");

function formatDateTime(date) {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}

function updateLiveTime() {
  const now = new Date();
  const formatted = formatDateTime(now);

  liveTimeElements.forEach((element) => {
    element.textContent = formatted;
    element.setAttribute("datetime", now.toISOString());
  });
}

function updateActiveNav() {
  const scrollPosition = window.scrollY + 160;
  let currentSection = "";

  sections.forEach((section) => {
    if (scrollPosition >= section.offsetTop) {
      currentSection = section.id;
    }
  });

  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${currentSection}`;
    link.classList.toggle("active", isActive);
  });
}

function closeMobileNav() {
  if (!siteHeader || !navToggle) {
    return;
  }

  siteHeader.classList.remove("nav-open");
  navToggle.setAttribute("aria-expanded", "false");
}

function runTypewriter() {
  if (!typedTextElement) {
    return;
  }

  const phrases = [
    "Problem Solver",
    "Data Engineer",
    "Software Developer",
    "Quality Analyst",
    "Cyber-Security Specialist",
    "HR IT Recruiter",
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const tick = () => {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      charIndex -= 1;
    } else {
      charIndex += 1;
    }

    typedTextElement.textContent = currentPhrase.slice(0, charIndex);

    let delay = isDeleting ? 45 : 75;

    if (!isDeleting && charIndex === currentPhrase.length) {
      delay = 1200;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 220;
    }

    window.setTimeout(tick, delay);
  };

  tick();
}

if (currentYearElement) {
  currentYearElement.textContent = new Date().getFullYear();
}

updateLiveTime();
setInterval(updateLiveTime, 1000);
runTypewriter();

if (navToggle && siteHeader) {
  navToggle.addEventListener("click", () => {
    const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isExpanded));
    siteHeader.classList.toggle("nav-open", !isExpanded);
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", closeMobileNav);
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
    }
  );

  revealElements.forEach((element) => {
    if (element.getBoundingClientRect().top < window.innerHeight * 0.92) {
      element.classList.add("is-visible");
    } else {
      revealObserver.observe(element);
    }
  });
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

window.addEventListener("scroll", updateActiveNav, { passive: true });
window.addEventListener("load", updateActiveNav);

if (copyEmailButton) {
  copyEmailButton.addEventListener("click", async () => {
    const email = "ab.arjun.bhargava.2025@outlook.com";

    try {
      await navigator.clipboard.writeText(email);
      copyEmailButton.textContent = "Email Copied";
      setTimeout(() => {
        copyEmailButton.textContent = "Copy Email";
      }, 1800);
    } catch (error) {
      window.location.href = `mailto:${email}`;
    }
  });
}

if (backToTopLink) {
  backToTopLink.addEventListener("click", (event) => {
    event.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

if (resumeDownloadLink) {
  resumeDownloadLink.addEventListener("click", async (event) => {
    event.preventDefault();

    const resumeUrl = resumeDownloadLink.getAttribute("href");
    const fileName = "Resume_Arjun.pdf";

    const openResumeInNewTab = () => {
      window.open(resumeUrl, "_blank", "noopener,noreferrer");
    };

    try {
      const response = await fetch(resumeUrl);

      if (!response.ok) {
        throw new Error("Resume download failed");
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const tempLink = document.createElement("a");

      tempLink.href = objectUrl;
      tempLink.download = fileName;
      tempLink.style.display = "none";

      document.body.appendChild(tempLink);
      tempLink.click();
      tempLink.remove();

      window.setTimeout(() => {
        URL.revokeObjectURL(objectUrl);
      }, 1000);
    } catch (error) {
      openResumeInNewTab();
    }
  });
}

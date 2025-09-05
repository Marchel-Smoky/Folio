function tampilkanSection(id) {
  const semuaSection = document.querySelectorAll(".konten");
  semuaSection.forEach((sec) => sec.classList.remove("aktif"));
  document.getElementById(id).classList.add("aktif");
}

// Splash screen timeout
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("splash").classList.add("hide-splash");
    document.querySelector(".layout").style.display = "flex";
  }, 10000);
});

// Partikel animasi
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
let particlesArray;

function initParticles() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  particlesArray = [];
  for (let i = 0; i < 80; i++) {
    particlesArray.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 2,
      speedY: (Math.random() - 0.5) * 2,
    });
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particlesArray.forEach(p => {
    p.x += p.speedX;
    p.y += p.speedY;
    if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
    if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
  });
  requestAnimationFrame(animateParticles);
}

window.addEventListener("resize", initParticles);
initParticles();
animateParticles();

// Dynamic typing effect
const roles = ["Engineer & Innovator", "Programmer", "Designer", "Creator"];
let roleIndex = 0;
let charIndex = 0;
const typingSpeed = 100;
const erasingSpeed = 60;
const delayBetween = 1500;
const typingElement = document.getElementById("typing-text");

function type() {
  if (charIndex < roles[roleIndex].length) {
    typingElement.textContent += roles[roleIndex].charAt(charIndex);
    charIndex++;
    setTimeout(type, typingSpeed);
  } else {
    setTimeout(erase, delayBetween);
  }
}

function erase() {
  if (charIndex > 0) {
    typingElement.textContent = roles[roleIndex].substring(0, charIndex - 1);
    charIndex--;
    setTimeout(erase, erasingSpeed);
  } else {
    roleIndex = (roleIndex + 1) % roles.length;
    setTimeout(type, typingSpeed);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (roles.length) setTimeout(type, 4000); // mulai setelah logo muncul
});

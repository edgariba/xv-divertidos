/* ==========================================================
   XV Valentina · lógica de la invitación
   ========================================================== */

// ---------- Configuración (edita aquí) ----------
const CONFIG = {
  nombre: "Valentina",
  fechaEvento: "2027-03-20T20:00:00-06:00", // hora de la fiesta (Ciudad de México)
  whatsapp: "5215512345678",                 // número que recibe las confirmaciones (con lada, sin +)
  maxPersonas: 4,                            // límite si el link no trae ?pases=
  hashtag: "#ValeXV",
  calendario: {
    titulo: "XV Años de Valentina 🎀",
    inicio: "20270321T020000Z",              // 20 mar 2027 8:00 PM CDMX en UTC
    fin: "20270321T080000Z",
    lugar: "Jardín Hacienda Las Magnolias, Camino Real 1500",
    detalles: "¡No faltes! Código de vestimenta: Formal pastel ✿",
  },
};

const $ = (sel) => document.querySelector(sel);
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- Invitado personalizado por URL ----------
// Ej: index.html?invitado=Familia%20Pérez&pases=3
const params = new URLSearchParams(location.search);
const invitado = params.get("invitado");
const pases = parseInt(params.get("pases"), 10);
const maxPersonas = pases > 0 ? pases : CONFIG.maxPersonas;

if (invitado) {
  $("#splashGuest").textContent = invitado;
  $("#guestGreeting").textContent = `¡Hola, ${invitado}!`;
  $("#nombre").value = invitado;
}
if (pases > 0) {
  const info = $("#passesInfo");
  info.textContent = `🎟️ Reservamos ${pases} ${pases === 1 ? "lugar" : "lugares"} para ti`;
  info.hidden = false;
}

// ---------- Splash: abrir el sobre ----------
let opened = false;
function openInvite() {
  if (opened) return;
  opened = true;
  const splash = $("#splash");
  splash.classList.add("is-opening");
  $("#env").classList.add("is-open");

  const delay = reduceMotion ? 0 : 2300;
  setTimeout(() => {
    splash.classList.add("is-gone");
    document.body.classList.remove("locked");
    launchPetals();
  }, delay);
  setTimeout(() => splash.remove(), delay + 1000);
}
$("#openBtn").addEventListener("click", openInvite);
$("#env").addEventListener("click", openInvite);

// ---------- Cuenta regresiva ----------
const target = new Date(CONFIG.fechaEvento).getTime();
const pad = (n) => String(n).padStart(2, "0");
function tick() {
  const diff = Math.max(0, target - Date.now());
  $("#cd-d").textContent = pad(Math.floor(diff / 86400000));
  $("#cd-h").textContent = pad(Math.floor((diff / 3600000) % 24));
  $("#cd-m").textContent = pad(Math.floor((diff / 60000) % 60));
  $("#cd-s").textContent = pad(Math.floor((diff / 1000) % 60));
}
tick();
setInterval(tick, 1000);

// ---------- Calendario del mes ----------
(function buildCalendar() {
  const fecha = new Date(CONFIG.fechaEvento);
  const year = fecha.getFullYear();
  const month = fecha.getMonth();
  const dia = fecha.getDate();
  const grid = $("#calendar");

  ["L", "M", "M", "J", "V", "S", "D"].forEach((d) => {
    grid.insertAdjacentHTML("beforeend", `<span class="dow">${d}</span>`);
  });
  const offset = (new Date(year, month, 1).getDay() + 6) % 7; // semana inicia en lunes
  const total = new Date(year, month + 1, 0).getDate();
  for (let i = 0; i < offset; i++) grid.insertAdjacentHTML("beforeend", "<span></span>");
  for (let d = 1; d <= total; d++) {
    grid.insertAdjacentHTML("beforeend", `<span${d === dia ? ' class="day-xv"' : ""}>${d}</span>`);
  }
})();

// ---------- Google Calendar ----------
const cal = CONFIG.calendario;
$("#calendarBtn").href =
  "https://calendar.google.com/calendar/render?action=TEMPLATE" +
  `&text=${encodeURIComponent(cal.titulo)}` +
  `&dates=${cal.inicio}/${cal.fin}` +
  `&details=${encodeURIComponent(cal.detalles)}` +
  `&location=${encodeURIComponent(cal.lugar)}`;

// ---------- Animación al hacer scroll ----------
const revealer = new IntersectionObserver(
  (entries) => entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add("visible");
      revealer.unobserve(e.target);
    }
  }),
  { threshold: 0.12 }
);
document.querySelectorAll(".reveal").forEach((el) => revealer.observe(el));

// ---------- Botón flotante (oculto en portada y en el RSVP) ----------
const fab = $("#fab");
const visibleZones = new Set();
const fabObserver = new IntersectionObserver((entries) => {
  entries.forEach((e) => (e.isIntersecting ? visibleZones.add(e.target) : visibleZones.delete(e.target)));
  fab.classList.toggle("show", visibleZones.size === 0);
}, { threshold: 0.1 });
fabObserver.observe($(".hero"));
fabObserver.observe($("#rsvp"));

// ---------- Galería con visor ----------
const lightbox = $("#lightbox");
$("#gallery").addEventListener("click", (e) => {
  const img = e.target.closest(".gallery__item")?.querySelector("img");
  if (!img) return;
  $("#lbImg").src = img.src;
  $("#lbImg").alt = img.alt;
  lightbox.hidden = false;
});
const closeLightbox = () => (lightbox.hidden = true);
$("#lbClose").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => e.target === lightbox && closeLightbox());
addEventListener("keydown", (e) => e.key === "Escape" && closeLightbox());

// ---------- Copiar hashtag ----------
$("#copyTag").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(CONFIG.hashtag);
    $("#copyMsg").textContent = "¡copiado! ♡";
  } catch {
    $("#copyMsg").textContent = CONFIG.hashtag;
  }
  setTimeout(() => ($("#copyMsg").textContent = "toca para copiar"), 2000);
});

// ---------- RSVP ----------
const form = $("#rsvpForm");
const personasOut = $("#personas");
let personas = maxPersonas > 1 && pases > 0 ? pases : 1;

function renderPersonas() {
  personasOut.textContent = personas;
  $("#minus").disabled = personas <= 1;
  $("#plus").disabled = personas >= maxPersonas;
}
$("#minus").addEventListener("click", () => { personas = Math.max(1, personas - 1); renderPersonas(); });
$("#plus").addEventListener("click", () => { personas = Math.min(maxPersonas, personas + 1); renderPersonas(); });
renderPersonas();

form.addEventListener("change", (e) => {
  if (e.target.name === "asiste") $("#personasField").hidden = e.target.value === "no";
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const nombre = data.get("nombre").trim();
  const nombreInput = $("#nombre");

  if (!nombre) {
    nombreInput.classList.add("invalid");
    $("#formError").textContent = "Escribe tu nombre para confirmar ♡";
    nombreInput.focus();
    return;
  }
  nombreInput.classList.remove("invalid");
  $("#formError").textContent = "";

  const asiste = data.get("asiste") === "si";
  const cancion = data.get("cancion").trim();
  const mensaje = data.get("mensaje").trim();

  let texto = asiste
    ? `🎀 ¡Hola! Soy *${nombre}* y confirmo mi asistencia a los XV de ${CONFIG.nombre}.\n👥 Personas: ${personas}`
    : `Hola, soy *${nombre}*. Lamentablemente no podré asistir a los XV de ${CONFIG.nombre} 🥺`;
  if (cancion) texto += `\n🎵 Canción: ${cancion}`;
  if (mensaje) texto += `\n💌 Mensaje: ${mensaje}`;

  window.open(`https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(texto)}`, "_blank");

  $("#doneEmoji").textContent = asiste ? "🥳" : "🫶";
  $("#doneTitle").textContent = asiste ? `¡Nos vemos ahí, ${nombre.split(" ")[0]}!` : "¡Gracias por avisar!";
  $("#doneText").textContent = asiste
    ? "Se abrió WhatsApp con tu confirmación. ¡Solo presiona enviar!"
    : "Se abrió WhatsApp con tu mensaje. ¡Te vamos a extrañar!";
  form.hidden = true;
  $("#rsvpDone").hidden = false;
  if (asiste) launchPetals();
});

$("#editRsvp").addEventListener("click", () => {
  form.hidden = false;
  $("#rsvpDone").hidden = true;
});

// ---------- Lluvia de pétalos y corazones (sin librerías) ----------
const canvas = $("#petals");
const ctx = canvas.getContext("2d");
const COLORS = ["#f9cfe0", "#f4a3c4", "#dcccf6", "#c3a6ee", "#c9eedf", "#cfe6fb", "#fff0b8"];
let petals = [];
let running = false;

function resize() {
  canvas.width = innerWidth * devicePixelRatio;
  canvas.height = innerHeight * devicePixelRatio;
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}
addEventListener("resize", resize);
resize();

function launchPetals() {
  if (reduceMotion) return;
  for (let i = 0; i < 90; i++) {
    petals.push({
      x: Math.random() * innerWidth,
      y: -20 - Math.random() * innerHeight * 0.8,
      size: 7 + Math.random() * 9,
      vy: 1.2 + Math.random() * 1.8,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: 0.02 + Math.random() * 0.03,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.06,
      color: COLORS[(Math.random() * COLORS.length) | 0],
      heart: Math.random() < 0.35,
    });
  }
  if (!running) {
    running = true;
    requestAnimationFrame(draw);
  }
}

function drawHeart(s) {
  ctx.beginPath();
  ctx.moveTo(0, s * 0.3);
  ctx.bezierCurveTo(-s, -s * 0.4, -s * 0.4, -s, 0, -s * 0.4);
  ctx.bezierCurveTo(s * 0.4, -s, s, -s * 0.4, 0, s * 0.3);
  ctx.fill();
}

function drawPetal(s) {
  ctx.beginPath();
  ctx.ellipse(0, 0, s * 0.5, s * 0.8, 0, 0, Math.PI * 2);
  ctx.fill();
}

function draw() {
  ctx.clearRect(0, 0, innerWidth, innerHeight);
  petals.forEach((p) => {
    p.sway += p.swaySpeed;
    p.x += Math.sin(p.sway) * 1.2;
    p.y += p.vy;
    p.rot += p.vr;
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.color;
    p.heart ? drawHeart(p.size) : drawPetal(p.size);
    ctx.restore();
  });
  petals = petals.filter((p) => p.y < innerHeight + 30);
  if (petals.length) {
    requestAnimationFrame(draw);
  } else {
    running = false;
    ctx.clearRect(0, 0, innerWidth, innerHeight);
  }
}

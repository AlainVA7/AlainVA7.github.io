/* ═══════════════════════════════════════════
   Deskroom — i18n (ES / EN)
   ═══════════════════════════════════════════ */
"use strict";

var I18N = {
  es: {
    /* boot */
    "boot.hint": "Pulsar para saltar",
    /* chrome */
    "desk.icons": "Iconos de escritorio",
    "dock.aria": "Dock de aplicaciones",
    /* apps */
    "app.about": "Sobre mí",
    "app.projects": "Proyectos",
    "app.skills": "Skills",
    "app.cv": "CV",
    "app.contact": "Contacto",
    "app.settings": "Ajustes",
    /* sobre mí */
    "about.role": "Técnico Superior en Telecomunicaciones e IT · Estudiante de IA",
    "about.loc": "País Vasco, España",
    "about.bio": "Técnico Superior en Telecomunicaciones y Sistemas Informáticos, estudiando actualmente la especialización de Inteligencia Artificial. Me apasiona el mundo de la informática y sigo aprendiendo cada día.",
    "about.edu1": "Grado Superior · Telecomunicaciones",
    "about.edu2": "Especialización · Inteligencia Artificial",
    "about.curious": "Autodidacta",
    "about.learning": "Aprendiendo ahora",
    "about.interests": "Intereses",
    "about.i1": "Redes & Telecom",
    "about.i2": "Virtualización",
    "about.i3": "Automatización",
    "about.i4": "Ciberseguridad",
    "about.cta": "Ver proyectos",
    "about.cv": "Ver CV",
    "about.cvDl": "Descargar",
    /* proyectos */
    "proj.search": "Buscar proyecto…",
    "proj.all": "Todos",
    "proj.none": "Sin proyectos aún",
    "proj.noneHint": "Cuando publiques repos en GitHub aparecerán aquí automáticamente.",
    "proj.noMatch": "Sin resultados",
    "proj.noMatchHint": "Prueba con otro término o filtro.",
    "proj.updated": "Actualizado",
    "proj.repos": "repositorios",
    "proj.repos.one": "repositorio",
    "proj.stars": "estrellas",
    "proj.loading": "Cargando proyectos desde GitHub…",
    "proj.public": "público",
    "proj.fork": "fork",
    /* skills */
    "skills.note": "Niveles orientativos y en progreso — sigo aprendiendo.",
    "skills.chip1": "Linux",
    "skills.chip2": "Docker",
    "skills.chip3": "Proxmox",
    "skills.chip4": "IA",
    /* cv */
    "cv.hint": "Visor del CV — usa los botones para abrirlo o descargarlo.",
    "cv.open": "Abrir",
    "cv.download": "Descargar PDF",
    /* contacto */
    "contact.lead": "¿Tienes una idea, una pregunta o un proyecto? Hablemos.",
    "contact.email": "Gmail",
    "contact.copy": "Copiar correo",
    "contact.copied": "¡Copiado!",
    "contact.note": "Respondo normalmente en menos de 48 h.",
    /* ajustes */
    "set.theme": "Apariencia",
    "set.mode": "Tema",
    "set.dark": "Oscuro",
    "set.light": "Claro",
    "set.wall": "Fondo",
    "set.lang": "Idioma",
    "set.langLabel": "Idioma de la interfaz",
    "set.sys": "Sistema",
    "set.motion": "Animaciones",
    "set.boot": "Pantalla de arranque",
    "set.about": "Deskroom 1.0 — portfolio personal. Hecho con HTML, CSS y JavaScript puro."
  },

  en: {
    /* boot */
    "boot.hint": "Click to skip",
    /* chrome */
    "desk.icons": "Desktop icons",
    "dock.aria": "Application dock",
    /* apps */
    "app.about": "About",
    "app.projects": "Projects",
    "app.skills": "Skills",
    "app.cv": "CV",
    "app.contact": "Contact",
    "app.settings": "Settings",
    /* about */
    "about.role": "Telecom & IT Technician · AI Student",
    "about.loc": "Basque Country, Spain",
    "about.bio": "Higher Technician in Telecommunications and Computer Systems, currently studying the Artificial Intelligence specialization. I'm a computer enthusiast — I keep learning more about it every day.",
    "about.edu1": "Higher Diploma · Telecommunications",
    "about.edu2": "Specialization · Artificial Intelligence",
    "about.curious": "Self-taught",
    "about.learning": "Learning now",
    "about.interests": "Interests",
    "about.i1": "Networks & Telecom",
    "about.i2": "Virtualization",
    "about.i3": "Automation",
    "about.i4": "Cybersecurity",
    "about.cta": "View projects",
    "about.cv": "View CV",
    "about.cvDl": "Download",
    /* projects */
    "proj.search": "Search projects…",
    "proj.all": "All",
    "proj.none": "No projects yet",
    "proj.noneHint": "As soon as you publish repos on GitHub they will appear here automatically.",
    "proj.noMatch": "No results",
    "proj.noMatchHint": "Try another term or filter.",
    "proj.updated": "Updated",
    "proj.repos": "repositories",
    "proj.repos.one": "repository",
    "proj.stars": "stars",
    "proj.loading": "Loading projects from GitHub…",
    "proj.public": "public",
    "proj.fork": "fork",
    /* skills */
    "skills.note": "Indicative, work-in-progress levels — still learning.",
    "skills.chip1": "Linux",
    "skills.chip2": "Docker",
    "skills.chip3": "Proxmox",
    "skills.chip4": "AI",
    /* cv */
    "cv.hint": "CV viewer — use the buttons to open or download it.",
    "cv.open": "Open",
    "cv.download": "Download PDF",
    /* contact */
    "contact.lead": "Got an idea, a question or a project? Let's talk.",
    "contact.email": "Gmail",
    "contact.copy": "Copy email",
    "contact.copied": "Copied!",
    "contact.note": "I usually reply within 48 hours.",
    /* settings */
    "set.theme": "Appearance",
    "set.mode": "Theme",
    "set.dark": "Dark",
    "set.light": "Light",
    "set.wall": "Wallpaper",
    "set.lang": "Language",
    "set.langLabel": "Interface language",
    "set.sys": "System",
    "set.motion": "Animations",
    "set.boot": "Boot screen",
    "set.about": "Deskroom 1.0 — personal portfolio. Built with plain HTML, CSS and JavaScript."
  }
};

var Lang = {
  get lang() {
    try { return localStorage.getItem("alain.lang") || (document.documentElement.lang === "en" ? "en" : "es"); }
    catch (e) { return "es"; }
  },
  set(l) {
    try { localStorage.setItem("alain.lang", l); } catch (e) {}
    document.documentElement.lang = l;
    document.dispatchEvent(new CustomEvent("langchange", { detail: l }));
  },
  t(key) {
    var l = this.lang;
    return (I18N[l] && I18N[l][key]) || I18N.es[key] || key;
  }
};

/* Aplica data-i18n a un nodo (o al documento entero) */
function applyI18n(root) {
  root = root || document;
  root.querySelectorAll("[data-i18n]").forEach(function (el) {
    el.textContent = Lang.t(el.getAttribute("data-i18n"));
  });
  root.querySelectorAll("[data-i18n-ph]").forEach(function (el) {
    el.setAttribute("placeholder", Lang.t(el.getAttribute("data-i18n-ph")));
  });
  root.querySelectorAll("[data-i18n-title]").forEach(function (el) {
    el.setAttribute("title", Lang.t(el.getAttribute("data-i18n-title")));
  });
  root.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
    el.setAttribute("aria-label", Lang.t(el.getAttribute("data-i18n-aria")));
  });
  document.querySelectorAll(".lang-btn").forEach(function (b) {
    b.classList.toggle("active", b.dataset.lang === Lang.lang);
  });
}

/* Utilidad: fecha localizada corta */
function fmtDate(iso, opts) {
  try {
    return new Date(iso).toLocaleDateString(Lang.lang === "en" ? "en-US" : "es-ES",
      opts || { year: "numeric", month: "short", day: "numeric" });
  } catch (e) { return iso; }
}

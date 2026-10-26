/* ═══════════════════════════════════════════
   AlainOS — datos editables del perfil
   (este es el único archivo que tocas para
   cambiar tu perfil y tus skills)
   ═══════════════════════════════════════════ */
"use strict";

var USER = {
  name: "Alain",
  username: "AlainVA7",
  role: {
    es: "Técnico Superior en Telecomunicaciones e IT · Estudiante de IA",
    en: "Telecom & IT Technician · AI Student"
  },
  location: { es: "País Vasco, España", en: "Basque Country, Spain" },
  email: "alainvallecillos@gmail.com",
  github: "https://github.com/AlainVA7",
  site: "https://alainva7.github.io"
};

/* Niveles: 0–100 (orientativos, edita cuando quieras) */
var SKILLS = [
  { id: "networking", level: 70, name: { es: "Redes & Telecomunicaciones", en: "Networks & Telecommunications" } },
  { id: "linux",      level: 55, name: { es: "Linux", en: "Linux" } },
  { id: "docker",     level: 50, name: { es: "Docker", en: "Docker" } },
  { id: "proxmox",    level: 45, name: { es: "Proxmox / Virtualización", en: "Proxmox / Virtualization" } },
  { id: "git",        level: 55, name: { es: "Git & GitHub", en: "Git & GitHub" } },
  { id: "python",     level: 45, name: { es: "Python", en: "Python" } },
  { id: "ai",         level: 40, name: { es: "Inteligencia Artificial", en: "Artificial Intelligence" } },
  { id: "grafana",    level: 35, name: { es: "Grafana / Monitorización", en: "Grafana / Monitoring" } }
];

/* Contenido de "cat about" en terminal */
var ABOUT_TEXT = {
  es: "Alain — Técnico Superior en Telecomunicaciones y Sistemas Informáticos.\nEstudiando la especialización de Inteligencia Artificial.\nMe apasiona la informática y sigo aprendiendo cada día.",
  en: "Alain — Higher Technician in Telecommunications and Computer Systems.\nStudying the Artificial Intelligence specialization.\nI'm a computer enthusiast and keep learning every day."
};

/* Colores por lenguaje (para las tarjetas de proyecto) */
var LANG_COLORS = {
  JavaScript: "#f1e05a", TypeScript: "#3178c6", Python: "#3572a5", HTML: "#e34c26",
  CSS: "#663399", SCSS: "#c6538c", Shell: "#89e051", PowerShell: "#012456",
  Rust: "#dea584", Go: "#00add8", Java: "#b07219", PHP: "#4f5d95",
  Ruby: "#701516", C: "#a8b9cc", "C++": "#f34b7d", "C#": "#178600",
  Vue: "#41b883", Svelte: "#ff3e00", Kotlin: "#a97bff", Swift: "#f05138",
  Dart: "#00b4ab", Lua: "#000080", Haskell: "#5e5086", Elixir: "#6e4a7e",
  Dockerfile: "#384d54", Makefile: "#427819", "Jupyter Notebook": "#da5b0b",
  Astro: "#ff5d01", Blade: "#f75231", Zig: "#ec915c", Solidity: "#aa6746",
  "Objective-C": "#438eff", R: "#198ce7", Perl: "#0298c3", Scala: "#c22d40"
};

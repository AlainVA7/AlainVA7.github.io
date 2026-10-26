/* ═══════════════════════════════════════════
   Deskroom — Panel Manager
   Paneles modales centrados: sin drag, sin
   semáforos; cierra con ✕, fondo o ESC
   ═══════════════════════════════════════════ */
"use strict";

var WM = (function () {
  var layer, backdrop = null;
  var panel = null;
  var currentApp = null;

  var TITLES = {
    about: "app.about", projects: "app.projects", skills: "app.skills",
    cv: "app.cv", contact: "app.contact", settings: "app.settings"
  };

  function iconSvg(appId) {
    var btn = document.querySelector('.dock-btn[data-open="' + appId + '"]');
    var svg = btn ? btn.querySelector(".dock-icon svg") : null;
    return svg ? svg.outerHTML : "";
  }

  var SIZES = {
    about:    { w: 620, h: 560 },
    projects: { w: 860, h: 640 },
    skills:   { w: 560, h: 560 },
    cv:       { w: 1040, h: 880 },
    contact:  { w: 560, h: 470 },
    settings: { w: 560, h: 540 }
  };

  function syncDock(appId, on) {
    document.querySelectorAll('.dock-btn[data-open="' + appId + '"]').forEach(function (b) {
      b.classList.toggle("running", on);
    });
  }

  function open(appId) {
    if (!document.getElementById("tpl-" + appId)) return null;
    /* ya abierta → no reabrir */
    if (currentApp === appId && panel) return panel;

    /* panel distinto abierto → sustituir al instante */
    if (panel) {
      panel.remove();
      syncDock(currentApp, false);
      panel = null;
    }

    var tpl = document.getElementById("tpl-" + appId);
    var el = document.createElement("section");
    el.className = "panel opening";
    el.dataset.app = appId;
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-modal", "true");
    el.setAttribute("aria-label", Lang.t(TITLES[appId] || appId));

    el.innerHTML =
      '<header class="panel-bar">' +
        '<div class="panel-title">' + iconSvg(appId) +
          '<span class="panel-title-txt">' + Lang.t(TITLES[appId] || appId) + '</span>' +
          (appId === "projects" ? '<span class="win-badge">auto</span>' : "") +
        '</div>' +
        '<button class="panel-close" type="button" aria-label="Close">' +
          '<svg viewBox="0 0 14 14" width="12" height="12" aria-hidden="true"><path d="M2 2l10 10M12 2L2 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>' +
        '</button>' +
      '</header>' +
      '<div class="panel-body"></div>';

    el.querySelector(".panel-body").appendChild(tpl.content.cloneNode(true));
    var s = SIZES[appId] || { w: 620, h: 480 };
    el.style.setProperty("--pw", s.w + "px");
    el.style.setProperty("--ph", s.h + "px");

    layer.appendChild(el);
    layer.classList.add("on");
    applyI18n(el); /* el contenido viene de <template>: traducir tras clonar */
    panel = el;
    currentApp = appId;
    syncDock(appId, true);

    el.querySelector(".panel-close").addEventListener("click", function (e) {
      e.stopPropagation();
      close();
    });

    el.addEventListener("animationend", function h(e) {
      if (e.animationName === "panelIn" || e.animationName === "panelInM") {
        el.classList.remove("opening");
        el.removeEventListener("animationend", h);
        onOpen(appId, el);
      }
    });
    /* si motion off, animationend puede no disparar → fallback */
    setTimeout(function () {
      if (el.classList.contains("opening")) {
        el.classList.remove("opening");
        onOpen(appId, el);
      }
    }, 650);

    return el;
  }

  function close() {
    if (!panel) return;
    var p = panel; panel = null;
    var app = currentApp; currentApp = null;
    syncDock(app, false);
    layer.classList.remove("on");
    p.classList.add("closing");
    var done = function () { p.remove(); };
    p.addEventListener("animationend", done, { once: true });
    setTimeout(done, 420);
  }

  /* hooks que las apps registran al abrir */
  var hooks = {};
  function onOpen(appId, win) {
    if (hooks[appId]) try { hooks[appId](win); } catch (e) { console.error(e); }
    /* red de seguridad: la cascada (.stagger) debe llegar a estado final */
    setTimeout(function () {
      if (!win.isConnected) return;
      win.querySelectorAll(".stagger").forEach(function (el) { el.classList.add("stagger-done"); });
    }, 2000);
  }
  function hook(appId, fn) { hooks[appId] = fn; }

  function init() {
    layer = document.getElementById("winLayer");
    backdrop = document.getElementById("panelBackdrop");

    /* delegación global de [data-open]: alcanza también los nodos
       clonados desde <template> (p. ej. botones de Sobre mí) */
    document.addEventListener("click", function (e) {
      var btn = e.target.closest ? e.target.closest("[data-open]") : null;
      if (btn) open(btn.dataset.open);
    });

    /* clic en el fondo → cerrar */
    if (backdrop) backdrop.addEventListener("click", close);

    /* ESC → cerrar */
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  }

  return {
    init: init, open: open, close: close, hook: hook,
    isOpen: function (id) { return currentApp === id; }
  };
})();

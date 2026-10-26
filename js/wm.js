/* ═══════════════════════════════════════════
   AlainOS — Window Manager
   Ventanas: abrir morph desde el dock, arrastrar,
   foco, minimizar/maximizar/cerrar
   ═══════════════════════════════════════════ */
"use strict";

var WM = (function () {
  var layer, zTop = 20;
  var openWins = {};   // appId -> window el
  var lastRect = {};   // appId -> {l,t,w,h} antes de max

  var TITLES = {
    about: "app.about", projects: "app.projects", skills: "app.skills",
    terminal: "app.terminal", blog: "app.blog", contact: "app.contact",
    settings: "app.settings"
  };

  function iconSvg(appId) {
    var btn = document.querySelector('.dock-btn[data-open="' + appId + '"]');
    return btn ? btn.querySelector(".dock-icon svg").outerHTML : "";
  }

  /* Tamaño por defecto de cada app */
  var SIZES = {
    about:     { w: 620, h: 560 },
    projects:  { w: 860, h: 620 },
    skills:    { w: 560, h: 560 },
    terminal:  { w: 680, h: 460 },
    blog:      { w: 720, h: 600 },
    contact:   { w: 560, h: 470 },
    settings:  { w: 560, h: 540 }
  };

  function isMobile() { return window.matchMedia("(max-width: 768px)").matches; }

  /* Origen del morph: icono del dock (o centro) */
  function originOf(appId) {
    var btn = document.querySelector('.dock-btn[data-open="' + appId + '"]') ||
              document.querySelector('.dicon[data-open="' + appId + '"]');
    if (!btn) return null;
    var r = btn.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  function focus(win) {
    Object.keys(openWins).forEach(function (id) {
      var w = openWins[id];
      w.classList.toggle("focused", w === win);
      w.classList.toggle("unfocused", w !== win);
    });
    win.style.zIndex = ++zTop;
    var title = document.getElementById("tbApp");
    if (title) title.textContent = Lang.t(TITLES[win.dataset.app] || "");
  }

  function syncDock(appId, on) {
    document.querySelectorAll('.dock-btn[data-open="' + appId + '"]').forEach(function (b) {
      b.classList.toggle("running", on);
    });
  }

  /* Posición inicial: cascada suave centrada */
  function place(win, appId) {
    var s = SIZES[appId] || { w: 620, h: 480 };
    var layerW = layer.clientWidth, layerH = layer.clientHeight;
    var w = Math.min(s.w, layerW - 40);
    var h = Math.min(s.h, layerH - 40);
    var n = Object.keys(openWins).length;
    var l = Math.max(12, (layerW - w) / 2 + ((n % 5) - 2) * 26);
    var t = Math.max(10, (layerH - h) / 2.2 + ((n % 5) - 2) * 20);
    win.style.width = w + "px";
    win.style.height = h + "px";
    win.style.left = Math.round(l) + "px";
    win.style.top = Math.round(t) + "px";
  }

  function open(appId) {
    if (!document.getElementById("tpl-" + appId)) return;
    /* Si ya está abierta y no minimizada → foco */
    if (openWins[appId]) {
      var exist = openWins[appId];
      if (exist.dataset.min === "1") restore(appId);
      else focus(exist);
      return exist;
    }

    var tpl = document.getElementById("tpl-" + appId);
    var win = document.createElement("section");
    win.className = "window opening";
    win.dataset.app = appId;
    win.setAttribute("role", "dialog");
    win.setAttribute("aria-label", Lang.t(TITLES[appId] || appId));

    win.innerHTML =
      '<header class="win-bar">' +
        '<div class="win-dots">' +
          '<button class="win-dot win-dot-close" type="button" aria-label="Close"><svg viewBox="0 0 8 8"><path d="M1 1l6 6M7 1L1 7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></button>' +
          '<button class="win-dot win-dot-min" type="button" aria-label="Minimize"><svg viewBox="0 0 8 8"><path d="M1 4h6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></button>' +
          '<button class="win-dot win-dot-max" type="button" aria-label="Maximize"><svg viewBox="0 0 8 8"><rect x="1" y="1" width="6" height="6" fill="none" stroke="currentColor" stroke-width="1.4"/></svg></button>' +
        '</div>' +
        '<div class="win-title">' + iconSvg(appId) + '<span class="win-title-txt">' + Lang.t(TITLES[appId] || appId) + '</span>' + (appId === "projects" ? '<span class="win-badge">auto</span>' : "") + '</div>' +
      '</header>' +
      '<div class="win-body"></div>';

    win.querySelector(".win-body").appendChild(tpl.content.cloneNode(true));
    layer.appendChild(win);
    applyI18n(win); /* el contenido viene de <template>: traducir tras clonar */
    openWins[appId] = win;
    place(win, appId);

    /* Origen del morph = icono del dock */
    var org = originOf(appId);
    if (org) {
      var r = win.getBoundingClientRect();
      win.style.transformOrigin = (org.x - r.left) + "px " + (org.y - r.top) + "px";
    }

    syncDock(appId, true);
    focus(win);

    win.addEventListener("animationend", function h(e) {
      if (e.animationName === "winIn") {
        win.classList.remove("opening", "restoring");
        win.style.transformOrigin = "";
        win.removeEventListener("animationend", h);
        onOpen(appId, win);
      }
    });

    /* Si motion off, animationend puede no disparar → fallback */
    setTimeout(function () {
      if (win.classList.contains("opening")) {
        win.classList.remove("opening");
        win.style.transformOrigin = "";
        onOpen(appId, win);
      }
    }, 700);

    wireWindow(win, appId);
    return win;
  }

  function close(appId) {
    var win = openWins[appId];
    if (!win) return;
    delete openWins[appId];
    syncDock(appId, false);
    win.classList.add("closing");
    var done = function () { win.remove(); };
    win.addEventListener("animationend", done, { once: true });
    setTimeout(done, 450);
    /* Foco a otra ventana abierta */
    var rest = Object.keys(openWins).filter(function (k) { return openWins[k].dataset.min !== "1"; });
    if (rest.length) focus(openWins[rest[rest.length - 1]]);
    else { var t = document.getElementById("tbApp"); if (t) t.textContent = ""; }
  }

  function minimize(appId) {
    var win = openWins[appId];
    if (!win) return;
    win.dataset.min = "1";
    win.classList.add("minimizing");
    var done = function () { win.style.display = "none"; };
    win.addEventListener("animationend", done, { once: true });
    setTimeout(done, 500);
    var rest = Object.keys(openWins).filter(function (k) { return k !== appId && openWins[k].dataset.min !== "1"; });
    if (rest.length) focus(openWins[rest[rest.length - 1]]);
  }

  function restore(appId) {
    var win = openWins[appId];
    if (!win) return;
    win.style.display = "";
    win.dataset.min = "0";
    win.classList.add("restoring");
    var org = originOf(appId);
    if (org) {
      var r = win.getBoundingClientRect();
      win.style.transformOrigin = (org.x - r.left) + "px " + (org.y - r.top) + "px";
    }
    win.addEventListener("animationend", function h(e) {
      if (e.animationName === "winIn") {
        win.classList.remove("restoring");
        win.style.transformOrigin = "";
        win.removeEventListener("animationend", h);
      }
    }, { once: true });
    focus(win);
  }

  function toggleMax(win) {
    var appId = win.dataset.app;
    if (win.classList.contains("max")) {
      win.classList.remove("max");
      var r = lastRect[appId];
      if (r) { win.style.left = r.l; win.style.top = r.t; win.style.width = r.w; win.style.height = r.h; }
    } else {
      lastRect[appId] = { l: win.style.left, t: win.style.top, w: win.style.width, h: win.style.height };
      win.classList.add("max");
    }
  }

  /* Arrastre por la barra de título (pointer events, fluido) */
  function dragify(win) {
    var bar = win.querySelector(".win-bar");
    var sx, sy, ox, oy, dragging = false;

    bar.addEventListener("pointerdown", function (e) {
      if (e.target.closest(".win-dot")) return;
      if (isMobile() || win.classList.contains("max")) return;
      dragging = true;
      sx = e.clientX; sy = e.clientY;
      ox = win.offsetLeft; oy = win.offsetTop;
      win.classList.add("dragging");
      bar.setPointerCapture(e.pointerId);
    });
    bar.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      var layerW = layer.clientWidth, layerH = layer.clientHeight;
      var nx = ox + (e.clientX - sx);
      var ny = oy + (e.clientY - sy);
      /* límites suaves: siempre algo visible */
      nx = Math.max(-win.offsetWidth + 80, Math.min(layerW - 60, nx));
      ny = Math.max(0, Math.min(layerH - 44, ny));
      win.style.left = nx + "px";
      win.style.top = ny + "px";
    });
    var stop = function (e) {
      if (!dragging) return;
      dragging = false;
      win.classList.remove("dragging");
      try { bar.releasePointerCapture(e.pointerId); } catch (err) {}
    };
    bar.addEventListener("pointerup", stop);
    bar.addEventListener("pointercancel", stop);
    /* doble clic en barra → maximizar */
    bar.addEventListener("dblclick", function (e) {
      if (e.target.closest(".win-dot")) return;
      toggleMax(win);
    });
  }

  function wireWindow(win, appId) {
    win.addEventListener("pointerdown", function () { focus(win); }, true);
    win.querySelector(".win-dot-close").addEventListener("click", function (e) { e.stopPropagation(); close(appId); });
    win.querySelector(".win-dot-min").addEventListener("click", function (e) { e.stopPropagation(); minimize(appId); });
    win.querySelector(".win-dot-max").addEventListener("click", function (e) { e.stopPropagation(); toggleMax(win); });
    dragify(win);
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
    /* Clic en dock/iconos */
    document.querySelectorAll("[data-open]").forEach(function (btn) {
      btn.addEventListener("click", function () { open(btn.dataset.open); });
    });
    /* Esc cierra la ventana con foco */
    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      var f = document.querySelector(".window.focused");
      if (f) close(f.dataset.app);
    });
    window.addEventListener("resize", function () {
      Object.keys(openWins).forEach(function (id) {
        var w = openWins[id];
        if (isMobile()) return;
        /* mantener dentro del layer */
        if (w.offsetLeft > layer.clientWidth - 60) w.style.left = Math.max(8, layer.clientWidth - 120) + "px";
        if (w.offsetTop > layer.clientHeight - 44) w.style.top = Math.max(4, layer.clientHeight - 80) + "px";
      });
    });
  }

  return { init: init, open: open, close: close, hook: hook, focus: focus, isOpen: function (id) { return !!openWins[id]; } };
})();

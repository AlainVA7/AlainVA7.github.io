/* ═══════════════════════════════════════════
   Deskroom — main: boot, reloj, arranque
   ═══════════════════════════════════════════ */
"use strict";

(function () {
  window.__bootTime = Date.now();

  /* ——— preferencias guardadas ——— */
  function applyPrefs() {
    var root = document.documentElement;
    try {
      var q = new URLSearchParams(location.search).get("motion");
      var m = q || localStorage.getItem("alain.motion");
      if (m) { root.dataset.motion = m; try { localStorage.setItem("alain.motion", m); } catch (e) {} }
    } catch (e) {}
  }

  /* ——— reloj de la barra superior ——— */
  function startClock() {
    var el = document.getElementById("clock");
    if (!el) return;
    function tick() {
      var now = new Date();
      var loc = Lang.lang === "en" ? "en-US" : "es-ES";
      try {
        el.textContent = now.toLocaleDateString(loc, { weekday: "short", month: "short", day: "numeric" }) +
          "  " + now.toLocaleTimeString(loc, { hour: "2-digit", minute: "2-digit" });
      } catch (e) {
        el.textContent = now.toISOString().slice(0, 16).replace("T", " ");
      }
      el.setAttribute("datetime", now.toISOString());
    }
    tick();
    setInterval(tick, 15000);
  }

  /* ——— conmutador ES/EN de la barra ——— */
  function wireLangSwitch() {
    document.querySelectorAll(".lang-btn").forEach(function (b) {
      b.addEventListener("click", function () { Lang.set(b.dataset.lang); });
    });
    document.addEventListener("langchange", function () { applyI18n(document); });
  }

  /* ——— secuencia de boot ——— */
  function boot() {
    var bootEl = document.getElementById("boot");
    var fill = document.getElementById("bootFill");
    var desktop = document.getElementById("desktop");

    var skip = false;
    try { skip = localStorage.getItem("alain.boot") === "off"; } catch (e) {}
    if (/[?&]skipboot/.test(location.search)) skip = true;

    function finish(instant) {
      if (bootEl.dataset.done) return;
      bootEl.dataset.done = "1";
      bootEl.classList.add("done");
      if (instant) desktop.style.transition = "none";
      desktop.classList.add("on");
      setTimeout(function () { bootEl.style.display = "none"; }, instant ? 30 : 700);
    }

    if (skip) { finish(true); return; }

    var p = 0;
    var iv = setInterval(function () {
      p += Math.random() * 22 + 8;
      if (p >= 100) { p = 100; clearInterval(iv); setTimeout(function () { finish(); }, 260); }
      fill.style.width = p + "%";
    }, 130);

    var skipFn = function () { clearInterval(iv); fill.style.width = "100%"; finish(); };
    bootEl.addEventListener("click", skipFn, { once: true });
    window.addEventListener("keydown", function k(e) {
      window.removeEventListener("keydown", k);
      skipFn();
    });
  }

  /* ——— paneles por URL: alainva7.github.io#projects ——— */
  var APP_IDS = ["about", "projects", "skills", "cv", "contact", "settings"];
  function openFromHash() {
    var id = (location.hash || "").replace("#", "").toLowerCase();
    if (APP_IDS.indexOf(id) !== -1) WM.open(id);
  }
  window.addEventListener("hashchange", openFromHash);

  /* ——— arranque ——— */
  document.addEventListener("DOMContentLoaded", function () {
    applyPrefs();
    applyI18n(document);
    startClock();
    wireLangSwitch();
    WM.init();
    Apps.init();
    boot();
    setTimeout(openFromHash, 60);
  });
})();

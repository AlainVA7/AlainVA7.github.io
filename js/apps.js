/* ═══════════════════════════════════════════
   Deskroom — Apps: proyectos, skills, contacto,
   ajustes (sobre mí y CV son estáticos en index.html)
   ═══════════════════════════════════════════ */
"use strict";

var Apps = (function () {
  var state = {
    projects: [],
    knownNames: null,   // nombres ya vistos (para detectar "nuevos")
    updated: null,
    filter: "all",
    search: "",
    refreshTimer: null
  };

  /* ─────────── PROYECTOS ─────────── */
  function loadProjects(first) {
    var grid = document.getElementById("projGrid");
    if (!grid) return Promise.resolve();
    if (first && !grid.children.length) {
      grid.innerHTML = '<div class="proj-loading" style="grid-column:1/-1"><span class="spinner"></span><span>' + Lang.t("proj.loading") + '</span></div>';
    }
    return fetch("projects.json?cb=" + Date.now(), { cache: "no-store" })
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (data) {
        var list = Array.isArray(data.projects) ? data.projects : [];
        var fresh = state.knownNames === null;
        var prev = state.knownNames || {};
        var now = {};
        list.forEach(function (p) { now[p.name] = true; });
        state.projects = list;
        state.updated = data.updated || null;
        /* detectar recién llegados para animación + badge */
        list.forEach(function (p) { p._new = !fresh && !prev[p.name]; });
        state.knownNames = now;
        renderFilters();
        renderProjects(false);
        renderMeta();
      })
      .catch(function () {
        if (first && grid) {
          grid.innerHTML = '<div class="proj-empty"><b>' + Lang.t("proj.none") + '</b>' + Lang.t("proj.noneHint") + "</div>";
        }
      });
  }

  function renderMeta() {
    var meta = document.getElementById("projMeta");
    if (!meta) return;
    meta.innerHTML = "<span><b>" + state.projects.length + "</b> " +
      Lang.t(state.projects.length === 1 ? "proj.repos.one" : "proj.repos") + "</span>" +
      (state.updated ? "<span>" + Lang.t("proj.updated") + " " + fmtDate(state.updated) + "</span>" : "");
  }

  function visibleProjects() {
    var q = state.search.trim().toLowerCase();
    return state.projects.filter(function (p) {
      if (state.filter !== "all" && (p.language || "") !== state.filter) return false;
      if (!q) return true;
      return ((p.name || "") + " " + (p.description || "") + " " + (p.language || "") + " " + (p.topics || []).join(" "))
        .toLowerCase().indexOf(q) !== -1;
    });
  }

  function renderFilters() {
    var box = document.getElementById("projFilters");
    if (!box) return;
    var langs = {};
    state.projects.forEach(function (p) { if (p.language) langs[p.language] = (langs[p.language] || 0) + 1; });
    var keys = Object.keys(langs).sort(function (a, b) { return langs[b] - langs[a]; });
    var html = '<button class="filter-btn' + (state.filter === "all" ? " active" : "") + '" data-f="all" type="button">' + Lang.t("proj.all") + "</button>";
    keys.forEach(function (l) {
      html += '<button class="filter-btn' + (state.filter === l ? " active" : "") + '" data-f="' + l + '" type="button">' + l + "</button>";
    });
    box.innerHTML = html;
    box.querySelectorAll(".filter-btn").forEach(function (b) {
      b.addEventListener("click", function () {
        state.filter = b.dataset.f;
        renderFilters();
        renderProjects(true);
      });
    });
  }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function renderProjects(animate) {
    var grid = document.getElementById("projGrid");
    if (!grid) return;
    var list = visibleProjects();
    if (!list.length) {
      var hasAny = state.projects.length > 0;
      grid.innerHTML = '<div class="proj-empty"><b>' +
        (hasAny ? Lang.t("proj.noMatch") : Lang.t("proj.none")) + "</b>" +
        (hasAny ? Lang.t("proj.noMatchHint") : Lang.t("proj.noneHint")) + "</div>";
      return;
    }
    grid.innerHTML = "";
    list.forEach(function (p, i) {
      var color = LANG_COLORS[p.language] || "#8b949e";
      var a = document.createElement("a");
      a.className = "pcard" + (p._new ? " entering" : "");
      a.href = p.url || ("https://github.com/" + USER.username + "/" + p.name);
      a.target = "_blank";
      a.rel = "noopener";
      a.style.setProperty("--lang-c", color);
      if (animate || p._new) a.style.animationDelay = Math.min(i * 55, 500) + "ms";
      a.innerHTML =
        (p._new ? '<span class="pcard-new">new</span>' : "") +
        '<div class="pcard-top"><span class="pcard-name">' + esc(p.name) + '</span><span class="pcard-ext">↗</span></div>' +
        '<p class="pcard-desc' + (p.description ? "" : " empty") + '">' +
          esc(p.description || (Lang.lang === "en" ? "No description." : "Sin descripción.")) + "</p>" +
        '<div class="pcard-foot">' +
          (p.language ? '<span class="pcard-lang"><span class="lang-dot"></span>' + esc(p.language) + "</span>" : "") +
          (p.stars ? '<span class="pcard-stat">★ ' + p.stars + "</span>" : "") +
          (p.updatedAt ? '<span class="pcard-stat">' + fmtDate(p.updatedAt, { month: "short", day: "numeric" }) + "</span>" : "") +
        "</div>";
      grid.appendChild(a);
    });
    /* limpiar badge "new" tras un rato */
    setTimeout(function () {
      state.projects.forEach(function (p) { p._new = false; });
    }, 12000);
  }

  /* Auto-refresh cada 5 min: trae proyectos y anima solo los nuevos */
  function startAutoRefresh() {
    if (state.refreshTimer) clearInterval(state.refreshTimer);
    state.refreshTimer = setInterval(function () {
      if (WM.isOpen("projects")) loadProjects(false);
      else {
        /* mantener conocidos al día en segundo plano sin render */
        fetch("projects.json?cb=" + Date.now(), { cache: "no-store" })
          .then(function (r) { return r.json(); })
          .then(function (data) {
            var prev = state.knownNames || {};
            var now = {};
            (data.projects || []).forEach(function (p) { now[p.name] = true; if (!prev[p.name] && state.knownNames) p._new = true; });
            state.projects = data.projects || [];
            state.knownNames = now;
          })
          .catch(function () {});
      }
    }, 5 * 60 * 1000);
  }

  function initProjects(win) {
    var search = win.querySelector("#projSearch");
    if (search) {
      search.addEventListener("input", function () {
        state.search = search.value;
        renderProjects(true);
      });
    }
    loadProjects(true);
  }

  /* ─────────── SKILLS ─────────── */
  function renderSkills(win) {
    var box = win.querySelector("#skillList");
    if (!box) return;
    box.innerHTML = "";
    SKILLS.forEach(function (s, i) {
      var row = document.createElement("div");
      row.className = "skill-row";
      row.innerHTML =
        '<div class="skill-head"><span class="skill-name">' + esc(s.name[Lang.lang] || s.name.es) + "</span>" +
        '<span class="skill-lvl">' + s.level + "%</span></div>" +
        '<div class="skill-track"><div class="skill-fill" style="--i:' + i + '" data-w="' + s.level + '"></div></div>';
      box.appendChild(row);
    });
    /* cascada: primero las filas, luego las barras (sin depender de rAF) */
    void box.offsetWidth;
    box.querySelectorAll(".skill-fill").forEach(function (f) { f.style.width = f.dataset.w + "%"; });
  }

  /* ─────────── CONTACTO ─────────── */
  function initContact(win) {
    var btn = win.querySelector("#copyMail");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var label = win.querySelector("#copyMailLabel");
      var done = function () {
        btn.classList.add("copied");
        var old = label.textContent;
        label.textContent = Lang.t("contact.copied");
        setTimeout(function () {
          btn.classList.remove("copied");
          label.textContent = USER.email;
        }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(USER.email).then(done, fallback);
      } else fallback();
      function fallback() {
        var ta = document.createElement("textarea");
        ta.value = USER.email; document.body.appendChild(ta); ta.select();
        try { document.execCommand("copy"); } catch (e) {}
        ta.remove(); done();
      }
    });
  }

  /* ─────────── AJUSTES ─────────── */
  function initSettings(win) {
    var root = document.documentElement;

    function seg(id, val, onPick) {
      var box = win.querySelector(id);
      if (!box) return;
      box.querySelectorAll("button").forEach(function (b) {
        b.classList.toggle("active", b.dataset.val === val);
        b.onclick = function () {
          box.querySelectorAll("button").forEach(function (x) { x.classList.remove("active"); });
          b.classList.add("active");
          onPick(b.dataset.val);
        };
      });
    }

    seg("#segTheme", root.dataset.theme, function (v) {
      try { localStorage.setItem("alain.theme", v); } catch (e) {}
      root.dataset.theme = v;
    });
    seg("#segLang", Lang.lang, function (v) { Lang.set(v); });

    /* walls */
    var walls = win.querySelector("#wallPick");
    if (walls) {
      walls.querySelectorAll(".wall").forEach(function (b) {
        b.classList.toggle("active", b.dataset.val === root.dataset.wall);
        b.onclick = function () {
          walls.querySelectorAll(".wall").forEach(function (x) { x.classList.remove("active"); });
          b.classList.add("active");
          root.dataset.wall = b.dataset.val;
          try { localStorage.setItem("alain.wall", b.dataset.val); } catch (e) {}
        };
      });
    }

    /* motion */
    var motion = win.querySelector("#setMotion");
    if (motion) {
      var off = root.dataset.motion === "off";
      motion.checked = !off;
      motion.onchange = function () {
        root.dataset.motion = motion.checked ? "on" : "off";
        try { localStorage.setItem("alain.motion", motion.checked ? "on" : "off"); } catch (e) {}
      };
    }
    /* boot */
    var boot = win.querySelector("#setBoot");
    if (boot) {
      var hide = localStorage.getItem("alain.boot") === "off";
      boot.checked = !hide;
      boot.onchange = function () {
        try { localStorage.setItem("alain.boot", boot.checked ? "on" : "off"); } catch (e) {}
      };
    }
  }

  /* ─────────── registro de hooks ─────────── */
  function init() {
    WM.hook("projects", initProjects);
    WM.hook("skills", renderSkills);
    WM.hook("contact", initContact);
    WM.hook("settings", initSettings);
    startAutoRefresh();
    /* carga inicial en segundo plano para tener datos listos */
    loadProjects(false).then(function () {
      if (state.projects.length && state.knownNames) {
        /* primera carga real ya hecha: quitar "_new" residual */
        state.projects.forEach(function (p) { p._new = false; });
      }
    });

    /* re-render al cambiar idioma si están abiertas */
    var TITLES = { about: "app.about", projects: "app.projects", skills: "app.skills", cv: "app.cv", contact: "app.contact", settings: "app.settings" };
    document.addEventListener("langchange", function () {
      if (WM.isOpen("projects")) { renderFilters(); renderProjects(false); renderMeta(); }
      if (WM.isOpen("skills")) renderSkills(openWin("skills"));
      document.querySelectorAll(".panel .panel-title-txt").forEach(function (el) {
        var p = el.closest(".panel");
        el.textContent = Lang.t(TITLES[p.dataset.app] || "");
      });
    });
  }

  function openWin(appId) { return document.querySelector('.panel[data-app="' + appId + '"]'); }

  return { init: init, loadProjects: loadProjects };
})();

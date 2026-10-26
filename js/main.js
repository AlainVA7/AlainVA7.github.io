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

  /* ——— HUD: actividad de GitHub + Chismografía Técnica ——— */
  var REPO = USER.username + "/" + USER.username + ".github.io";

  var GH_ICON = {
    push: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>',
    create: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 3.5l2.6 5.3 5.9.8-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.8z"/></svg>',
    fork: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="6" cy="5" r="2.2"/><circle cx="18" cy="5" r="2.2"/><circle cx="12" cy="19" r="2.2"/><path d="M6 7.2v2.4a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V7.2M12 12.6v4.2"/></svg>',
    dot: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="4"/></svg>'
  };

  var DESERT_SCENE =
    '<svg class="desert-bg" viewBox="0 0 240 96" shape-rendering="crispEdges" aria-hidden="true">' +
      '<rect width="240" height="14" fill="#8f5bd6"/>' +
      '<rect y="14" width="240" height="10" fill="#b95fbf"/>' +
      '<rect y="24" width="240" height="10" fill="#e26a9a"/>' +
      '<rect y="34" width="240" height="10" fill="#f07e83"/>' +
      '<rect y="44" width="240" height="8" fill="#f79b6c"/>' +
      '<rect y="52" width="240" height="6" fill="#fbbd6b"/>' +
      '<rect y="58" width="240" height="4" fill="#ffe08a"/>' +
      '<g fill="#ffe28a"><rect x="142" y="36" width="16" height="2"/><rect x="138" y="38" width="24" height="4"/><rect x="136" y="42" width="28" height="6"/><rect x="134" y="48" width="32" height="2"/></g>' +
      '<g fill="#fff3c4"><rect x="142" y="40" width="16" height="2"/><rect x="140" y="42" width="20" height="6"/><rect x="138" y="48" width="24" height="2"/></g>' +
      '<polygon points="0,62 34,26 52,34 74,18 108,62" fill="#9c4036"/>' +
      '<polygon points="52,34 74,18 108,62 74,62" fill="#7a2e2b"/>' +
      '<polygon points="0,62 34,26 52,34 40,62" fill="#b5543c"/>' +
      '<polygon points="150,62 164,46 186,46 200,62" fill="#8a352f"/>' +
      '<polygon points="186,46 208,50 240,50 240,62 200,62" fill="#6f2a28"/>' +
      '<rect y="60" width="240" height="36" fill="#e8933f"/>' +
      '<rect y="60" width="240" height="6" fill="#f4b45c"/>' +
      '<rect y="66" width="240" height="4" fill="#dd8636"/>' +
      '<rect y="78" width="240" height="4" fill="#c9762f"/>' +
      '<rect y="86" width="240" height="10" fill="#b76628"/>' +
      '<path d="M0 72h26v2H0zM40 70h18v2H40zM96 74h30v2H96zM150 72h22v2h-22zM196 76h44v2h-44z" fill="#c9762f"/>' +
      '<g fill="#17877f">' +
        '<rect x="214" y="42" width="8" height="26"/>' +
        '<rect x="206" y="50" width="8" height="4"/><rect x="206" y="54" width="4" height="6"/>' +
        '<rect x="214" y="46" width="12" height="4"/><rect x="222" y="50" width="4" height="8"/>' +
      '</g>' +
      '<g fill="#22a89c">' +
        '<rect x="214" y="42" width="4" height="26"/>' +
        '<rect x="206" y="50" width="4" height="4"/>' +
        '<rect x="222" y="46" width="4" height="4"/>' +
      '</g>' +
      '<g fill="#17877f"><rect x="34" y="72" width="4" height="12"/><rect x="30" y="77" width="4" height="5"/><rect x="38" y="75" width="4" height="7"/></g>' +
      '<g fill="#6f2a28"><rect x="86" y="82" width="10" height="4"/><rect x="160" y="84" width="14" height="3"/><rect x="16" y="86" width="8" height="3"/></g>' +
    '</svg>';

  var TUMBLEWEED =
    '<svg viewBox="0 0 24 24" shape-rendering="crispEdges" aria-hidden="true">' +
      '<g fill="none" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M4 13C6 6 14 4 18 9c3 4-1 10-6 10S4 15 6 11c2-4 7-5 10-2 3 3 0 7-4 7-3 0-4-3-2-5" stroke="#6b4218" stroke-width="1.2"/>' +
        '<path d="M3 10c5 2 12 6 17 2M5 16c4-6 8-10 14-8M7 5c3 7 5 13 9 13M10 3c-1 6 2 12 8 14M4 8c6 1 12 0 16 7" stroke="#7d4e1c" stroke-width="1.1"/>' +
        '<path d="M8 19c-1-4 1-8 4-10 2-2 5-2 6 0M11 4c3 1 6 4 6 8" stroke="#8f5c24" stroke-width="1"/>' +
      '</g>' +
    '</svg>';

  function fmtTpl(key, data) {
    return Lang.t(key).replace(/\{(\w+)\}/g, function (m, k) {
      return data && data[k] != null ? data[k] : m;
    });
  }

  function relTime(iso) {
    var diff = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
    if (!isFinite(diff) || diff < 1) return Lang.t("gh.now");
    if (diff < 60) return fmtTpl("gh.min", { n: diff });
    var h = Math.round(diff / 60);
    if (h < 24) return fmtTpl("gh.hour", { n: h });
    return fmtTpl("gh.day", { n: Math.round(h / 24) });
  }

  function cachedJSON(key, ttl, url) {
    try {
      var raw = localStorage.getItem(key);
      if (raw) {
        var o = JSON.parse(raw);
        if (o && Date.now() - o.t < ttl) return Promise.resolve(o.v);
      }
    } catch (e) {}
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    }).then(function (v) {
      try { localStorage.setItem(key, JSON.stringify({ t: Date.now(), v: v })); } catch (e) {}
      return v;
    });
  }

  function el(tag, cls) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    return n;
  }

  function eventInfo(ev) {
    var repo = ev.repo ? ev.repo.name.split("/").pop() : "";
    var p = ev.payload || {};
    switch (ev.type) {
      case "PushEvent": {
        var n = (p.commits || []).length || p.size || 1;
        return { icon: "push", html: (n === 1 ? Lang.t("gh.push1") : fmtTpl("gh.push", { n: n })) + " <b>" + repo + "</b>" };
      }
      case "CreateEvent":
        if (p.ref_type === "repository") return { icon: "create", html: Lang.t("gh.createRepo") + " <b>" + repo + "</b>" };
        if (p.ref_type === "tag") return { icon: "create", html: fmtTpl("gh.createTag", { ref: p.ref || "" }) + " <b>" + repo + "</b>" };
        return { icon: "create", html: fmtTpl("gh.createBranch", { ref: p.ref || "" }) + " <b>" + repo + "</b>" };
      case "WatchEvent":
        return { icon: "star", html: Lang.t("gh.star") + " <b>" + repo + "</b>" };
      case "ForkEvent":
        return { icon: "fork", html: Lang.t("gh.fork") + " <b>" + repo + "</b>" };
      case "IssuesEvent":
        return { icon: "dot", html: Lang.t("gh.issue") + " <b>" + repo + "</b>" };
      case "PullRequestEvent":
        return { icon: "fork", html: Lang.t("gh.pr") + " <b>" + repo + "</b>" };
      case "ReleaseEvent":
        return { icon: "star", html: fmtTpl("gh.release", { ref: p.release ? p.release.tag_name : "" }) + " <b>" + repo + "</b>" };
      case "PublicEvent":
        return { icon: "dot", html: Lang.t("gh.public") + " <b>" + repo + "</b>" };
      default:
        return { icon: "dot", html: Lang.t("gh.other") + " <b>" + repo + "</b>" };
    }
  }

  function renderEvents(list) {
    var ul = document.getElementById("ghEvents");
    if (!ul) return;
    ul.textContent = "";
    if (!list || !list.length) {
      var empty = el("li", "gh-empty");
      empty.textContent = Lang.t("gh.none");
      ul.appendChild(empty);
      return;
    }
    list.forEach(function (ev) {
      var info = eventInfo(ev);
      var li = el("li", "gh-item");
      var ico = el("span", "gh-ico");
      ico.innerHTML = GH_ICON[info.icon] || GH_ICON.dot;
      var body = el("div");
      var txt = el("p", "gh-text");
      txt.innerHTML = info.html;
      var time = el("time", "gh-time");
      time.dateTime = ev.created_at;
      time.textContent = relTime(ev.created_at);
      body.appendChild(txt);
      body.appendChild(time);
      li.appendChild(ico);
      li.appendChild(body);
      ul.appendChild(li);
    });
  }

  function tumbleEmpty() {
    var wrap = el("div", "chisme-empty");
    var desert = el("div", "desert");
    desert.innerHTML = DESERT_SCENE + '<span class="tumble"><span class="tumble-hop">' + TUMBLEWEED + '</span></span>';
    var p = el("p");
    p.textContent = Lang.t("chisme.empty");
    wrap.appendChild(desert);
    wrap.appendChild(p);
    return wrap;
  }

  function renderChismes(issues) {
    var body = document.getElementById("chismeBody");
    if (!body) return;
    body.textContent = "";
    var cutoff = Date.now() - 15 * 24 * 60 * 60 * 1000;
    var list = (issues || []).filter(function (i) {
      return !i.pull_request && new Date(i.created_at).getTime() >= cutoff;
    });
    if (!list.length) {
      body.appendChild(tumbleEmpty());
      return;
    }
    var row = el("div", "chisme-list");
    list.forEach(function (issue) {
      var a = el("a", "chisme-item");
      a.href = issue.html_url;
      a.target = "_blank";
      a.rel = "noopener";
      var h = el("h3");
      h.textContent = issue.title || "";
      var p = el("p");
      var text = (issue.body || "").replace(/\s+/g, " ").trim();
      p.textContent = text || Lang.t("chisme.notext");
      var t = el("time");
      t.dateTime = issue.created_at;
      t.textContent = fmtDate(issue.created_at);
      a.appendChild(h);
      a.appendChild(p);
      a.appendChild(t);
      row.appendChild(a);
    });
    body.appendChild(row);
  }

  function loadFeeds() {
    cachedJSON("alain.gh.events", 10 * 60 * 1000,
      "https://api.github.com/users/" + USER.username + "/events/public?per_page=12")
      .then(function (evs) { renderEvents((evs || []).slice(0, 6)); })
      .catch(function () { renderEvents(null); });

    cachedJSON("alain.gh.chismes", 5 * 60 * 1000,
      "https://api.github.com/repos/" + REPO + "/issues?labels=chisme&state=open&per_page=20&sort=created&direction=desc")
      .then(renderChismes)
      .catch(function () { renderChismes([]); });
  }

  function initFeeds() {
    loadFeeds();
    document.addEventListener("langchange", loadFeeds);
    setInterval(loadFeeds, 10 * 60 * 1000);
  }

  /* ——— arranque ——— */
  document.addEventListener("DOMContentLoaded", function () {
    applyPrefs();
    applyI18n(document);
    startClock();
    wireLangSwitch();
    WM.init();
    Apps.init();
    initFeeds();
    boot();
    setTimeout(openFromHash, 60);
  });
})();

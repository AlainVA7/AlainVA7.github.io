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

  var TUMBLEWEED =
    '<svg viewBox="0 0 16 16" shape-rendering="crispEdges" aria-hidden="true">' +
      '<g fill="#a8792f">' +
        '<rect x="6" y="3" width="4" height="1"/>' +
        '<rect x="4" y="4" width="2" height="1"/><rect x="10" y="4" width="2" height="1"/>' +
        '<rect x="3" y="5" width="1" height="1"/><rect x="12" y="5" width="1" height="1"/>' +
        '<rect x="2" y="6" width="1" height="5"/><rect x="13" y="6" width="1" height="5"/>' +
        '<rect x="3" y="10" width="1" height="1"/><rect x="12" y="10" width="1" height="1"/>' +
        '<rect x="4" y="11" width="2" height="1"/><rect x="10" y="11" width="2" height="1"/>' +
        '<rect x="6" y="12" width="4" height="1"/>' +
      '</g>' +
      '<g fill="#c99a4a">' +
        '<rect x="6" y="5" width="2" height="1"/><rect x="9" y="6" width="2" height="1"/>' +
        '<rect x="4" y="7" width="3" height="1"/><rect x="9" y="8" width="3" height="1"/>' +
        '<rect x="5" y="9" width="2" height="1"/><rect x="7" y="10" width="3" height="1"/>' +
        '<rect x="8" y="4" width="1" height="1"/>' +
      '</g>' +
      '<g fill="#7d5620">' +
        '<rect x="7" y="7" width="2" height="2"/><rect x="5" y="8" width="1" height="1"/>' +
        '<rect x="10" y="9" width="1" height="1"/>' +
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
    desert.innerHTML = '<span class="tumble"><span class="tumble-hop">' + TUMBLEWEED + '</span></span>';
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

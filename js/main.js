/* ═══════════════════════════════════════════
   Deskroom — main: reloj, HUD y arranque
   ═══════════════════════════════════════════ */
"use strict";

(function () {
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

  /* ——— paneles por URL: alainva7.github.io#projects ——— */
  var APP_IDS = ["about", "projects", "skills", "cv", "contact", "settings"];
  function openFromHash() {
    var id = (location.hash || "").replace("#", "").toLowerCase();
    if (APP_IDS.indexOf(id) !== -1) WM.open(id);
  }
  window.addEventListener("hashchange", openFromHash);

  /* ——— HUD: actividad de GitHub + Notas técnicas ——— */
  var REPO = USER.username + "/" + USER.username + ".github.io";
  var activityState = { expanded: false, projects: [], commits: [] };

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

  var TUMBLE_COLORS = { d: "#5a3a14", m: "#7a4e1c", l: "#9a6626", h: "#b98233" };
  var TUMBLE_MAP = [
    "...............l............",
    ".............l..............",
    ".........l..................",
    ".........llll...lll.........",
    "........lll.lllllll.........",
    "......ll.ll.lll...llll......",
    ".....l.llll...lllll.lll.....",
    "....lllll.llll.lllll..l.....",
    "....lllll...llll..lllllll...",
    "...llll.l.....ll.l.ll.lll...",
    "...mm.mh..hmm.mh.mm.h.m..m..",
    "...mmm....mmmm.m..m..m...m..",
    ".....mmm..mh.h..mmhmmm.mhm..",
    "....mmmm.mm.hh.m.hm.mm......",
    "....mmmm.m..mmmh.mmmm.mm.m..",
    "....h.mm..hmmm.hm.mmmm.m.mm.",
    "....mmh..hmmm..mm.mh.m.mm...",
    "...m.m.mhmmmm.mm.mmm.h.mm...",
    ".m..m.mm.mhm.m.m.mm...m.....",
    "....ddddd.....ddd.ddd..dd..d",
    ".....dddd.d.dd.d..ddd.dd....",
    ".....ddddd..d.dd..d....d....",
    "......ddddd.dd.d.d..........",
    ".......d..d.d.dd..ddd.......",
    "........ddd.dd.d..d.........",
    "...........ddddd...d........",
    ".........d..................",
    "............d..............."
  ];

  function tumbleweedSvg() {
    var out = '<svg viewBox="0 0 28 28" shape-rendering="crispEdges" aria-hidden="true">';
    TUMBLE_MAP.forEach(function (row, y) {
      var x = 0;
      while (x < row.length) {
        var c = row[x];
        if (c === ".") { x++; continue; }
        var w = 1;
        while (x + w < row.length && row[x + w] === c) w++;
        out += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="1" fill="' + (TUMBLE_COLORS[c] || TUMBLE_COLORS.m) + '"/>';
        x += w;
      }
    });
    return out + "</svg>";
  }

  var TUMBLEWEED = tumbleweedSvg();

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
    var stale = null;
    try {
      var raw = localStorage.getItem(key);
      if (raw) {
        var o = JSON.parse(raw);
        if (o && Date.now() - o.t < ttl) return Promise.resolve(o.v);
        if (o) stale = o.v;
      }
    } catch (e) {}
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    }).then(function (v) {
      try { localStorage.setItem(key, JSON.stringify({ t: Date.now(), v: v })); } catch (e) {}
      return v;
    }).catch(function (err) {
      if (stale !== null) return stale;
      throw err;
    });
  }

  function el(tag, cls) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    return n;
  }

  function collectActivity(events, data) {
    var meta = {};
    ((data && data.projects) || []).forEach(function (p) { meta[p.name] = p; });

    var seen = {};
    var projects = [];
    var pushed = [];

    (events || []).forEach(function (ev) {
      if (!ev || !ev.repo) return;
      var full = ev.repo.name;
      var repo = full.split("/").pop();
      var p = ev.payload || {};
      var at = ev.created_at;

      if (ev.type === "PushEvent") {
        if (pushed.indexOf(full) === -1) pushed.push(full);
        if (!seen[full]) {
          seen[full] = true;
          projects.push({ name: repo, fullName: full, at: at, kind: "pushed", url: "https://github.com/" + full });
        }
      } else if (ev.type === "PullRequestEvent" && p.action === "closed" &&
                 p.pull_request && p.pull_request.merged) {
        if (!seen[full]) {
          seen[full] = true;
          projects.push({
            name: repo,
            fullName: full,
            at: at,
            kind: "merged",
            url: p.pull_request.html_url || ("https://github.com/" + full)
          });
        }
      }
    });

    if (!projects.length) {
      projects = ((data && data.projects) || []).slice(0, 4).map(function (p) {
        return {
          name: p.name,
          fullName: USER.username + "/" + p.name,
          at: p.updatedAt,
          kind: "pushed",
          url: p.url
        };
      });
    }

    projects = projects.slice(0, 4).map(function (p) {
      var m = meta[p.name] || {};
      var owner = (p.fullName || "").split("/")[0];
      p.description = m.description || "";
      if (!p.description && owner && owner.toLowerCase() !== USER.username.toLowerCase()) {
        p.description = fmtTpl("activity.orgRepo", { org: owner });
      }
      p.language = m.language || null;
      p.at = p.at || m.updatedAt;
      p.url = p.url || m.url || ("https://github.com/" + p.fullName);
      return p;
    });

    return { projects: projects, pushed: pushed.slice(0, 3) };
  }

  function renderActivityProjects() {
    var box = document.getElementById("recentProjects");
    if (!box) return;
    box.textContent = "";
    if (!activityState.projects.length) {
      var empty = el("p", "hud-empty");
      empty.textContent = Lang.t("activity.none");
      box.appendChild(empty);
      return;
    }
    activityState.projects.forEach(function (p) {
      var a = el("a", "apcard");
      a.href = p.url;
      a.target = "_blank";
      a.rel = "noopener";
      if (p.language) a.style.setProperty("--lang-c", LANG_COLORS[p.language] || "#8b949e");

      var top = el("span", "apcard-top");
      var name = el("span", "apcard-name");
      name.textContent = p.name;
      var badge = el("span", "apcard-badge " + p.kind);
      badge.textContent = Lang.t("activity." + p.kind);
      top.appendChild(name);
      top.appendChild(badge);

      var desc = el("p", "apcard-desc");
      desc.textContent = p.description || Lang.t("activity.noDesc");

      var foot = el("span", "apcard-foot");
      if (p.language) {
        var lang = el("span", "apcard-lang");
        var dot = el("span", "lang-dot");
        lang.appendChild(dot);
        lang.appendChild(document.createTextNode(p.language));
        foot.appendChild(lang);
      }
      if (p.at) {
        var time = el("time", "apcard-time");
        time.dateTime = p.at;
        time.textContent = relTime(p.at);
        foot.appendChild(time);
      }

      a.appendChild(top);
      a.appendChild(desc);
      a.appendChild(foot);
      box.appendChild(a);
    });
  }

  function renderActivityCommits() {
    var ul = document.getElementById("recentCommits");
    if (!ul) return;
    ul.textContent = "";

    var list = activityState.commits;
    var shown = activityState.expanded ? list : list.slice(0, 3);

    if (!list.length) {
      var empty = el("li", "hud-empty");
      empty.textContent = Lang.t("activity.none");
      ul.appendChild(empty);
    }

    shown.forEach(function (c) {
      var li = el("li", "commit-item");
      var dot = el("span", "commit-dot");
      dot.setAttribute("aria-hidden", "true");

      var body = el("div", "commit-body");
      var msg = el("p", "commit-msg");
      msg.textContent = c.message || Lang.t("activity.noMessage");
      var meta = el("span", "commit-meta");
      var repo = el("b");
      repo.textContent = c.repo;
      meta.appendChild(repo);
      meta.appendChild(document.createTextNode(" · "));
      var time = el("time");
      time.dateTime = c.at;
      time.textContent = relTime(c.at);
      meta.appendChild(time);

      body.appendChild(msg);
      body.appendChild(meta);
      li.appendChild(dot);
      li.appendChild(body);
      ul.appendChild(li);
    });

    var btn = document.getElementById("commitsMore");
    if (btn) {
      btn.hidden = list.length <= 3;
      btn.textContent = Lang.t(activityState.expanded ? "activity.less" : "activity.more");
      btn.setAttribute("aria-expanded", activityState.expanded ? "true" : "false");
    }
  }

  function loadCommits(repos) {
    if (!repos || !repos.length) repos = [REPO];

    var requests = repos.slice(0, 3).map(function (full) {
      return cachedJSON("alain.commits." + full, 5 * 60 * 1000,
        "https://api.github.com/repos/" + full + "/commits?per_page=3")
        .then(function (list) {
          return (list || []).map(function (c) {
            var commit = c.commit || {};
            var author = commit.author || {};
            return {
              repo: full.split("/").pop(),
              message: (commit.message || "").split("\n")[0],
              at: author.date || commit.committer && commit.committer.date || null,
              url: c.html_url
            };
          });
        })
        .catch(function () { return []; });
    });

    Promise.all(requests).then(function (parts) {
      var all = [];
      var seen = {};
      parts.forEach(function (list) {
        list.forEach(function (c) {
          if (!c.url || seen[c.url]) return;
          seen[c.url] = true;
          all.push(c);
        });
      });
      all.sort(function (a, b) { return new Date(b.at) - new Date(a.at); });
      activityState.commits = all.slice(0, 8);
      renderActivityCommits();
    });
  }

  function renderActivity(events, data) {
    var a = collectActivity(events, data);
    activityState.projects = a.projects;
    renderActivityProjects();
    loadCommits(a.pushed);
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

  function loadActivity() {
    var events = cachedJSON("alain.gh.events", 10 * 60 * 1000,
      "https://api.github.com/users/" + USER.username + "/events/public?per_page=30")
      .catch(function () { return []; });

    var projects = cachedJSON("alain.projects", 5 * 60 * 1000, "projects.json")
      .catch(function () { return { projects: [] }; });

    Promise.all([events, projects]).then(function (res) {
      renderActivity(res[0], res[1]);
    });
  }

  function loadChismes() {
    cachedJSON("alain.gh.chismes", 5 * 60 * 1000,
      "https://api.github.com/repos/" + REPO + "/issues?labels=chisme&state=open&per_page=20&sort=created&direction=desc")
      .then(renderChismes)
      .catch(function () { renderChismes([]); });
  }

  function loadFeeds() {
    loadActivity();
    loadChismes();
  }

  function initFeeds() {
    var more = document.getElementById("commitsMore");
    if (more) {
      more.addEventListener("click", function () {
        activityState.expanded = !activityState.expanded;
        renderActivityCommits();
      });
    }
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
    setTimeout(openFromHash, 60);
  });
})();

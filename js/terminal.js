/* ═══════════════════════════════════════════
   AlainOS — Terminal interactiva
   comandos · historial (↑/↓) · autocompletado (Tab)
   ═══════════════════════════════════════════ */
"use strict";

var Terminal = (function () {
  var out, form, input, promptEl;
  var history = [], hIdx = -1, draft = "";
  var greeted = false;

  var NF_ART =
    "      #######\n" +
    "    ###########\n" +
    "   #############\n" +
    "  ####     #####\n" +
    " ####    #  ###\n" +
    " ####       ###\n" +
    " ####    #  ###\n" +
    "  ####     #####\n" +
    "   #############\n" +
    "    ###########";

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function line(html, cls) {
    var p = document.createElement("p");
    p.className = "term-line" + (cls ? " " + cls : "");
    p.innerHTML = html;
    out.appendChild(p);
    out.scrollTop = out.scrollHeight;
    return p;
  }

  function print(text, cls) {
    String(text).split("\n").forEach(function (l) {
      line(esc(l), cls);
    });
  }

  function echoCmd(cmd) {
    line('<span class="term-cmd"><span class="tp">visitor@alainos:~$ </span>' + esc(cmd) + "</span>");
  }

  /* ——— comandos ——— */
  var CMDS = {
    help: function () {
      line('<span class="t-accent">' + esc(Lang.t("term.help.t")) + "</span>");
      Object.keys(CMDS).forEach(function (c) {
        if (c === "help") return;
        line('  <span class="t-ok">' + c.padEnd(11) + "</span><span class=\"t-dim\">" + esc(Lang.t("term.help." + c) || "") + "</span>");
      });
    },
    whoami: function () {
      var rows = [
        [Lang.t("term.whoami.name"), USER.name],
        [Lang.t("term.whoami.user"), USER.username],
        [Lang.t("term.whoami.role"), USER.role[Lang.lang]],
        [Lang.t("term.whoami.loc"), USER.location[Lang.lang]],
        [Lang.t("term.whoami.site"), USER.site]
      ];
      rows.forEach(function (r) {
        line('  <span class="t-accent">' + esc(r[0].padEnd(12)) + '</span><span class="t-ink">' + esc(r[1]) + "</span>");
      });
    },
    neofetch: function () {
      var now = new Date();
      var up = Math.floor((Date.now() - (window.__bootTime || Date.now())) / 1000);
      var upStr = Math.floor(up / 60) + "m " + (up % 60) + "s";
      var info = [
        [Lang.lang === "en" ? "host" : "host", "alainos.github.io"],
        ["user", USER.username],
        ["os", "Web (Browser)"],
        ["shell", "alain-sh 1.0"],
        ["theme", document.documentElement.dataset.theme],
        ["lang", Lang.lang],
        ["uptime", upStr],
        ["date", now.toLocaleString(Lang.lang === "en" ? "en-US" : "es-ES")]
      ];
      var p = document.createElement("p");
      p.className = "term-line";
      var nf = '<div class="neofetch"><pre>' + esc(NF_ART) + '</pre><div class="nf-info">';
      info.forEach(function (r) {
        nf += '<span class="nf-k">' + esc(r[0]) + ':</span><span class="nf-v">' + esc(r[1]) + "</span>";
      });
      nf += "</div></div>";
      p.innerHTML = nf;
      out.appendChild(p);
      out.scrollTop = out.scrollHeight;
    },
    projects: function () {
      var list = Apps && Apps._list ? Apps._list() : null;
      fetch("projects.json?cb=" + Date.now(), { cache: "no-store" })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          var ps = (data && data.projects) || [];
          if (!ps.length) { print(Lang.t("term.projectsEmpty"), "t-dim"); return; }
          ps.slice(0, 12).forEach(function (p) {
            line('  <span class="t-ok">▸</span> <span class="t-accent">' + esc(p.name) + "</span>" +
              (p.language ? ' <span class="t-dim">· ' + esc(p.language) + "</span>" : "") +
              (p.stars ? ' <span class="t-warn">★' + p.stars + "</span>" : ""));
          });
          if (ps.length > 12) line('  <span class="t-dim">… +' + (ps.length - 12) + "</span>");
        })
        .catch(function () { print(Lang.t("term.projectsEmpty"), "t-dim"); });
    },
    open: function (args) {
      var id = (args[0] || "").toLowerCase();
      var valid = ["about", "projects", "skills", "terminal", "blog", "contact", "settings"];
      if (valid.indexOf(id) === -1) { print(Lang.t("term.usage") + ": open <app>", "t-dim"); print(Lang.t("term.openHint"), "t-dim"); return; }
      WM.open(id);
      print("→ " + Lang.t("app." + id), "t-ok");
    },
    skills: function () {
      SKILLS.forEach(function (s) {
        var n = Math.round(s.level / 5);
        var bar = "█".repeat(n) + "░".repeat(20 - n);
        line('  <span class="t-accent">' + esc((s.name[Lang.lang] || s.name.es).padEnd(28)) + '</span>' +
          '<span class="t-ok">' + bar + "</span> " + s.level + "%");
      });
    },
    blog: function () {
      fetch("posts.json?cb=" + Date.now(), { cache: "no-store" })
        .then(function (r) { return r.json(); })
        .then(function (data) {
          var ps = (data && data.posts) || [];
          if (!ps.length) { print(Lang.t("term.blogEmpty"), "t-dim"); return; }
          ps.forEach(function (p) {
            var title = p["title_" + Lang.lang] || p.title_es || p.id;
            line('  <span class="t-ok">▸</span> <span class="t-accent">' + esc(title) + "</span> <span class=\"t-dim\">" + esc(p.date || "") + "</span>");
          });
          print("→ " + Lang.t("app.blog"), "t-dim");
        })
        .catch(function () { print(Lang.t("term.blogEmpty"), "t-dim"); });
    },
    theme: function (args) {
      var v = (args[0] || "").toLowerCase();
      if (v !== "dark" && v !== "light") { print(Lang.t("term.themeUse"), "t-dim"); return; }
      document.documentElement.dataset.theme = v;
      try { localStorage.setItem("alain.theme", v); } catch (e) {}
      print(Lang.t("term.themeSet") + ": " + v, "t-ok");
    },
    lang: function (args) {
      var v = (args[0] || "").toLowerCase();
      if (v !== "es" && v !== "en") { print(Lang.t("term.langUse"), "t-dim"); return; }
      Lang.set(v);
      print(Lang.t("term.langSet") + ": " + v, "t-ok");
    },
    date: function () {
      print(new Date().toLocaleString(Lang.lang === "en" ? "en-US" : "es-ES",
        { dateStyle: "full", timeStyle: "medium" }), "t-ink");
    },
    echo: function (args) { print(args.join(" ") || Lang.t("term.echoEmpty")); },
    cat: function (args) {
      var w = (args[0] || "").toLowerCase();
      if (w === "about") print(ABOUT_TEXT[Lang.lang], "t-ink");
      else { print(Lang.t("term.catHint"), "t-dim"); }
    },
    clear: function () { out.innerHTML = ""; },
    sudo: function (args) {
      print(Lang.t("term.sudo1"), "t-warn");
      setTimeout(function () { print(Lang.t("term.sudo2"), "t-err"); }, 420);
    },
    ls: function (args) {
      if (args[0] === "projects") { CMDS.projects(); return; }
      print("about  projects  skills  blog  contact  settings", "t-accent");
      print(Lang.t("term.openHint"), "t-dim");
    }
  };
  /* alias */
  CMDS.lsProjects = CMDS.projects;

  function complete(prefix) {
    var names = Object.keys(CMDS);
    var apps = ["about", "projects", "skills", "terminal", "blog", "contact", "settings"];
    var pool = prefix.indexOf("open ") === 0 ? apps : names;
    var base = prefix.indexOf("open ") === 0 ? prefix.slice(5) : prefix;
    var m = pool.filter(function (c) { return c.indexOf(base) === 0; });
    if (m.length === 1) {
      var full = prefix.indexOf("open ") === 0 ? "open " + m[0] : m[0];
      input.value = full + (CMDS[m[0]] && prefix.indexOf("open ") !== 0 ? " " : "");
    } else if (m.length > 1) {
      echoCmd(input.value);
      line(m.join("   "), "t-dim");
    }
  }

  function run(raw) {
    var cmd = raw.trim();
    echoCmd(cmd);
    if (!cmd) return;
    history.push(cmd); hIdx = history.length; draft = "";
    var parts = cmd.split(/\s+/);
    var name = parts[0].toLowerCase();
    var args = parts.slice(1);
    if (CMDS[name]) {
      try { CMDS[name](args); } catch (e) { print("error: " + e.message, "t-err"); }
    } else {
      var near = Object.keys(CMDS).filter(function (c) { return c[0] === name[0]; })[0];
      print("alain-sh: " + Lang.t("term.notfound") + ": " + esc(name), "t-err");
      if (near) print("  " + Lang.t("term.didyoumean") + " '" + near + "'?", "t-dim");
      print("  " + Lang.t("term.help.t") + ": help", "t-dim");
    }
  }

  function init(win) {
    out = win.querySelector("#termOut");
    form = win.querySelector("#termForm");
    input = win.querySelector("#termInput");
    promptEl = win.querySelector("#termPrompt");
    if (!out) return;
    out.innerHTML = "";

    if (!greeted) {
      greeted = true;
      print(Lang.t("term.welcome"), "t-ok");
      print(Lang.t("term.hint"), "t-dim");
      line('<span class="t-dim">────────────────────────────────</span>');
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var v = input.value;
      input.value = "";
      run(v);
    });

    input.addEventListener("keydown", function (e) {
      if (e.key === "Tab") {
        e.preventDefault();
        complete(input.value.replace(/\s+$/, ""));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (!history.length) return;
        if (hIdx === history.length) draft = input.value;
        hIdx = Math.max(0, hIdx - 1);
        input.value = history[hIdx];
        setTimeout(function () { input.setSelectionRange(input.value.length, input.value.length); }, 0);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (!history.length) return;
        hIdx = Math.min(history.length, hIdx + 1);
        input.value = hIdx === history.length ? draft : history[hIdx];
      }
    });

    /* foco al clic en la terminal */
    win.querySelector(".terminal-app").addEventListener("click", function (e) {
      if (window.getSelection && String(window.getSelection())) return;
      input.focus();
    });
    setTimeout(function () { input.focus(); }, 480);
  }

  return { init: init, run: run };
})();

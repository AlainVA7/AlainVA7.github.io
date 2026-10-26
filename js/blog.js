/* ═══════════════════════════════════════════
   AlainOS — Blog / Notas
   Lista desde posts.json · lectura markdown
   ═══════════════════════════════════════════ */
"use strict";

var Blog = (function () {
  var posts = [];
  var currentPost = null;
  var pendingPost = null;

  function byId(id) {
    return posts.filter(function (x) { return x.id === id; })[0];
  }

  function init(win) {
    loadIndex().then(function () {
      renderList(win);
      if (pendingPost) {
        var p = byId(pendingPost);
        pendingPost = null;
        if (p) openPost(win, p);
      }
    });
  }

  /* deep-link #blog/<id> */
  document.addEventListener("blogopen", function (e) {
    pendingPost = e.detail;
    var win = document.querySelector('.window[data-app="blog"]');
    if (win && posts.length) {
      var p = byId(pendingPost);
      pendingPost = null;
      if (p) openPost(win, p);
    }
  });

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function loadIndex() {
    return fetch("posts.json?cb=" + Date.now(), { cache: "no-store" })
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (data) {
        posts = (data && data.posts) || [];
        posts.sort(function (a, b) { return String(b.date || "").localeCompare(String(a.date || "")); });
        return posts;
      })
      .catch(function () { posts = []; return posts; });
  }

  function titleOf(p) { return p["title_" + Lang.lang] || p.title_es || p.title_en || p.id; }

  function renderList(win) {
    var list = win.querySelector("#blogList");
    var art = win.querySelector("#blogPost");
    if (!list) return;
    list.hidden = false;
    if (art) { art.hidden = true; art.innerHTML = ""; }
    currentPost = null;

    if (!posts.length) {
      list.innerHTML = '<div class="blog-empty"><b>' + Lang.t("blog.empty") + "</b>" + Lang.t("blog.emptyHint") + "</div>";
      return;
    }
    list.innerHTML = "";
    posts.forEach(function (p, i) {
      var b = document.createElement("button");
      b.className = "bcard";
      b.type = "button";
      b.style.animationDelay = Math.min(i * 60, 420) + "ms";
      var tags = (p.tags || []).map(function (t) { return '<span class="tag">' + esc(t) + "</span>"; }).join("");
      b.innerHTML =
        "<h3>" + esc(titleOf(p)) + "</h3>" +
        '<div class="bcard-meta">' +
          (p.date ? "<span>" + esc(fmtDate(p.date)) + "</span>" : "") +
          (tags ? '<span class="bcard-tags">' + tags + "</span>" : "") +
        "</div>";
      b.addEventListener("click", function () { openPost(win, p); });
      list.appendChild(b);
    });
  }

  /* Render markdown: usa marked si está; si no, plano */
  function md(text) {
    if (window.marked && marked.parse) {
      try { return marked.parse(text, { gfm: true, breaks: false }); } catch (e) {}
    }
    /* fallback mínimo */
    return text.split(/\n{2,}/).map(function (blk) {
      return "<p>" + esc(blk).replace(/\n/g, "<br>") + "</p>";
    }).join("");
  }

  function openPost(win, p) {
    var list = win.querySelector("#blogList");
    var art = win.querySelector("#blogPost");
    if (!art || !p) return;
    currentPost = p.id;
    list.hidden = true;
    art.hidden = false;
    art.innerHTML = '<div class="post-loading"><span class="spinner"></span><span>' + Lang.t("blog.loading") + "</span></div>";

    fetch(p.file, { cache: "no-store" })
      .then(function (r) { if (!r.ok) throw 0; return r.text(); })
      .then(function (raw) {
        /* quitar frontmatter */
        var body = raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "");
        var tags = (p.tags || []).map(function (t) { return '<span class="tag">' + esc(t) + "</span>"; }).join("");
        art.innerHTML =
          '<button class="blog-back" type="button">← ' + esc(Lang.t("blog.back")) + "</button>" +
          '<h1 class="post-title">' + esc(titleOf(p)) + "</h1>" +
          '<div class="post-meta">' +
            (p.date ? "<span>" + esc(fmtDate(p.date, { dateStyle: "long" })) + "</span>" : "") +
            (tags ? '<span class="bcard-tags">' + tags + "</span>" : "") +
          "</div>" +
          '<div class="post-body">' + md(body) + "</div>";
        art.querySelector(".blog-back").addEventListener("click", function () { renderList(win); });
        win.querySelector(".win-body").scrollTop = 0;
      })
      .catch(function () {
        art.innerHTML =
          '<button class="blog-back" type="button">← ' + esc(Lang.t("blog.back")) + "</button>" +
          '<p class="blog-empty">' + esc(Lang.t("blog.error")) + "</p>";
        art.querySelector(".blog-back").addEventListener("click", function () { renderList(win); });
      });
  }

  /* si cambia el idioma y hay lista abierta → re-render */
  document.addEventListener("langchange", function () {
    var win = document.querySelector('.window[data-app="blog"]');
    if (!win) return;
    if (currentPost) {
      var p = posts.filter(function (x) { return x.id === currentPost; })[0];
      if (p) { openPost(win, p); return; }
    }
    renderList(win);
  });

  return { init: init, reload: loadIndex };
})();

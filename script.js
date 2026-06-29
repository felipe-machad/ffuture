/* =========================================================
   FFUTURE.IA — v5 · Terminal + tema claro/escuro
   Leve: CSS + typed.js + JS mínimo. Sem canvas pesado/WebGL.
   ========================================================= */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var root = document.documentElement;

  /* ---------- ano ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- TEMA (claro/escuro) ---------- */
  var cursorColor = [56, 189, 248];
  function readCursorColor() {
    var v = getComputedStyle(root).getPropertyValue("--cur").trim();
    var p = v.split(",").map(function (n) { return parseInt(n, 10); });
    if (p.length === 3 && !p.some(isNaN)) cursorColor = p;
  }
  (function theme() {
    var btn = document.getElementById("themeToggle");
    var glyph = btn && btn.querySelector(".theme__i");
    function paint() {
      var dark = root.getAttribute("data-theme") !== "light";
      if (glyph) glyph.textContent = dark ? "☼" : "☾"; // ícone = ação (ir p/ claro / escuro)
      if (btn) btn.setAttribute("aria-pressed", String(!dark));
      readCursorColor();
    }
    paint();
    if (btn) btn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("ffuture-theme", next); } catch (e) {}
      paint();
    });
    // segue o sistema enquanto o usuário não escolheu manualmente
    var mq = window.matchMedia("(prefers-color-scheme: light)");
    (mq.addEventListener ? mq.addEventListener.bind(mq, "change") : mq.addListener.bind(mq))(function (e) {
      var saved; try { saved = localStorage.getItem("ffuture-theme"); } catch (err) {}
      if (saved !== "light" && saved !== "dark") {
        root.setAttribute("data-theme", e.matches ? "light" : "dark");
        paint();
      }
    });
  })();

  /* ---------- ABERTURA: "F" + FORGE → FOCUS → FORWARD → FFUTURE.IA ---------- */
  (function intro() {
    var el = document.getElementById("intro");
    if (!el) return;
    var skipBtn = document.getElementById("introSkip");
    var line = el.querySelector(".intro__line");
    var suffix = document.getElementById("introSuffix");
    var ia = document.getElementById("introIa");
    var timers = [], done = false;

    function endIntro() {
      if (done) return; done = true;
      timers.forEach(clearTimeout);
      el.classList.add("is-hidden");
      document.body.style.overflow = "";
      setTimeout(function () { el.parentNode && el.parentNode.removeChild(el); }, 500);
    }
    var at = function (ms, fn) { timers.push(setTimeout(fn, ms)); };

    function recenter(animate) {
      if (!line) return;
      if (!animate) line.style.transition = "none";
      line.style.transform = "translate(" + (-line.offsetWidth / 2) + "px, -50%)";
      if (!animate) { void line.offsetWidth; line.style.transition = ""; }
    }
    function showSuffix(text, dir) {
      suffix.classList.remove("is-exit", "from-right", "from-top", "from-left", "from-diag");
      suffix.textContent = text;
      recenter(true);
      void suffix.offsetWidth;
      suffix.classList.add(dir);
    }
    function hideSuffix() {
      suffix.classList.remove("from-right", "from-top", "from-left", "from-diag");
      void suffix.offsetWidth;
      suffix.classList.add("is-exit");
    }
    function dropIa() {
      ia.style.display = "inline-block";
      recenter(true);
      void ia.offsetWidth;
      ia.classList.add("is-drop");
    }

    if (reduce || !line || !suffix || !ia) {
      if (suffix) suffix.textContent = "FUTURE";
      endIntro();
      return;
    }

    document.body.style.overflow = "hidden";
    recenter(false);
    at(780,  function () { showSuffix("orge", "from-right"); });
    at(1580, hideSuffix);
    at(1860, function () { showSuffix("ocus", "from-top"); });
    at(2660, hideSuffix);
    at(2940, function () { showSuffix("orward", "from-left"); });
    at(3740, hideSuffix);
    at(4020, function () { showSuffix("Future", "from-diag"); });
    at(4980, dropIa);
    at(5950, function () { el.classList.add("show-boot"); }); // 2ª parte: boot terminal
    at(7400, endIntro);

    if (skipBtn) skipBtn.addEventListener("click", endIntro);
    el.addEventListener("click", function (e) { if (e.target !== skipBtn) endIntro(); });
    window.addEventListener("keydown", function onKey(e) {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") { endIntro(); window.removeEventListener("keydown", onKey); }
    });
  })();

  /* ---------- reveal on scroll ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- typewriter (typed.js) ---------- */
  (function typewriter() {
    var t = document.getElementById("typed");
    if (!t) return;
    if (reduce || typeof window.Typed !== "function") { t.textContent = "o futuro, em produção ✓"; return; }
    new window.Typed("#typed", {
      strings: ["forge", "focus", "forward", "o seu futuro, em produção ✓"],
      typeSpeed: 55, backSpeed: 26, backDelay: 1400, startDelay: 500,
      loop: true, smartBackspace: true, cursorChar: "▋"
    });
  })();

  /* ---------- tilt 3D nos cards (.tilt) ---------- */
  (function tilt() {
    if (!fine || reduce) return;
    document.querySelectorAll(".tilt").forEach(function (card) {
      var raf = 0;
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        if (raf) return;
        raf = requestAnimationFrame(function () {
          raf = 0;
          card.style.transform = "perspective(900px) rotateX(" + ((0.5 - py) * 6).toFixed(2) + "deg) rotateY(" + ((px - 0.5) * 6).toFixed(2) + "deg)";
          card.style.setProperty("--gx", (px * 100).toFixed(1) + "%");
          card.style.setProperty("--gy", (py * 100).toFixed(1) + "%");
        });
      }, { passive: true });
      card.addEventListener("mouseleave", function () {
        card.style.transform = "";
        card.style.setProperty("--gx", "50%"); card.style.setProperty("--gy", "0%");
      });
    });
  })();

  /* ---------- cursor enxuto (rastro curto + anel, na cor do tema) ---------- */
  (function cursor() {
    if (!fine || reduce) return;
    root.classList.add("has-cur");
    var c = document.createElement("canvas");
    c.className = "cur-fx"; c.setAttribute("aria-hidden", "true");
    document.body.appendChild(c);
    var cx = c.getContext("2d"), w, h;
    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = innerWidth; h = innerHeight; c.width = w * dpr; c.height = h * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize(); window.addEventListener("resize", resize);

    var mouse = { x: innerWidth / 2, y: innerHeight / 2 };
    window.addEventListener("mousemove", function (e) { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });

    var N = 10, trail = [];
    for (var i = 0; i < N; i++) trail.push({ x: mouse.x, y: mouse.y });

    var hover = false;
    var sel = 'a, button, .btn, .act, .num__item, .theme, .marq__group li';
    document.addEventListener("mouseover", function (e) { if (e.target.closest(sel)) hover = true; }, { passive: true });
    document.addEventListener("mouseout", function (e) { if (e.target.closest(sel)) hover = false; }, { passive: true });

    function frame() {
      cx.clearRect(0, 0, w, h);
      var col = cursorColor;
      trail[0].x += (mouse.x - trail[0].x) * 0.5; trail[0].y += (mouse.y - trail[0].y) * 0.5;
      for (var i = 1; i < N; i++) { trail[i].x += (trail[i - 1].x - trail[i].x) * 0.42; trail[i].y += (trail[i - 1].y - trail[i].y) * 0.42; }
      cx.lineWidth = 1; cx.strokeStyle = "rgba(" + col[0] + "," + col[1] + "," + col[2] + ",0.30)";
      cx.beginPath(); cx.moveTo(trail[0].x, trail[0].y);
      for (var j = 1; j < N; j++) cx.lineTo(trail[j].x, trail[j].y);
      cx.stroke();
      for (var k = 1; k < N; k++) {
        var a = (1 - k / N) * 0.5, r = (1 - k / N) * 1.8 + 0.4;
        cx.fillStyle = "rgba(" + col[0] + "," + col[1] + "," + col[2] + "," + a + ")";
        cx.beginPath(); cx.arc(trail[k].x, trail[k].y, r, 0, 7); cx.fill();
      }
      var pr = hover ? 9 : 5;
      cx.strokeStyle = "rgba(" + col[0] + "," + col[1] + "," + col[2] + ",0.9)"; cx.lineWidth = 1.5;
      cx.beginPath(); cx.arc(mouse.x, mouse.y, pr, 0, 7); cx.stroke();
      cx.fillStyle = "rgba(" + col[0] + "," + col[1] + "," + col[2] + ",0.9)";
      cx.beginPath(); cx.arc(mouse.x, mouse.y, 2, 0, 7); cx.fill();
      requestAnimationFrame(frame);
    }
    frame();
  })();

  /* ---------- marquee infinito (loop + pausa no hover) ---------- */
  (function marquee() {
    var track = document.getElementById("marqTrack");
    if (!track || reduce) return;
    var base = track.querySelector(".marq__group");
    if (!base) return;
    function build() {
      track.querySelectorAll(".marq__group.clone").forEach(function (n) { n.remove(); });
      var gw = base.getBoundingClientRect().width;
      if (!gw) return;
      var need = window.innerWidth * 2.2, count = 1;
      while (gw * count < need) { var cl = base.cloneNode(true); cl.classList.add("clone"); cl.setAttribute("aria-hidden", "true"); track.appendChild(cl); count++; }
      if (count % 2 !== 0) { var cl2 = base.cloneNode(true); cl2.classList.add("clone"); cl2.setAttribute("aria-hidden", "true"); track.appendChild(cl2); count++; }
      track.style.setProperty("--marq-dur", ((gw * count) / 3 / 70).toFixed(1) + "s");
    }
    if (document.readyState === "complete") build();
    else window.addEventListener("load", build);
    var tm; window.addEventListener("resize", function () { clearTimeout(tm); tm = setTimeout(build, 200); });
  })();
})();

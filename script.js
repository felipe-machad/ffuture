/* =========================================================
   FFuture.IA — interações + fundo de rede neural animada
   Vanilla JS, sem dependências.
   ========================================================= */
(function () {
  "use strict";

  const nav = document.getElementById("nav");
  const toggle = document.getElementById("navToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const progress = document.querySelector(".scroll-progress");
  const yearEl = document.getElementById("year");

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Nav scroll + progress bar */
  function onScroll() {
    const y = window.scrollY || document.documentElement.scrollTop;
    nav.classList.toggle("scrolled", y > 30);
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = docH > 0 ? (y / docH) * 100 + "%" : "0%";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Mobile menu */
  function setMenu(open) {
    mobileMenu.classList.toggle("open", open);
    mobileMenu.setAttribute("aria-hidden", String(!open));
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    document.body.style.overflow = open ? "hidden" : "";
  }
  if (toggle) {
    toggle.addEventListener("click", () => setMenu(!mobileMenu.classList.contains("open")));
    mobileMenu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });
  }

  /* Reveal on scroll */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add("in"); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in"));
  }

  /* Active nav link */
  const sections = document.querySelectorAll("main section[id]");
  const navLinks = document.querySelectorAll(".nav__links a");
  if ("IntersectionObserver" in window && navLinks.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          navLinks.forEach((l) => l.classList.toggle("active", l.getAttribute("href") === "#" + id));
        }
      });
    }, { threshold: 0.5 });
    sections.forEach((s) => spy.observe(s));
  }

  /* Formulário → WhatsApp (placeholder: confirme o número) */
  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      const nome = encodeURIComponent(form.nome.value.trim());
      const empresa = encodeURIComponent((form.empresa && form.empresa.value.trim()) || "—");
      const email = encodeURIComponent(form.email.value.trim());
      const interesse = encodeURIComponent(form.interesse.value);
      const msg = encodeURIComponent(form.mensagem.value.trim());
      const texto = `Olá FFuture.IA! Sou ${nome} (${empresa} · ${email}).%0AInteresse: ${interesse}%0A%0A${msg}`;
      const numero = "5551993706131";
      window.open(`https://wa.me/${numero}?text=${texto}`, "_blank", "noopener");
    });
  }

  /* =======================================================
     Fundo animado: rede neural / constelação (canvas)
     ======================================================= */
  const canvas = document.getElementById("netCanvas");
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (canvas && canvas.getContext && !prefersReduced) {
    const ctx = canvas.getContext("2d");
    let w, h, dpr, nodes, raf;
    const mouse = { x: -9999, y: -9999 };

    function size() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      w = rect.width; h = rect.height;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function makeNodes() {
      const count = Math.min(80, Math.floor((w * h) / 16000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.6,
      }));
    }

    function step() {
      ctx.clearRect(0, 0, w, h);
      const maxDist = 140;
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;

        // links
        for (let j = i + 1; j < nodes.length; j++) {
          const m = nodes[j];
          const dx = n.x - m.x, dy = n.y - m.y;
          const dist = Math.hypot(dx, dy);
          if (dist < maxDist) {
            const a = (1 - dist / maxDist) * 0.5;
            ctx.strokeStyle = `rgba(90,150,255,${a})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y); ctx.lineTo(m.x, m.y); ctx.stroke();
          }
        }
        // link to mouse
        const dmx = n.x - mouse.x, dmy = n.y - mouse.y;
        const dm = Math.hypot(dmx, dmy);
        if (dm < 170) {
          const a = (1 - dm / 170) * 0.7;
          ctx.strokeStyle = `rgba(56,189,248,${a})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(n.x, n.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
        // node
        ctx.fillStyle = "rgba(150,190,255,0.85)";
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(step);
    }

    function start() { size(); makeNodes(); cancelAnimationFrame(raf); step(); }

    window.addEventListener("resize", start);
    window.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left; mouse.y = e.clientY - rect.top;
    });
    window.addEventListener("mouseleave", () => { mouse.x = -9999; mouse.y = -9999; });

    // Pausa quando fora da viewport (economia de CPU)
    const heroEl = document.getElementById("hero");
    if ("IntersectionObserver" in window && heroEl) {
      new IntersectionObserver((entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) { if (!raf) step(); }
          else { cancelAnimationFrame(raf); raf = null; }
        });
      }, { threshold: 0 }).observe(heroEl);
    }

    start();
  }

  /* =======================================================
     Animação de abertura: FORGE → FOCUS → FORWARD → FFUTURE.IA
     Pulável (botão / clique / tecla). Respeita reduced-motion.
     ======================================================= */
  const intro = document.getElementById("intro");
  if (intro) {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const skipBtn = document.getElementById("introSkip");
    let done = false;

    function endIntro() {
      if (done) return;
      done = true;
      intro.classList.add("is-hidden");
      document.body.style.overflow = "";
      setTimeout(() => { intro.style.display = "none"; }, 500);
    }

    if (reduce) {
      endIntro();
    } else {
      document.body.style.overflow = "hidden";
      const timer = setTimeout(endIntro, 5200);
      const skipNow = () => { clearTimeout(timer); endIntro(); };
      if (skipBtn) skipBtn.addEventListener("click", skipNow);
      intro.addEventListener("click", (e) => { if (e.target !== skipBtn) skipNow(); });
      window.addEventListener("keydown", function onKey(e) {
        if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
          skipNow();
          window.removeEventListener("keydown", onKey);
        }
      });
    }
  }

  /* Rodapé: mini "FFUTURE.IA" se monta ao entrar na viewport */
  const footerAnim = document.getElementById("footerAnim");
  if (footerAnim && "IntersectionObserver" in window) {
    new IntersectionObserver((entries) => {
      entries.forEach((en) => footerAnim.classList.toggle("play", en.isIntersecting));
    }, { threshold: 0.6 }).observe(footerAnim);
  } else if (footerAnim) {
    footerAnim.classList.add("play");
  }

  /* =======================================================
     Cursor "vivo" tech — nó luminoso + constelação local que
     segue o mouse; a cor evolui pelo gradiente da marca conforme
     o scroll (Forge → Focus → Forward). Apenas desktop/ponteiro
     fino; respeita prefers-reduced-motion.
     ======================================================= */
  (function cursorFx() {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;

    document.documentElement.classList.add("has-cursor-fx");
    const canvas = document.createElement("canvas");
    canvas.className = "cursor-fx";
    canvas.setAttribute("aria-hidden", "true");
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    let w, h;
    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    const mouse = { x: w / 2, y: h / 2, down: false };
    window.addEventListener("mousemove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
    window.addEventListener("mousedown", () => (mouse.down = true));
    window.addEventListener("mouseup", () => (mouse.down = false));

    const N = 18;
    const trail = Array.from({ length: N }, () => ({ x: mouse.x, y: mouse.y }));

    const stops = [[56, 189, 248], [59, 107, 255], [99, 102, 241]];
    const lerp = (a, b, t) => a + (b - a) * t;
    function scrollColor() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      let f = max > 0 ? (window.scrollY || 0) / max : 0;
      f = Math.max(0, Math.min(1, f));
      const seg = f * 2, i = Math.min(1, Math.floor(seg)), t = seg - i;
      const a = stops[i], b = stops[i + 1] || stops[i];
      return [Math.round(lerp(a[0], b[0], t)), Math.round(lerp(a[1], b[1], t)), Math.round(lerp(a[2], b[2], t))];
    }

    let hovering = false;
    const sel = 'a, button, .btn, .scard, .act, .vcard, input, textarea, select, [role="tab"]';
    document.addEventListener("mouseover", (e) => { if (e.target.closest(sel)) hovering = true; }, { passive: true });
    document.addEventListener("mouseout", (e) => { if (e.target.closest(sel)) hovering = false; }, { passive: true });

    function frame() {
      ctx.clearRect(0, 0, w, h);
      const c = scrollColor();
      trail[0].x += (mouse.x - trail[0].x) * 0.5;
      trail[0].y += (mouse.y - trail[0].y) * 0.5;
      for (let i = 1; i < N; i++) {
        trail[i].x += (trail[i - 1].x - trail[i].x) * 0.45;
        trail[i].y += (trail[i - 1].y - trail[i].y) * 0.45;
      }
      ctx.lineWidth = 1;
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = trail[i].x - trail[j].x, dy = trail[i].y - trail[j].y;
          const d = Math.hypot(dx, dy);
          if (d < 48) {
            const a = (1 - d / 48) * 0.5 * (1 - i / N);
            ctx.strokeStyle = `rgba(${c[0]},${c[1]},${c[2]},${a})`;
            ctx.beginPath(); ctx.moveTo(trail[i].x, trail[i].y); ctx.lineTo(trail[j].x, trail[j].y); ctx.stroke();
          }
        }
      }
      for (let i = 1; i < N; i++) {
        const a = (1 - i / N) * 0.8, r = (1 - i / N) * 2.2 + 0.4;
        ctx.fillStyle = `rgba(${c[0]},${c[1]},${c[2]},${a})`;
        ctx.beginPath(); ctx.arc(trail[i].x, trail[i].y, r, 0, 7); ctx.fill();
      }
      const baseR = hovering ? 9 : 5;
      const pr = mouse.down ? baseR * 0.6 : baseR;
      const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, pr * 3.4);
      g.addColorStop(0, `rgba(${c[0]},${c[1]},${c[2]},0.5)`);
      g.addColorStop(1, `rgba(${c[0]},${c[1]},${c[2]},0)`);
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(mouse.x, mouse.y, pr * 3.4, 0, 7); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.95)";
      ctx.beginPath(); ctx.arc(mouse.x, mouse.y, pr * 0.5, 0, 7); ctx.fill();
      ctx.strokeStyle = `rgba(${c[0]},${c[1]},${c[2]},0.9)`; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.arc(mouse.x, mouse.y, pr, 0, 7); ctx.stroke();
      requestAnimationFrame(frame);
    }
    frame();

    /* Hover magnético em botões e cards */
    document.querySelectorAll(".btn, .scard, .act, .vcard").forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const mx = e.clientX - (r.left + r.width / 2), my = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${mx * 0.12}px, ${my * 0.16}px)`;
      });
      el.addEventListener("mouseleave", () => { el.style.transform = ""; });
    });
  })();
})();

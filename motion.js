// Native browser motion: no dependency, no scroll hijacking.
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  if (reduce.matches) return;
  const fine = matchMedia("(hover: hover) and (pointer: fine)");
  const title = document.querySelector("#titulo");
  let index = 0;
  function split(node) {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE && child.textContent.trim()) {
        const fragment = document.createDocumentFragment();
        [...child.textContent].forEach((letter) => {
          const span = document.createElement("span");
          span.className = "motion-letter";
          span.textContent = letter;
          span.style.setProperty("--i", index++);
          fragment.append(span);
        });
        child.replaceWith(fragment);
      } else if (
        child.nodeType === Node.ELEMENT_NODE &&
        !child.matches(".asterisco,.sr-only")
      )
        split(child);
    });
  }
  // Keep one stable accessible name while letters animate visually.
  title.setAttribute(
    "aria-label",
    title.textContent.replace(/✳/g, "").replace(/\s+/g, " ").trim(),
  );
  // Agrupa as letras de Gava para o espaço ficar apenas antes do asterisco.
  const surname = title.querySelector(".sobrenome");
  const surnameWord = document.createElement("span");

  surnameWord.className = "surname-word";

  [...surname.childNodes]
    .filter((node) => node.nodeType === Node.TEXT_NODE)
    .forEach((node) => surnameWord.append(node));

  surname.prepend(surnameWord);

  split(title);
  title
    .querySelectorAll(".motion-letter")
    .forEach((el) => el.setAttribute("aria-hidden", "true"));
  const star = document.querySelector(".asterisco");
  star.innerHTML = `
  <span class="motion-star">
    <svg
      viewBox="0 0 100 100"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      stroke-width="6"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M50 4v92M4 50h92M17 17l66 66M17 83l66-66"/>
    </svg>
  </span>
`;
  const progress = document.createElement("div");
  progress.className = "scroll-progress";
  progress.setAttribute("aria-hidden", "true");
  document.body.append(progress);
  const cursor = document.createElement("div");
  cursor.className = "motion-cursor";
  cursor.textContent = "*";
  cursor.setAttribute("aria-hidden", "true");
  document.body.append(cursor);
  const revealTargets = document.querySelectorAll(
    ".titulo-secao,.projeto-cabecalho,.capa,.projeto-detalhes,.bastidores,.sobre h2,.sobre .descricao,.sobre .tags,.contato h2,.contato-base,.rodape",
  );
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("motion-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 },
    );
    revealTargets.forEach((el) => {
      el.classList.add("motion-reveal");
      observer.observe(el);
    });
    document.addEventListener("focusin", (e) => {
      e.target.closest(".motion-reveal")?.classList.add("motion-visible");
    });
  }
  const statement = document.querySelector(".sobre-destaque");
  const statementText = statement.textContent.trim().replace(/\s+/g, " ");
  statement.setAttribute("aria-label", statementText);
  statement.textContent = "";
  statementText.split(" ").forEach((word) => {
    const span = document.createElement("span");
    span.className = "word-motion";
    span.textContent = word;
    span.setAttribute("aria-hidden", "true");
    statement.append(span, document.createTextNode(" "));
  });
  const words = [...statement.querySelectorAll(".word-motion")];
  const covers = [...document.querySelectorAll(".capa")];
  let frame = 0;
  function updateScroll() {
    frame = 0;
    if (reduce.matches) return;
    const height = innerHeight;
    const max = document.documentElement.scrollHeight - height;
    progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    star.style.setProperty("--star-turn", `${scrollY * 0.08}deg`);
    const rect = statement.getBoundingClientRect();
    const amount = Math.min(
      1,
      Math.max(0, (height * 0.85 - rect.top) / (height * 0.45)),
    );
    words.forEach((word, i) =>
      word.classList.toggle(
        "word-active",
        i < Math.ceil(amount * words.length),
      ),
    );
    covers.forEach((cover) => {
      const r = cover.getBoundingClientRect();
      if (r.bottom > 0 && r.top < height)
        cover.style.setProperty(
          "--float-y",
          `${Math.max(-16, Math.min(16, (height / 2 - (r.top + r.height / 2)) * 0.035))}px`,
        );
    });
  }
  function schedule() {
    if (!frame) frame = requestAnimationFrame(updateScroll);
  }
  addEventListener("scroll", schedule, { passive: true });
  addEventListener("resize", schedule, { passive: true });
  schedule();
  covers.forEach((cover) => {
    let pointerFrame = 0;
    cover.addEventListener("pointermove", (e) => {
      if (!fine.matches || reduce.matches) return;
      cancelAnimationFrame(pointerFrame);
      pointerFrame = requestAnimationFrame(() => {
        const r = cover.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width,
          y = (e.clientY - r.top) / r.height;
        cover.style.setProperty("--rx", `${(y - 0.5) * -9}deg`);
        cover.style.setProperty("--ry", `${(x - 0.5) * 12}deg`);
        cover.style.setProperty("--mx", `${x * 100}%`);
        cover.style.setProperty("--my", `${y * 100}%`);
        cursor.style.transform = `translate(${e.clientX + 14}px,${e.clientY + 14}px)`;
        cursor.classList.add("active");
      });
    });
    cover.addEventListener("pointerleave", () => {
      cancelAnimationFrame(pointerFrame);
      cover.style.setProperty("--rx", "0deg");
      cover.style.setProperty("--ry", "0deg");
      cursor.classList.remove("active");
    });
  });
  document.querySelectorAll(".botao").forEach((button) => {
    button.addEventListener("pointermove", (e) => {
      if (!fine.matches || reduce.matches) return;
      const r = button.getBoundingClientRect();
      button.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.12}px,${(e.clientY - r.top - r.height / 2) * 0.2}px)`;
    });
    button.addEventListener(
      "pointerleave",
      () => (button.style.transform = ""),
    );
  });
  const contact = document.querySelector(".contato");
  const arrow = contact.querySelector(".seta-contato");
  contact.addEventListener("pointermove", (e) => {
    if (!fine.matches || reduce.matches) return;
    const r = contact.getBoundingClientRect();
    arrow.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.025}px,${(e.clientY - r.top - r.height / 2) * 0.035}px) rotate(-8deg)`;
  });
  contact.addEventListener("pointerleave", () => (arrow.style.transform = ""));
  // Preference changes apply immediately, including elements waiting to reveal.
  reduce.addEventListener("change", (e) => {
    if (!e.matches) return;
    cursor.remove();
    revealTargets.forEach((el) => el.classList.add("motion-visible"));
    words.forEach((el) => el.classList.add("word-active"));
    document
      .querySelectorAll(".botao")
      .forEach((el) => (el.style.transform = ""));
    arrow.style.transform = "";
  });
})();
/* ===== ABERTURA E TRANSIÇÃO PARA OS PROJETOS ===== */

(() => {
  // Evita duplicar os elementos caso o arquivo seja carregado novamente.
  if (document.querySelector(".motion-band")) return;

  const hero = document.querySelector(".hero");
  const title = document.querySelector("#titulo");
  const projects = document.querySelector("#projetos");

  if (!hero || !title || !projects) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  // Faixa contínua construída com elementos de texto.
  const band = document.createElement("div");
  band.className = "motion-band";
  band.setAttribute("aria-hidden", "true");

  const track = document.createElement("div");
  track.className = "motion-band-track";

  function createGroup() {
    const group = document.createElement("div");
    group.className = "motion-band-group";

    const items = [
      "IDEIAS EM MOVIMENTO",
      "CÓDIGO COM PERSONALIDADE",
      "INTERFACES EM CONSTRUÇÃO",
    ];

    items.forEach((text) => {
      const label = document.createElement("span");
      label.textContent = text;

      const symbol = document.createElement("b");
      symbol.innerHTML = `
  <svg
    viewBox="0 0 100 100"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    stroke-width="6"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M50 4v92M4 50h92M17 17l66 66M17 83l66-66"/>
  </svg>
`;

      group.append(label, symbol);
    });

    return group;
  }

  track.append(createGroup(), createGroup());
  band.append(track);
  projects.before(band);

  let scheduled = false;

  function render() {
    scheduled = false;

    if (reducedMotion.matches) {
      title.style.transform = "";
      title.style.opacity = "";
      return;
    }

    const rect = hero.getBoundingClientRect();

    // Usa a posição real da seção, sem prender a rolagem.
    const progress = Math.min(
      1,
      Math.max(0, -rect.top / Math.max(rect.height, 1)),
    );

    // Em celulares, o deslocamento é mais discreto.
    const mobile = window.innerWidth < 600;
    const horizontal = progress * (mobile ? -20 : -90);
    const vertical = progress * 65;
    const rotation = progress * -3;
    const scale = 1 - progress * 0.08;

    title.style.transform = `
      translate3d(${horizontal}px, ${vertical}px, 0)
      rotate(${rotation}deg)
      scale(${scale})
    `;

    title.style.opacity = String(1 - progress * 0.65);
  }

  function requestRender() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(render);
  }

  window.addEventListener("scroll", requestRender, {
    passive: true,
  });

  window.addEventListener("resize", requestRender, {
    passive: true,
  });

  reducedMotion.addEventListener("change", requestRender);

  // A faixa pausa fora da tela.
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        track.style.animationPlayState = entry.isIntersecting
          ? "running"
          : "paused";
      });
    });

    observer.observe(band);
  }

  render();
})();

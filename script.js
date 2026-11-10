const botaoTema = document.querySelector('#botao-tema');
function aplicarTema(escuro) {
  document.body.classList.toggle('tema-escuro', escuro);
  botaoTema.textContent = escuro ? 'Tema claro ☀' : 'Tema escuro ☾';
  botaoTema.setAttribute('aria-pressed', String(escuro));
  botaoTema.setAttribute('aria-label', escuro ? 'Ativar tema claro' : 'Ativar tema escuro');
  document.querySelector('meta[name="theme-color"]').content = escuro ? '#101114' : '#f0efeb';
}
let temaSalvo = null;
try { temaSalvo = localStorage.getItem('tema'); } catch {}
aplicarTema(temaSalvo !== 'claro');
botaoTema.addEventListener('click', () => {
  const escuro = !document.body.classList.contains('tema-escuro');
  aplicarTema(escuro);
  try { localStorage.setItem('tema', escuro ? 'escuro' : 'claro'); } catch {}
});
const botaoTopo = document.querySelector('#voltar-topo');
function atualizarBotaoTopo() { botaoTopo.hidden = window.scrollY < 300; }
window.addEventListener('scroll', atualizarBotaoTopo, { passive: true });
atualizarBotaoTopo();
botaoTopo.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'instant' });
  document.querySelector('.logo').focus({ preventScroll: true });
});
const curiosidade = document.querySelector('#curiosidade');
const botaoCuriosidade = document.querySelector('#botao-curiosidade');
botaoCuriosidade.addEventListener('click', () => {
  curiosidade.hidden = !curiosidade.hidden;
  botaoCuriosidade.setAttribute('aria-expanded', String(!curiosidade.hidden));
  botaoCuriosidade.textContent = curiosidade.hidden ? 'Fora do código +' : 'Esconder curiosidade −';
});
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) return;
      target.classList.add('visivel');
      observador.unobserve(target);
    });
  }, { threshold: 0 });
  document.querySelectorAll('.projeto, .sobre-grid, .contato-base').forEach((elemento) => {
    if (elemento.getBoundingClientRect().top < window.innerHeight) return;
    elemento.classList.add('revelar');
    observador.observe(elemento);
  });
  document.addEventListener('focusin', (evento) => {
    const bloco = evento.target.closest('.revelar');
    if (bloco) { bloco.classList.add('visivel'); observador.unobserve(bloco); }
  });
}

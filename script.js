const botaoTema = document.querySelector("#botao-tema");

// Aplica o tema e atualiza o botão.
function aplicarTema(temaEscuroAtivo) {
  document.body.classList.toggle("tema-escuro", temaEscuroAtivo);

  botaoTema.textContent = temaEscuroAtivo
    ? "Tema claro ☀"
    : "Tema escuro ☾";

  botaoTema.setAttribute("aria-pressed", String(temaEscuroAtivo));

  botaoTema.setAttribute(
    "aria-label",
    temaEscuroAtivo ? "Ativar tema claro" : "Ativar tema escuro"
  );
}

// Recupera a preferência salva, se o navegador permitir.
let temaSalvo = null;

try {
  temaSalvo = localStorage.getItem("tema");
} catch {
  // O botão continua funcionando se o armazenamento estiver bloqueado.
}

aplicarTema(temaSalvo === "escuro");

// Troca o tema e salva a nova preferência.
botaoTema.addEventListener("click", () => {
  const temaEscuroAtivo =
    !document.body.classList.contains("tema-escuro");

  aplicarTema(temaEscuroAtivo);

  try {
    localStorage.setItem(
      "tema",
      temaEscuroAtivo ? "escuro" : "claro"
    );
  } catch {
    // Mantém a troca de tema mesmo sem conseguir salvar.
  }
});
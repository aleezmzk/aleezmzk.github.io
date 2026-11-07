// Encontra o botão no HTML.
const botaoTema = document.querySelector("#botao-tema");

// Executa esta função toda vez que o botão recebe um clique.
botaoTema.addEventListener("click", () => {
  // Adiciona ou remove a classe e informa se ela ficou ativa.
  const temaEscuroAtivo = document.body.classList.toggle("tema-escuro");

  // Atualiza o texto e as informações de acessibilidade.
  botaoTema.textContent = temaEscuroAtivo
    ? "Tema claro ☀"
    : "Tema escuro ☾";

  botaoTema.setAttribute("aria-pressed", String(temaEscuroAtivo));

  botaoTema.setAttribute(
    "aria-label",
    temaEscuroAtivo ? "Ativar tema claro" : "Ativar tema escuro"
  );
});
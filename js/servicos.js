export function renderizarServicos($, servicos, utils) {
    $("#lista-servicos").innerHTML = servicos.map(servico => `
        <article class="servico">
            <h3>${utils.escapar(servico.nome)}</h3>
            <p>Duração estimada: ${servico.duracao} minutos</p>
            <p class="preco">
                R$ ${servico.preco.toFixed(2).replace(".", ",")}
            </p>
            <button data-escolher-servico="${utils.escapar(servico.nome)}">
                Agendar serviço
            </button>
        </article>
    `).join("");
}

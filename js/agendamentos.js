import {
    getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export function criarFuncoesAgendamentos($, estado, servicos, utils, db, nomeColecao, agendamentosRef) {
    function criarCard(item) {
        const cancelado = item.status === "Cancelado";
        const servico = servicos.find(s => s.nome === item.servico);
        const preco = servico ? servico.preco : 0;

        return `
            <article class="agendamento">
                <span class="status ${cancelado ? "cancelado" : ""}">
                    ${utils.escapar(item.status)}
                </span>

                <h3>${utils.escapar(item.servico)}</h3>
                <p>📅 ${utils.dataBonita(item.data)}</p>
                <p>🕒 ${utils.escapar(item.horario)}</p>
                <p>💰 R$ ${preco.toFixed(2).replace(".", ",")}</p>

                ${item.status === "Confirmado" ? `
                    <button type="button"
                        class="btn-editar-agendamento"
                        data-editar="${utils.escapar(item.id)}">
                        Editar agendamento
                    </button>

                    <button type="button"
                        class="btn-cancelar"
                        data-cancelar="${utils.escapar(item.id)}">
                        Cancelar agendamento
                    </button>
                ` : ""}
            </article>
        `;
    }

    function atualizarPainel() {
        const proximos = utils.pendentes();

        $("#total-proximos").textContent = proximos.length;

        $("#total-realizados").textContent = estado.agendamentos.filter(
            item => item.status === "Realizado"
        ).length;

        $("#total-servicos").textContent = servicos.length;

        $("#proximo-agendamento").innerHTML = proximos.length
            ? criarCard(proximos[0])
            : `<div class="vazio">
                Você não possui próximos horários.<br>
                Clique em "Novo agendamento" para marcar sua visita.
               </div>`;

        const ordenados = [...estado.agendamentos].sort(
            (a, b) => utils.obterDataHora(b) - utils.obterDataHora(a)
        );

        $("#lista-agendamentos").innerHTML = ordenados.length
            ? ordenados.map(criarCard).join("")
            : `<div class="vazio">
                Você ainda não possui agendamentos.
               </div>`;
    }

    async function carregarAgendamentos() {
        try {
            const resultado = await getDocs(agendamentosRef);

            estado.agendamentos = resultado.docs.map(documento => ({
                id: documento.id,
                ...documento.data()
            }));

            atualizarPainel();
        } catch (erro) {
            console.error("Erro ao carregar agendamentos:", erro);
            utils.mostrarToast(
                "Não foi possível carregar os dados do Firebase.",
                true
            );
        }
    }

    return {
        criarCard,
        atualizarPainel,
        carregarAgendamentos
    };
}

export function configurarEventos($, estado, utils, agenda, formulario, cancelamento) {
    document.querySelectorAll(".menu-btn").forEach(botao => {
        botao.addEventListener("click", () => {
            utils.mostrarSecao(botao.dataset.secao);
        });
    });

    document.querySelectorAll("[data-ir]").forEach(botao => {
        botao.addEventListener("click", () => {
            utils.mostrarSecao(botao.dataset.ir);
        });
    });

    $("#btn-novo-agendamento").addEventListener("click", () => {
        formulario.abrirFormulario();
    });

    $("#btn-novo-agendamento-2").addEventListener("click", () => {
        formulario.abrirFormulario();
    });

    $("#btn-ver-servicos").addEventListener("click", () => {
        utils.mostrarSecao("servicos");
    });

    $("#btn-fechar-formulario").addEventListener("click", () => {
        estado.agendamentoEditandoId = null;
        $("#form-agendamento").reset();

        $("#titulo-formulario").textContent = "Novo agendamento";
        $("#btn-confirmar-agendamento").textContent =
            "Confirmar agendamento";

        utils.mostrarSecao("agendamentos");
    });

    $("#lista-servicos").addEventListener("click", evento => {
        const botao = evento.target.closest("[data-escolher-servico]");

        if (!botao) return;

        formulario.abrirFormulario(botao.dataset.escolherServico);
    });

    document.addEventListener("click", evento => {
        const editar = evento.target.closest("[data-editar]");

        if (editar) {
            const item = estado.agendamentos.find(
                a => a.id === editar.dataset.editar
            );

            if (!item || item.status !== "Confirmado") {
                utils.mostrarToast(
                    "Este agendamento não pode ser editado.",
                    true
                );
                return;
            }

            formulario.abrirFormulario("", item);
            return;
        }

        const cancelar = evento.target.closest("[data-cancelar]");

        if (cancelar) {
            cancelamento.abrirConfirmacao(cancelar.dataset.cancelar);
        }
    });

    $("#btn-sair").addEventListener("click", () => {
        $("#modal-sair").classList.remove("oculto");
        $("#btn-confirmar-sair").focus();
    });

    $("#btn-cancelar-sair").addEventListener("click", () => {
        $("#modal-sair").classList.add("oculto");
    });

    $("#btn-confirmar-sair").addEventListener("click", () => {
        $("#modal-sair").classList.add("oculto");
        utils.mostrarSecao("inicio");
        utils.mostrarToast("Você saiu da demonstração.");
    });

    document.addEventListener("keydown", evento => {
        if (evento.key === "Escape") {
            cancelamento.fecharConfirmacao();
            $("#modal-sair").classList.add("oculto");
        }
    });
}

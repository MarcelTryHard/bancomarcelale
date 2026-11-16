import {
    updateDoc,
    doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export function configurarCancelamento($, estado, utils, agenda, db, nomeColecao) {
    function abrirConfirmacao(id) {
        estado.cancelamentoId = id;
        $("#modal-cancelamento").classList.remove("oculto");
        $("#btn-confirmar-cancelamento").focus();
    }

    function fecharConfirmacao() {
        estado.cancelamentoId = null;
        $("#modal-cancelamento").classList.add("oculto");
    }

    $("#btn-voltar-cancelamento").addEventListener("click", () => {
        fecharConfirmacao();
    });

    $("#btn-confirmar-cancelamento").addEventListener("click", async () => {
        const item = estado.agendamentos.find(a => a.id === estado.cancelamentoId);

        if (!item) {
            fecharConfirmacao();
            utils.mostrarToast("Agendamento não encontrado.", true);
            return;
        }

        if (
            item.status !== "Confirmado" ||
            utils.obterDataHora(item) < new Date()
        ) {
            fecharConfirmacao();
            utils.mostrarToast(
                "Este horário não pode mais ser cancelado.",
                true
            );
            return;
        }

        const id = estado.cancelamentoId;
        const botao = $("#btn-confirmar-cancelamento");

        botao.disabled = true;

        try {
            await updateDoc(doc(db, nomeColecao, id), {
                status: "Cancelado"
            });

            item.status = "Cancelado";

            agenda.atualizarPainel();
            fecharConfirmacao();
            utils.mostrarToast("Agendamento cancelado no Firebase.");
        } catch (erro) {
            console.error("Erro ao cancelar:", erro);
            utils.mostrarToast(
                "Não foi possível cancelar o agendamento.",
                true
            );
        } finally {
            botao.disabled = false;
        }
    });

    return { abrirConfirmacao, fecharConfirmacao };
}

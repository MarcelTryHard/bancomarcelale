import {
    addDoc,
    updateDoc,
    doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export function configurarFormulario($, estado, servicos, utils, agenda, db, nomeColecao, agendamentosRef) {
    function abrirFormulario(servico = "", item = null) {
        $("#form-agendamento").reset();
        $("#data").min = utils.dataLocal();

        estado.agendamentoEditandoId = item ? item.id : null;

        $("#titulo-formulario").textContent = item
            ? "Editar agendamento"
            : "Novo agendamento";

        $("#btn-confirmar-agendamento").textContent = item
            ? "Salvar alterações"
            : "Confirmar agendamento";

        if (item) {
            $("#servico").value = item.servico;
            $("#data").value = item.data;
            $("#horario").value = item.horario;
        } else if (servico) {
            $("#servico").value = servico;
        }

        utils.mostrarSecao("formulario");
    }

    $("#form-agendamento").addEventListener("submit", async evento => {
        evento.preventDefault();

        const servico = $("#servico").value;
        const data = $("#data").value;
        const horario = $("#horario").value;

        if (!servicos.some(s => s.nome === servico)) {
            utils.mostrarToast("Selecione um serviço válido.", true);
            return;
        }

        if (!data || !horario) {
            utils.mostrarToast("Preencha a data e o horário.", true);
            return;
        }

        const dataHora = new Date(`${data}T${horario}:00`);

        if (Number.isNaN(dataHora.getTime()) || dataHora <= new Date()) {
            utils.mostrarToast("Escolha uma data e horário futuros.", true);
            return;
        }

        const conflito = estado.agendamentos.some(item =>
            item.id !== estado.agendamentoEditandoId &&
            item.status === "Confirmado" &&
            item.data === data &&
            item.horario === horario
        );

        if (conflito) {
            utils.mostrarToast(
                "Já existe um agendamento neste horário.",
                true
            );
            return;
        }

        const botao = $("#btn-confirmar-agendamento");
        const editando = Boolean(estado.agendamentoEditandoId);
        const idEditado = estado.agendamentoEditandoId;

        botao.disabled = true;
        botao.textContent = editando
            ? "Salvando alterações..."
            : "Salvando...";

        try {
            if (editando) {
                await updateDoc(doc(db, nomeColecao, idEditado), {
                    servico,
                    data,
                    horario
                });
            } else {
                await addDoc(agendamentosRef, {
                    servico,
                    data,
                    horario,
                    status: "Confirmado",
                    dataCadastro: new Date().toISOString()
                });
            }

            estado.agendamentoEditandoId = null;

            await agenda.carregarAgendamentos();

            $("#form-agendamento").reset();
            $("#titulo-formulario").textContent = "Novo agendamento";
            $("#btn-confirmar-agendamento").textContent =
                "Confirmar agendamento";

            utils.mostrarSecao("agendamentos");

            utils.mostrarToast(
                editando
                    ? "Agendamento atualizado no Firebase!"
                    : "Agendamento salvo no Firebase!"
            );
        } catch (erro) {
            console.error("Erro ao salvar agendamento:", erro);
            utils.mostrarToast(
                "Não foi possível salvar. Verifique o Firebase.",
                true
            );
        } finally {
            botao.disabled = false;
            botao.textContent = "Confirmar agendamento";
        }
    });

    return { abrirFormulario };
}

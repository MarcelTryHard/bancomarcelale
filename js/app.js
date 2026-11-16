import { db } from "./firebase.js";
import { collection } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { criarFuncoesUtils } from "./utils.js";
import { criarFuncoesAgendamentos } from "./agendamentos.js";
import { renderizarServicos } from "./servicos.js";
import { configurarFormulario } from "./formulario.js";
import { configurarCancelamento } from "./cancelamento.js";
import { configurarEventos } from "./eventos.js";

document.addEventListener("DOMContentLoaded", () => {
    const $ = seletor => document.querySelector(seletor);

    const nomeColecao = "marcel_fabricio";
    const agendamentosRef = collection(db, nomeColecao);

    const servicos = [
        { nome: "Corte de cabelo", preco: 40, duracao: 40 },
        { nome: "Barba", preco: 25, duracao: 25 },
        { nome: "Corte + barba", preco: 55, duracao: 60 },
        { nome: "Sobrancelha", preco: 15, duracao: 15 }
    ];

    const estado = {
        agendamentos: [],
        cancelamentoId: null,
        agendamentoEditandoId: null,
        toastTimer: null
    };

    const utils = criarFuncoesUtils($, estado);
    const agenda = criarFuncoesAgendamentos($, estado, servicos, utils, db, nomeColecao, agendamentosRef);

    renderizarServicos($, servicos, utils);
    const formulario = configurarFormulario($, estado, servicos, utils, agenda, db, nomeColecao, agendamentosRef);
    const cancelamento = configurarCancelamento($, estado, utils, agenda, db, nomeColecao);
    configurarEventos($, estado, utils, agenda, formulario, cancelamento);

    utils.mostrarSecao("inicio");
    agenda.carregarAgendamentos();
});

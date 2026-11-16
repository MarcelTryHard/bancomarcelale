export function criarFuncoesUtils($, estado) {
    function mostrarToast(mensagem, erro = false) {
        const toast = $("#toast");
        toast.textContent = mensagem;
        toast.className = erro ? "show error" : "show";

        clearTimeout(estado.toastTimer);

        estado.toastTimer = setTimeout(() => {
            toast.className = "";
        }, 3500);
    }

    function escapar(texto) {
        return String(texto).replace(/[&<>"']/g, caractere => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        })[caractere]);
    }

    function dataBonita(data) {
        const [ano, mes, dia] = data.split("-");
        return `${dia}/${mes}/${ano}`;
    }

    function obterDataHora(item) {
        return new Date(`${item.data}T${item.horario}:00`);
    }

    function pendentes() {
        return estado.agendamentos
            .filter(item =>
                item.status === "Confirmado" &&
                obterDataHora(item) >= new Date()
            )
            .sort((a, b) =>
                obterDataHora(a) - obterDataHora(b)
            );
    }

    function mostrarSecao(nome) {
        document.querySelectorAll(".secao").forEach(secao => {
            secao.classList.add("oculto");
        });

        const secao = $(`#secao-${nome}`);

        if (secao) {
            secao.classList.remove("oculto");
        }

        document.querySelectorAll(".menu-btn").forEach(botao => {
            botao.classList.toggle(
                "ativo",
                botao.dataset.secao === nome
            );
        });

        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function dataLocal() {
        const agora = new Date();
        const ano = agora.getFullYear();
        const mes = String(agora.getMonth() + 1).padStart(2, "0");
        const dia = String(agora.getDate()).padStart(2, "0");

        return `${ano}-${mes}-${dia}`;
    }

    return {
        mostrarToast,
        escapar,
        dataBonita,
        obterDataHora,
        pendentes,
        mostrarSecao,
        dataLocal
    };
}

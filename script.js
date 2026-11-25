
"use strict";

// ELEMENTOS HTML
const formulario = document.getElementById("formCalculadora");
const resultado = document.getElementById("resultado");
const historico = document.getElementById("historico");
const btnCopiar = document.getElementById("btnCopiar");
const btnLimpar = document.getElementById("btnLimparHistorico");


// HISTÓRICO
function carregarHistorico() {

    return JSON.parse(localStorage.getItem("historico")) || [];

}

function salvarHistorico(lista) {

    localStorage.setItem("historico", JSON.stringify(lista));

}

function mostrarHistorico() {

    const lista = carregarHistorico();

    historico.innerHTML = "";

    lista.forEach(function (item) {

        const li = document.createElement("li");

        li.textContent = item;

        historico.appendChild(li);

    });

}


// CALCULADORA
formulario.addEventListener("submit", function (event) {

    event.preventDefault();

    const nota1 = Number(document.getElementById("nota1").value);
    const nota2 = Number(document.getElementById("nota2").value);

    const peso1 = Number(document.getElementById("peso1").value);
    const peso2 = Number(document.getElementById("peso2").value);
    const pesoFinal = Number(document.getElementById("pesoFinal").value);

    const mediaDesejada = Number(document.getElementById("mediaDesejada").value);


    // VALIDAR PESOS
    const somaPesos = peso1 + peso2 + pesoFinal;

    if (somaPesos !== 100) {

        resultado.textContent =
            "Os pesos das avaliações devem somar 100%.";

        btnCopiar.hidden = true;

        return;

    }

    if (pesoFinal === 0) {

        resultado.textContent =
            "O peso da prova final deve ser maior que zero.";

        btnCopiar.hidden = true;

        return;

    }


    // CALCULAR NOTA NECESSÁRIA
    const notaNecessaria =
        (mediaDesejada
            - nota1 * peso1 / 100
            - nota2 * peso2 / 100)
        / (pesoFinal / 100);


    let mensagem;

    if (notaNecessaria <= 0) {

        mensagem = "Você já alcançou a média desejada!";

    } else if (notaNecessaria > 10) {

        mensagem = "Não é possível alcançar essa média.";

    } else {

        mensagem =
            "Você precisa tirar " +
            notaNecessaria.toFixed(2) +
            " na prova final.";

    }


    // MOSTRAR RESULTADO
    resultado.textContent = mensagem;

    btnCopiar.hidden = false;


    // SALVAR HISTÓRICO
    const lista = carregarHistorico();

    lista.unshift(mensagem);

    lista.splice(5);

    salvarHistorico(lista);

    mostrarHistorico();

});


// COPIAR RESULTADO
btnCopiar.addEventListener("click", async function () {

    try {

        await navigator.clipboard.writeText(resultado.textContent);

        btnCopiar.textContent = "Copiado!";

    } catch (erro) {

        alert("Não foi possível copiar o resultado.");

    }

});


// LIMPAR HISTÓRICO
btnLimpar.addEventListener("click", function () {

    localStorage.removeItem("historico");

    mostrarHistorico();

});




// INICIALIZAÇÃO
async function iniciar() {

    await Promise.all([
        carregarAPI(),
        Promise.resolve().then(mostrarHistorico)
    ]);

}

iniciar();

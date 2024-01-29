function theme()
{
    document.body.classList.toggle("dark-theme");
    (localStorage.getItem("theme") === "dark") ? localStorage.setItem("theme", "light") : localStorage.setItem("theme", "dark");
}

if (localStorage.getItem("theme") === "dark") document.body.classList.toggle("dark-theme");

let prevScrollpos = window.scrollY;
window.onscroll = () => {
    let currentScrollPos = window.scrollY;
    (prevScrollpos >= currentScrollPos) ? document.getElementById("Menu").style.top = "0" : document.getElementById("Menu").style.top = "-90px";
    prevScrollpos = currentScrollPos;
}

function closeModal()
{
    let modal = document.getElementById("Modal")
    modal.remove();
}

function obterDataAtualFormatada() {
    let dataAtual = new Date();
    let ano = dataAtual.getFullYear();
    let mes = (dataAtual.getMonth() + 1).toString().padStart(2, '0');
    let dia = dataAtual.getDate().toString().padStart(2, '0');

    return `${dia}-${mes}-${ano}`;
}

/* ----- ----- Funções Churrasco: ----- ----- */

function calcularChurrasco() {
    let qtdCriancasElement  = document.getElementById("qtd_Criancas");
    let qtdMulheresElement  = document.getElementById("qtd_Mulheres");
    let qtdHomensElement    = document.getElementById("qtd_Homens");

    let qtd_criancas  = Number(qtdCriancasElement.value);
    let qtd_mulheres  = Number(qtdMulheresElement.value);
    let qtd_homens    = Number(qtdHomensElement.value);

    let qtd_pessoas   = qtd_homens + qtd_mulheres + qtd_criancas;

    if (qtd_pessoas == 0) return false;

    const dadosChurrasco = {
        data:           obterDataAtualFormatada(),
        qtd_homens:     qtd_homens,
        qtd_mulheres:   qtd_mulheres,
        qtd_criancas:   qtd_criancas,
        carne_kg:       (qtd_homens * 0.4 + qtd_mulheres * 0.32 + qtd_criancas * 0.2).toFixed(1).replace(".", ","),
        carvao_kg:      (qtd_homens * 1 + qtd_mulheres * 1 + qtd_criancas * 1),
        pao_de_alho:    (qtd_homens * 2 + qtd_mulheres * 2 + qtd_criancas * 1),
        refri_l:        (qtd_pessoas <= 5) ? 2 : Math.ceil(qtd_pessoas / 5),
        cerveja_l:      ((qtd_homens * 3 + qtd_mulheres * 3 + qtd_criancas * 0) * 0.6).toFixed(1).replace(".", ",") 
    }

    return dadosChurrasco;
}

async function criarChurrasco() {

    if (calcularChurrasco() == false) return;

    try {
        await fetch('http://localhost:3000/churrascos/', {
            method: 'POST',
            body: JSON.stringify(calcularChurrasco())
        });
        window.location.href = "../index.html";
    } catch (error) {
        console.warn('Erro ao subir dados para à API.');
        console.error('Erro ao subir dados para à API:', error);
        createOfflineResultsCard(calcularChurrasco());
    }
}

async function deletarChurrasco(id) {
    try {
        await fetch(`http://localhost:3000/churrascos/${id}`, { 
            method: 'DELETE', 
        });
    } catch (error) {
        console.warn('Erro ao deletar churrasco.')
        console.error('Erro ao deletar churrasco:', error);
    }
}

async function atualizarChurrasco(id) {
    
    if (calcularChurrasco() == false) return;

   try {
        await fetch(`http://localhost:3000/churrascos/${id}`, {
            method: 'PUT',
            body: JSON.stringify(calcularChurrasco())
        });
   } catch (error) {
        console.warn('Erro ao buscar dados do churrasco, por favor verifique se à ID solicitada esta correta.')
        console.error('Erro ao buscar dados do churrasco', error);
   }
}

async function ModalEditarChurrasco(id) {   
    const response  = await fetch(`http://localhost:3000/churrascos/${id}`);
    const churrasco = await response.json();
    let modal = document.createElement("div")

    modal.innerHTML = `
    <div id="Modal">
        <div class="card">
            <button onclick="closeModal()" class="material-symbols-outlined">close</button>
            <h2>Editar Churrasco:</h2>
            <form onsubmit="atualizarChurrasco('${id}'); return false">
                <div>
                    <label for="qtd_Criancas">Quantidade de Crianças:</label>
                    <input id="qtd_Criancas" type="number" min="0" max="100" value="${churrasco.qtd_criancas}" required>
                </div>
                <div>
                    <label for="qtd_Homens">Quantidade de Homens:</label>
                    <input id="qtd_Homens" type="number" min="0" max="100" value="${churrasco.qtd_homens}" required>
                </div>
                <div>
                    <label for="qtd_Mulheres">Quantidade de Mulheres:</label>
                    <input id="qtd_Mulheres" type="number" min="0" max="100" value="${churrasco.qtd_mulheres}" required>
                </div>
                <input type="submit" href="#" class="custom-button" value="Salvar Churrasco">
            </form>
        </div>
    </div>
    `;
    document.body.appendChild(modal);
}

/* ----- ----- Offline (API não hospedada): ----- ----- */
function createOfflineResultsCard(data) {
    let card = ''; 
    card +=
    `<div id="result-card" class="card">
        <h2>Resultado:</h2>
        <div class="result-info">
            <div>
                <p>Qtd. de Pessoa(s): </p>
                <b>${data.qtd_homens + data.qtd_mulheres + data.qtd_criancas}</b>
            </div>
            <div>
                <p>Carne (KG): </p>
                <b>${data.carne_kg} Kg</b>
            </div>
            <div>
                <p>Pão de Alho: </p>
                <b>${data.pao_de_alho} Un</b>
            </div>
            <div>
                <p>Carvão (KG): </p>
                <b>${data.carvao_kg} Kg</b>
            </div>
            <div>
                <p>Refri (L): </p>
                <b>${data.refri_l} L</b>
            </div>
            <div>
                <p>Cerveja (L): </p>
                <b>${data.cerveja_l} L</b>
            </div>
        </div>
    </div>
    `;
    document.getElementById('Resultado').innerHTML = card;
    window.location.href = "#Resultado";
}
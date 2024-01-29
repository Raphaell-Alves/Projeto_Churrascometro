async function fetchListaChurrascos() {
    try {
        const response = await fetch('http://localhost:3000/churrascos');
        const churrascos = await response.json();
        const tbody = document.getElementById('churrascoData');
        churrascos.forEach(churrasco => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${churrasco.data}</td>
                <td>${churrasco.qtd_homens + churrasco.qtd_mulheres + churrasco.qtd_criancas}</td>
                <td>${churrasco.carne_kg} Kg</td>
                <td>${churrasco.pao_de_alho}</td>
                <td>${churrasco.carvao_kg} Kg</td>
                <td>${churrasco.refri_l} L</td>
                <td>${churrasco.cerveja_l} L</td>
                <td>
                    <button class="edit material-symbols-outlined" onclick="ModalEditarChurrasco('${churrasco.id}')">edit</button>
                    <button class="delete material-symbols-outlined" onclick="deletarChurrasco('${churrasco.id}')">delete</button>
                </td>`;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Erro ao buscar dados da API:', error);
    }
}

fetchListaChurrascos()
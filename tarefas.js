const URL_BASE = "https://sistema-de-tarefas-backend.vercel.app/tarefas";
const tbody = document.getElementById('tabela-tarefas');
const btnAddTarefa = document.getElementById('btn_add_tarefa');
const modal = document.getElementById('modal-tarefa');
const modalTitulo = document.getElementById('modal-titulo');
const formModal = document.getElementById('form-modal');
const closeModal = document.querySelector('.close');
const btnCancelar = document.querySelector('.btn-cancelar');
const totalCustoElement = document.getElementById('total-custo');

let modoEdicao = false;
let tarefaEditando = null;
let tarefasCache = [];

document.addEventListener('DOMContentLoaded', () => {
    carregarTarefas();
    configurarEventos();
});

function configurarEventos() {
    btnAddTarefa.addEventListener('click', abrirModalIncluir);
    closeModal.addEventListener('click', fecharModal);
    btnCancelar.addEventListener('click', fecharModal);
    formModal.addEventListener('submit', salvarTarefa);

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            fecharModal();
        }
    });
}

async function carregarTarefas() {
    try {
        const response = await fetch(URL_BASE);
        if (!response.ok) throw new Error("Erro ao buscar dados do servidor");
        
        const tarefas = await response.json();

        tarefas.sort((a, b) => a.ordem - b.ordem);
        
        tarefasCache = tarefas;
        renderizarTabela(tarefas);
    } catch (error) {
        console.error("Erro:", error);
        alert("Não foi possível carregar as tarefas. Verifique sua conexão.");
    }
}


function renderizarTabela(tarefas) {
    tbody.innerHTML = '';
    let totalGeral = 0;

    tarefas.forEach((tarefa, index) => {
        const custoNum = parseFloat(tarefa.custo);
        totalGeral += custoNum;

        const tr = document.createElement('tr');

        if (custoNum >= 1000) {
            tr.classList.add('custo-alto');
        }

        tr.innerHTML = `
            <td>${tarefa.id}</td>
            <td>${tarefa.nome_tarefa}</td>
            <td>${formatarMoeda(custoNum)}</td>
            <td>${formatarData(tarefa.data_limite)}</td>
            <td>
                <button class="btn-acao btn-subir" onclick="mudarOrdem(${tarefa.id}, -1)" ${index === 0 ? 'disabled' : ''} title="Subir">▲</button>
                <button class="btn-acao btn-descer" onclick="mudarOrdem(${tarefa.id}, 1)" ${index === tarefas.length - 1 ? 'disabled' : ''} title="Descer">▼</button>
                <button class="btn-acao btn-editar" onclick='prepararEdicao(${JSON.stringify(tarefa)})' title="Editar">✏️</button>
                <button class="btn-acao btn-excluir" onclick="excluirTarefa(${tarefa.id})" title="Excluir">🗑️</button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    totalCustoElement.innerHTML = `<strong>${formatarMoeda(totalGeral)}</strong>`;
}

function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', { 
        style: 'currency', 
        currency: 'BRL' 
    });
}

function formatarData(dataString) {
    const [ano, mes, dia] = dataString.split('-');
    return `${dia}/${mes}/${ano}`;
}

function converterDataParaISO(dataString) {
    const [dia, mes, ano] = dataString.split('/');
    return `${ano}-${mes}-${dia}`;
}

function abrirModalIncluir() {
    modoEdicao = false;
    tarefaEditando = null;
    modalTitulo.textContent = 'Adicionar Tarefa';
    formModal.reset();
    modal.style.display = 'block';
    setTimeout(() => {
    document.getElementById('nome_tarefa').focus();
}, 0);
}

function prepararEdicao(tarefa) {
    modoEdicao = true;
    tarefaEditando = tarefa;
    modalTitulo.textContent = 'Editar Tarefa';
    
    document.getElementById('nome_tarefa').value = tarefa.nome_tarefa;
    document.getElementById('custo').value = tarefa.custo;
    document.getElementById('data_limite').value = tarefa.data_limite;
    
    modal.style.display = 'block';
    setTimeout(() => {
    document.getElementById('nome_tarefa').focus();}, 0);
}

function fecharModal() {
    modal.style.display = 'none';
    formModal.reset();
    modoEdicao = false;
    tarefaEditando = null;
}

async function salvarTarefa(e) {
    e.preventDefault();
    
    const nomeTarefa = document.getElementById('nome_tarefa').value.trim();
    const custo = parseFloat(document.getElementById('custo').value);
    const dataLimite = document.getElementById('data_limite').value;

    if (!nomeTarefa || isNaN(custo) || !dataLimite) {
        alert('Todos os campos são obrigatórios!');
        return;
    }
    
    if (custo < 0) {
        alert('O custo deve ser maior ou igual a zero!');
        return;
    }
    const LIMITE_MAXIMO = 999999999999.99;

    if (custo > LIMITE_MAXIMO) {
        alert('O Limite maximo de custo é R$ 99.999.999,99\nInforme um valor menor.');
        return;
    }

    const nomeExiste = tarefasCache.some(t => 
        t.nome_tarefa.toLowerCase() === nomeTarefa.toLowerCase() && 
        (!modoEdicao || t.id !== tarefaEditando.id)
    );
    
    if (nomeExiste) {
        alert('Já existe uma tarefa com este nome!');
        return;
    }
    
    try {
        if (modoEdicao) {
            await editarTarefa(tarefaEditando.id, nomeTarefa, custo, dataLimite);
        } else {
            await incluirTarefa(nomeTarefa, custo, dataLimite);
        }
    } catch (error) {
        console.error('Erro ao salvar:', error);
        alert('Erro ao salvar a tarefa. Tente novamente.');
    }
}

async function incluirTarefa(nomeTarefa, custo, dataLimite) {
    const maxOrdem = tarefasCache.length > 0 
        ? Math.max(...tarefasCache.map(t => t.ordem)) 
        : 0;
    
    const novaTarefa = {
        nome_tarefa: nomeTarefa,
        custo: custo,
        data_limite: dataLimite,
        ordem: maxOrdem + 1
    };

    try {
        const response = await fetch(URL_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novaTarefa)
        });

        if (response.ok) {
            alert("Tarefa adicionada com sucesso!");
            fecharModal();
            carregarTarefas();
        } else {
            const erro = await response.json();
            alert("Erro: " + (erro.mensagem || erro.message || 'Erro ao adicionar tarefa'));
        }
    } catch (error) {
        console.error("Erro ao incluir:", error);
        throw error;
    }
}
async function editarTarefa(id, nomeTarefa, custo, dataLimite) {
    const tarefaAtualizada = {
        id:id,
        nome_tarefa: nomeTarefa,
        custo: custo,
        data_limite: dataLimite
    };

    try {
        const response = await fetch(URL_BASE, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tarefaAtualizada)
        });

        if (response.ok) {
            alert("Tarefa atualizada com sucesso!");
            fecharModal();
            carregarTarefas();
        } else {
            const erro = await response.json();
            alert("Erro: " + (erro.mensagem || erro.message || 'Erro ao editar tarefa'));
        }
    } catch (error) {
        console.error("Erro ao editar:", error);
        throw error;
    }
}
async function excluirTarefa(id) {
    if (!confirm("Tem certeza que deseja excluir esta tarefa?")) {
        return;
    }

    try {
        const response = await fetch(`${URL_BASE}/${id}`, { 
            method: 'DELETE' 
        });
        
        if (response.ok) {
            alert("Tarefa excluída com sucesso!");
            carregarTarefas();
        } else {
            alert("Erro ao excluir a tarefa.");
        }
    } catch (error) {
        console.error("Erro ao excluir:", error);
        alert("Erro ao excluir tarefa. Tente novamente.");
    }
}

async function mudarOrdem(id, direcao) {
    const indexAtual = tarefasCache.findIndex(t => t.id === id);
    if (indexAtual === -1) return;
    
    const indexDestino = indexAtual + direcao;
    if (indexDestino < 0 || indexDestino >= tarefasCache.length) {
        return;
    }
    const tarefaAtual = { ...tarefasCache[indexAtual] };
    const tarefaDestino = { ...tarefasCache[indexDestino] };
    const ordemTemp = tarefaAtual.ordem;
    tarefaAtual.ordem = tarefaDestino.ordem;
    tarefaDestino.ordem = ordemTemp;
    try {
        await Promise.all([
            fetch(URL_BASE, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: tarefaAtual.id,
                    nome_tarefa: tarefaAtual.nome_tarefa,
                    custo: tarefaAtual.custo,
                    data_limite: tarefaAtual.data_limite,
                    ordem: tarefaAtual.ordem
                })
            }),
            fetch(URL_BASE, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: tarefaDestino.id,
                    nome_tarefa: tarefaDestino.nome_tarefa,
                    custo: tarefaDestino.custo,
                    data_limite: tarefaDestino.data_limite,
                    ordem: tarefaDestino.ordem
                })
            })
        ]);
        carregarTarefas();
    } catch (error) {
        console.error("Erro ao reordenar:", error);
        alert("Erro ao alterar a ordem. Tente novamente.");
        carregarTarefas(); 
    }
    finally{
        carregarTarefas(); 
    }
}

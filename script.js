let tarefas = [];
let filtroAtual = 'todas'; // todas, pendentes, concluidas

function salvarTarefas() {
  localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

function carregarTarefas() {
  tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
  atualizarLista();
}

function adicionarTarefa(texto) {
  tarefas.push({ texto: texto, concluida: false });
  salvarTarefas();
  atualizarLista();
}

function exibirTarefa(tarefa, indice) {
  const li = document.createElement('li');
  li.className = `list-group-item item-tarefa d-flex justify-content-between align-items-center ${tarefa.concluida ? 'completed' : ''}`;

  const span = document.createElement('span');
  span.textContent = tarefa.texto;

  const acoes = document.createElement('div');
  acoes.className = 'acoes-tarefa d-flex gap-2';

  const botaoConcluir = document.createElement('button');
  botaoConcluir.className = `btn btn-sm btn-${tarefa.concluida ? 'secondary' : 'primary'}`;
  botaoConcluir.innerHTML = tarefa.concluida ? '↩' : '✔';
  botaoConcluir.title = tarefa.concluida ? 'Marcar como pendente' : 'Concluir';
  botaoConcluir.onclick = () => {
    tarefas[indice].concluida = !tarefas[indice].concluida;
    salvarTarefas();
    atualizarLista();
  };

  const botaoExcluir = document.createElement('button');
  botaoExcluir.className = 'btn btn-sm btn-danger';
  botaoExcluir.innerHTML = '🗑';
  botaoExcluir.title = 'Excluir';
  botaoExcluir.onclick = () => {
    tarefas.splice(indice, 1);
    salvarTarefas();
    atualizarLista();
  };

  acoes.appendChild(botaoConcluir);
  acoes.appendChild(botaoExcluir);
  li.appendChild(span);
  li.appendChild(acoes);

  return li;
}

function atualizarContadores() {
  const total = tarefas.length;
  const concluidas = tarefas.filter(t => t.concluida).length;
  document.getElementById('total-contador').textContent = `Total: ${total}`;
  document.getElementById('contador-concluidas').textContent = `Concluídas: ${concluidas}`;
}

function atualizarLista() {
  const lista = document.getElementById('lista-tarefas');
  lista.innerHTML = '';

  let tarefasFiltradas = tarefas;

  if (filtroAtual === 'pendentes') {
    tarefasFiltradas = tarefas.filter(t => !t.concluida);
  } else if (filtroAtual === 'concluidas') {
    tarefasFiltradas = tarefas.filter(t => t.concluida);
  }

  tarefasFiltradas.forEach((tarefa, indice) => {
    const elemento = exibirTarefa(tarefa, indice);
    lista.appendChild(elemento);
  });

  atualizarContadores();
}

function limparConcluidas() {
  tarefas = tarefas.filter(t => !t.concluida);
  salvarTarefas();
  atualizarLista();
}

document.getElementById('form-tarefa').addEventListener('submit', function(e) {
  e.preventDefault();
  const input = document.getElementById('nova-tarefa');
  const texto = input.value.trim();
  if (texto !== '') {
    adicionarTarefa(texto);
    input.value = '';
  }
});

document.querySelectorAll('#grupo-filtros button').forEach(botao => {
  botao.addEventListener('click', () => {
    document.querySelectorAll('#grupo-filtros button').forEach(b => b.classList.remove('active'));
    botao.classList.add('active');
    filtroAtual = botao.getAttribute('data-filtro');
    atualizarLista();
  });
});

window.onload = carregarTarefas;

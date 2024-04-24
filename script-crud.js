const btnAdicionarTarefa = document.querySelector(".app__button--add-task");
const formAdicionarTarefa = document.querySelector(".app__form-add-task");
const textArea = document.querySelector(".app__form-textarea");
const ulTarefas = document.querySelector(".app__section-task-list");
const btnCancelar = document.querySelector(".app__form-footer__button--cancel");
const btnRemoverConcluidas = document.querySelector("#btn-remover-concluidas");
const btnRemoverTodas = document.querySelector("#btn-remover-todas");

const paragrafoDescricaoTarefa = document.querySelector(".app__section-active-task-description");
let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

let tarefaSelecionada = null;
let liTarefaSelecionada = null;

//! Armazenar informações no armazenamento local do navegador.
function atualizarTarefas() {
  //! Convertendo o array para uma string em formato JSON para poder armazenar.
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function criarElementoTarefa(tarefa) {
  const li = document.createElement("li");
  li.classList.add("app__section-task-list-item");

  const svg = document.createElement("svg");
  svg.innerHTML = `

    <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
         <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
         <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
    </svg>
    `;

  const paragrafo = document.createElement("p");
  paragrafo.textContent = tarefa.descricao;
  paragrafo.classList.add("app__section-task-list-item-description");

  const botao = document.createElement("button");
  botao.classList.add("app_button-edit");

  /*
   | Função que permite a inserção de um novo nome para a tarefa, atualiza a descrição da tarefa,
   | e em seguida, atualiza a exibição das tarefas na interface do usuario.
  */
  botao.onclick = () => {
    //debugger
    //!Evento de clique adicionado ao botão de edição
    const novaDescricao = prompt("Qual o novo nome da tarefa?");
    //console.log("nova descricao: ", novaDescricao);
    //-> Tratamento de erro, para verificar se está null, vazio;
    if (novaDescricao) {
      //!Atualiza o conteúdo textual do parágrafo com a nova descrição
      paragrafo.textContent = novaDescricao;
      //!Atualiza a descrição da tarefa na lista de tarefas
      tarefa.descricao = novaDescricao;
      //!Chama a função para atualizar as tarefas no localStorage
      atualizarTarefas();
    }
  };

  const imagemBotao = document.createElement("img");
  imagemBotao.setAttribute("src", "/imagens/edit.png");
  botao.append(imagemBotao);

  li.append(svg);
  li.append(paragrafo);
  li.append(botao);

  //!Mantendo a task completa salva no localstorage e desabilitando butao de edicao, após concluida.
  if (tarefa.completa) {
    li.classList.add('app__section-task-list-item-complete');
    botao.setAttribute('disabled', 'disabled');
  } else{
    li.onclick = () => {
      document.querySelectorAll('.app__section-task-list-item-active').forEach((elemento) => {
          elemento.classList.remove('app__section-task-list-item-active');
        });
      if (tarefaSelecionada == tarefa) {
        paragrafoDescricaoTarefa.textContent = '';
        tarefaSelecionada = null;
        liTarefaSelecionada = null;
  
        return;
      }
  
      tarefaSelecionada = tarefa;
      liTarefaSelecionada = li;
      paragrafoDescricaoTarefa.textContent = tarefa.descricao;
  
      li.classList.add("app__section-task-list-item-active");
    };

  }


  return li;
}

/* 
->Aparecer formulario quando usuario clicar no botão adicionar nova tarefa
*/
btnAdicionarTarefa.addEventListener("click", () => {
  formAdicionarTarefa.classList.toggle("hidden");
});

//!Ouvindo o evento de 'submit' do nosso formulario
formAdicionarTarefa.addEventListener("submit", (evento) => {
  //->Evita que a pagina recarregue(Comportamento default)
  evento.preventDefault();

  //!Criação do objeto tarefa com a descrição vinda da nossa textarea.
  const tarefa = {
    descricao: textArea.value,
  };

  tarefas.push(tarefa);
  const elementoTarefa = criarElementoTarefa(tarefa);
  ulTarefas.append(elementoTarefa);
  atualizarTarefas();
  textArea.value = "";
  formAdicionarTarefa.classList.add("hidden");
});

//! Função para limpar o formulario
const limparFormulario = () => {
  textArea.value = "";
  limparFormulario.classList.add("hidden");
};
//!Vinculando ao botao cancelar
btnCancelar.addEventListener("click", limparFormulario);

tarefas.forEach((tarefa) => {
  const elementoTarefa = criarElementoTarefa(tarefa);
  ulTarefas.append(elementoTarefa);
});

//!Após criar o paragrafo
const paragrafo = document.createElement("p");
paragrafo.textContent = "Descricao da tarefa";
paragrafo.classList.add("app__section-task-list-item-description");

//!Apos criar o botao
const botao = document.createElement("botao");
botao.textContent = "Editar";
botao.classList.add("app_button-edit");

//!Carregando e exibindo tarefas do localStorage ao carregar a página
document.addEventListener("DOMContentLoaded", function () {
  const tarefasSalvas = JSON.parse(localStorage.getItem("tarefas")) || [];
  tarefasSalvas.forEach((tarefa) => {
    const elementoTarefa = criarElementoTarefa(tarefa);
    ulTarefas.append(elementoTarefa);
  });
});

//!Desmarca a tarafa atualmente em foco
document.addEventListener('FocoFinalizado', () => {
  if (tarefaSelecionada && liTarefaSelecionada) {

    liTarefaSelecionada.classList.remove('app__section-task-list-item-active');
    liTarefaSelecionada.classList.add('app__section-task-list-item-complete');
    liTarefaSelecionada.querySelector('button').setAttribute('disabled', 'disabled');

    tarefaSelecionada.completa = true;
    atualizarTarefas();

  }
});

//-> Função para remover tarefas completas ou todas as tarefas
const removerTarefas = (somenteCompletas) => {
  //|Determina o seletor com base no parâmetro somenteCompletas
    const seletor = somenteCompletas ? ".app__section-task-list-item-complete" : ".app__section-task-list-item";
    //#Seleciona todos os elementos com o seletor especificado
    document.querySelectorAll(seletor).forEach(elemento => {
        //#Remove cada elemento encontrado
        elemento.remove();

    })

    //|Atualiza o array de tarefas: remove tarefas completas se somenteCompletas for verdadeiro,
    //| caso contrário, remove todas as tarefas
    tarefas = somenteCompletas ? tarefas.filter(tarefa => !tarefa.completa) : [];
    atualizarTarefas()
}

btnRemoverConcluidas.onclick = () => removerTarefas(true);
btnRemoverTodas.onclick = () => removerTarefas(false);
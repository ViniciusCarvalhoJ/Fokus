const addTarefa = querySelector('.btn-add-task');
const form = querySelector('#form-add-task');

tarefas = [];

addTarefa.addEventList('click', () => {
    form.classList.toggle('hiden');
})

addTarefa.addEventList('submit',(e) => {
    e.preventDefault();
    const tarefa = {
        descricao: textArea.value
    }
    tarefas.push(tarefa)
    localStorage.setItem('tarefas', tarefas)
})
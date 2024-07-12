document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById('note-form');
    const myModal = document.getElementById('exampleModal');
    const myInputTitle = document.getElementById('note-title');
    const myInputContent = document.getElementById('note-content');


    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const title = myInputTitle.value;
        const content = myInputContent.value;

    
        console.log(`Título: ${title}, Contenido: ${content}`);

        const modal = bootstrap.Modal.getInstance(myModal);
        modal.hide();
    });

    myModal.addEventListener('shown.bs.modal', function () {
        myInputTitle.focus();
    });
});

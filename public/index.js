document.addEventListener('DOMContentLoaded', () => {
    const notesList = document.getElementById('notes-list');
    const noteForm = document.getElementById('note-form');
    const editNoteForm = document.getElementById('edit-note-form');
    const modalSaveButton = document.getElementById('modal-save-button');
  
    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
  
    const displayNotes = (notes) => {
        notesList.innerHTML = '';
        notes.forEach(note => {
            const noteElement = document.createElement('div');
            noteElement.classList.add('col-md-4', 'mb-4');
            noteElement.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center">
                            <h5 class="card-title">${note.title}</h5>
                            <a href="#" class="btn-trash" data-id="${note.id}">
                                <i class="bi bi-trash"></i>
                            </a>
                        </div>
                        <p class="card-text">${note.content}</p>
                        <p class="card-text">Etiquetas: ${note.tags}</p>
                        <p class="card-text text-muted"><small>Creado el ${formatDate(note.createdAt)}</small></p>
                        <button class="button-edit" data-bs-toggle="modal" data-bs-target="#editModal" data-id="${note.id}">Editar</button>
                    </div>
                </div>
            `;
            notesList.appendChild(noteElement);
        });
    };
  
    const loadNotes = () => {
        fetch('/api/notes')
            .then(response => response.json())
            .then(notes => displayNotes(notes))
            .catch(error => console.error('Error al cargar las notas:', error));
    };
  
    noteForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const title = document.getElementById('note-title').value;
        const content = document.getElementById('note-content').value;
        const tags = document.getElementById('note-tags').value.split(',').map(tag => tag.trim());
        const newNote = { title, content, tags };
  
        fetch('/api/notes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newNote)
        })
        .then(response => response.json())
        .then(note => {
            const modalElement = document.querySelector('#exampleModal');
            const modal = bootstrap.Modal.getInstance(modalElement);
            modal.hide();
            noteForm.reset();
            loadNotes();
        })
        .catch(error => console.error('Error al guardar la nota:', error));
    });
  
    notesList.addEventListener('click', (event) => {
      if (event.target.classList.contains('btn-trash') || event.target.closest('.btn-trash')) {
          event.preventDefault();
          const id = event.target.closest('.btn-trash').getAttribute('data-id');
          fetch(`/api/notes/${id}`, { method: 'DELETE' })
              .then(() => loadNotes())
              .catch(error => console.error('Error al eliminar la nota:', error));
      }
  
      if (event.target.classList.contains('button-edit') || event.target.closest('.button-edit')) {
          const id = event.target.closest('.button-edit').getAttribute('data-id');
          fetch(`/api/notes/${id}`)
              .then(response => response.json())
              .then(note => {
                  document.getElementById('edit-note-title').value = note.title;
                  document.getElementById('edit-note-content').value = note.content;
                  document.getElementById('edit-note-tags').value = note.tags.join(', ');
                  modalSaveButton.setAttribute('data-id', id);
              })
              .catch(error => console.error('Error al cargar la nota para editar:', error));
      }
    });
  
    editNoteForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const id = modalSaveButton.getAttribute('data-id');
      const title = document.getElementById('edit-note-title').value;
      const content = document.getElementById('edit-note-content').value;
      const tags = document.getElementById('edit-note-tags').value.split(',').map(tag => tag.trim());
      const updatedNote = { title, content, tags };
  
      fetch(`/api/notes/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedNote)
      })
      .then(response => response.json())
      .then(() => {
          const modalElement = document.querySelector('#editModal');
          const modal = bootstrap.Modal.getInstance(modalElement);
          modal.hide();
          editNoteForm.reset();
          loadNotes();
      })
      .catch(error => console.error('Error al actualizar la nota:', error));
    });
  
    loadNotes();
  });
  
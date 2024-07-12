document.addEventListener('DOMContentLoaded', () => {
    const notesList = document.getElementById('notes-list');
    const noteForm = document.getElementById('note-form');
  
    
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
                    <p class="card-text text-muted"><small>Creado el ${formatDate(note.createdAt)}</small></p>
                    <a href="#" class="btn btn-primary btn-edit" data-id="${note.id}">Editar</a>
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
  
      const newNote = {
        title,
        content,
        tags
      };
  
      fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
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
  
    
    container.addEventListener('click', (event) => {
        const deleteNote = {
            
          };
        if (event.target.classList.contains('btn-trash') || event.target.closest('.btn-trash')) {
            event.preventDefault();
            const id = event.target.closest('.btn-trash').getAttribute('data-id');
            body: JSON.stringify(deleteNote)
            
            fetch(`/api/notes/${id}`, {
                method: 'DELETE'
            })
            .then(() => loadNotes())
            .catch(error => console.error('Error al eliminar la nota:', error));
        }
    });
  
    
    notesList.addEventListener('click', (event) => {
      if (event.target.classList.contains('btn-edit')) {
        event.preventDefault();
        const id = event.target.getAttribute('data-id');
  
        fetch(`/api/notes/${id}`)
          .then(response => response.json())
          .then(note => {
            document.getElementById('note-title').value = note.title;
            document.getElementById('note-content').value = note.content;
            document.getElementById('note-tags').value = note.tags.join(', ');
  
            
            const modalSaveButton = document.getElementById('modal-save-button');
            modalSaveButton.innerText = 'Actualizar Nota';
            modalSaveButton.setAttribute('data-id', id);
  
            
            const modalElement = document.querySelector('#exampleModal');
            const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
            modal.show();
          })
          .catch(error => console.error('Error al obtener la nota:', error));
      }
    });
  
   
    document.getElementById('modal-save-button').addEventListener('click', () => {
      const id = document.getElementById('modal-save-button').getAttribute('data-id');
      const title = document.getElementById('note-title').value;
      const content = document.getElementById('note-content').value;
      const tags = document.getElementById('note-tags').value.split(',').map(tag => tag.trim());
  
      const updatedNote = {
        title,
        content,
        tags
      };
  
      fetch(`/api/notes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedNote)
      })
      .then(response => response.json())
      .then(note => {
        
        const modalElement = document.querySelector('#exampleModal');
        const modal = bootstrap.Modal.getInstance(modalElement);
        modal.hide();
  
        
        noteForm.reset();
  
       
        loadNotes();
      })
      .catch(error => console.error('Error al actualizar la nota:', error));
    });
  
    
    loadNotes();
  });
  
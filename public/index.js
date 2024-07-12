document.addEventListener('DOMContentLoaded', () => {
    const notesList = document.getElementById('notes-list');
    const noteForm = document.getElementById('note-form');
  
    const displayNotes = (notes) => {
      notesList.innerHTML = '';
      notes.forEach(note => {
        const noteElement = document.createElement('div');
        noteElement.classList.add('card', 'mb-3');
        noteElement.style.width = '18rem';
  
        noteElement.innerHTML = `
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <h5 class="card-title">${note.title}</h5>
              <a href="#" class="btn-trash" data-id="${note.id}">
                <i class="bi bi-trash"></i>
              </a>
            </div>
            <p class="card-text">${note.content}</p>
            <a href="#" class="btn btn-primary btn-edit" data-id="${note.id}">Editar</a>
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
  
    
    loadNotes();
  });
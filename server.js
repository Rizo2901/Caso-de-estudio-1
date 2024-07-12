const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3003;

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

let notes = [];

app.get('/api/notes', (req, res) => {
  res.json(notes);
});

app.post('/api/notes', (req, res) => {
  const { title, content, tags } = req.body;
  const newNote = {
    id: uuidv4(),
    title,
    content,
    createdAt: new Date().toISOString(), 
    updatedAt: new Date().toISOString(),  
    tags: tags || []
  };
  notes.push(newNote);
  res.status(201).json(newNote);
});

app.put('/api/notes/:id', (req, res) => {
  const { id } = req.params;
  const { title, content, tags } = req.body;
  const noteIndex = notes.findIndex(note => note.id === id);
  
  if (noteIndex !== -1) {
    notes[noteIndex] = {
      ...notes[noteIndex],
      title,
      content,
      tags: tags || notes[noteIndex].tags,
      updatedAt: new Date().toISOString()  
    };
    res.json(notes[noteIndex]);
  } else {
    res.status(404).json({ message: 'Nota no encontrada' });
  }
});

app.delete('/api/notes/:id', (req, res) => {
  const { id } = req.params;
  notes = notes.filter(note => note.id !== id);
  res.status(204).send();  
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}`);
});

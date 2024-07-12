const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3003;

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());


let notes = [
  {
    id: uuidv4(),
    title: "Nota 1",
    content: "Contenido de la nota 1",
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: ["etiqueta1", "etiqueta2"]
  },
  {
    id: uuidv4(),
    title: "Nota 2",
    content: "Contenido de la nota 2",
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: ["etiqueta3", "etiqueta4"]
  },
  {
    id: uuidv4(),
    title: "Nota 3",
    content: "Contenido de la nota 3",
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: ["etiqueta5", "etiqueta6"]
  }
];


app.get('/api/notes', (req, res) => {
  res.json(notes);
});


app.post('/api/notes', (req, res) => {
  const { title, content, tags } = req.body;
  const newNote = {
    id: uuidv4(),
    title,
    content,
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: tags || []
  };
  notes.push(newNote);
  res.status(201).json(newNote);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}`);
});

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

let list = [];

// Routes
app.get('/todos', (req, res) => {
    res.json(list);
});

app.get('/todos/:id', (req, res) => {
    const id = req.params.id;
    const task = list.find((task) => task.id == id);
    if (!task) {
        return res.status(400).json({ message: 'Task not exists' });
    }
    res.json(task);
});

app.post('/todos', (req, res) => {
    const { title, description, duedate } = req.body;
    const id = uuidv4(); // generate a unique ID
    const taskExists = list.find(task => task.id === id);
    if (taskExists) {
        return res.status(400).json({ message: 'Task with this ID already exists' });
    }
    if (!title || !description || !duedate) {
        return res.status(400).json({ message: 'Please fill all the fields' });
    }
    const newTask = { id, title, description, duedate, status: true };
    list.push(newTask);
    res.json(list);
});

app.put('/todos/:id', (req, res) => {
    const id = req.params.id;
    const { title, description, duedate } = req.body;
    const task = list.find((task) => task.id == id);
    if (!task) {
        return res.status(400).json({ message: 'Task not exists' });
    }
    task.title = title;
    task.description = description;
    task.duedate = duedate;
    res.json(task);
});

app.delete('/todos/:id', (req, res) => {
    const id = req.params.id;
    const taskIndex = list.findIndex(task => task.id == id);
    if (taskIndex === -1) {
        return res.status(400).json({ message: 'Task does not exist' });
    }
    list = list.filter((task) => task.id != id);
    res.json(list);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

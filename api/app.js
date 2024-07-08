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

app.post('/todos', (req, res) => {
    const {timestamp, title, description, duedate } = req.body;
    const id = uuidv4(); // generate a unique ID
    if (!title || !description || !duedate) {
        return res.status(400).json({ message: 'Please fill all the fields' });
    }
    // const timestamp = Date.now(); // Generate a timestamp for the task
    const newTask = {
        id,
        title,
        description,
        duedate,
        status: true,
        timestamp
    };
    list.push(newTask);
    res.json(list);
});

app.put('/todos/:id', (req, res) => {
    const id = req.params.id;
    const { title, description, duedate, status } = req.body; // Add 'status' here
    const task = list.find((task) => task.id == id);
    if (!task) {
        return res.status(400).json({ message: 'Task not exists' });
    }
    task.title = title;
    task.description = description;
    task.duedate = duedate;
    task.status = status; // Update the status
    res.json(task);
});


// New endpoint to clear completed tasks
app.delete('/todos/completed', (req, res) => {
    console.log(req.body);
    list = list.filter(task => task.status); // Ensure correct filtering
    console.log(list); // Log filtered list
    res.json(list);
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

const express = require('express');
const path = require('path');
const socket = require('socket.io');

const app = express();

const tasks = [];

app.use(express.static(path.join(__dirname, '/client/to-do-list/build')));

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '/client/to-do-list/build/index.html'));
});

const server = app.listen(process.env.PORT || 8000, () => {
	console.log('Server is rrunning...');
});

const io = socket(server);

io.on('connection', socket => {
	socket.emit('updateData', tasks);

	socket.on('addTask', task => {
		tasks.push(task);
		socket.broadcast.emit('updateTasks', tasks);
	});

	socket.on('removeTask', id => {
		const taskIndex = tasks.findIndex(item => item.id === id);
		tasks.splice(taskIndex, 1);
		socket.broadcast.emit('updatedTasks', tasks);
	});
});

app.use((req, res) => {
	res.status(404).send({ message: 'Not found...' });
});

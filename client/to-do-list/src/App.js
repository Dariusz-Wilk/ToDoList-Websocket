import { io } from 'socket.io-client';
import { useState, useEffect } from 'react';
const randomId = require('@dark_wilk/id-generator');

const App = () => {
	const [socket, setSocket] = useState();
	const [tasks, setTasks] = useState([]);
	const [taskName, setTaskName] = useState('');

	const removeTask = id => {
		setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
		socket.emit('removeTask', id);
	};

	const addTask = task => {
		setTasks(tasks => [...tasks, task]);
	};

	const submitForm = e => {
		e.preventDefault();
		const newTask = { name: taskName, id: randomId(5) };
		addTask(newTask);
		socket.emit('addTask', newTask);
		setTaskName('');
	};

	useEffect(() => {
		const socket = io('ws://localhost:8000', { transports: ['websocket'] });
		setSocket(socket);

		socket.on('updateData', tasks => {
			setTasks(tasks);
		});

		socket.on('addTask', task => {
			addTask(task);
		});

		socket.on('removeTask', id => {
			removeTask(id);
		});

		return () => {
			socket.disconnect();
		};
	}, []);

	return (
		<div className="App">
			<header>
				<h1>ToDoList.app</h1>
			</header>

			<section className="tasks-section" id="tasks-section">
				<h2>Tasks</h2>

				<ul className="tasks-section__list" id="tasks-list">
					{tasks.map(task => {
						return (
							<li className="task" key={task.id}>
								{task.name}{' '}
								<button
									className="btn btn--red"
									onClick={() => removeTask(task.id)}>
									Remove
								</button>
							</li>
						);
					})}
				</ul>

				<form id="add-task-form" onSubmit={e => submitForm(e)}>
					<input
						className="text-input"
						autoComplete="off"
						type="text"
						placeholder="Type your description"
						id="task-name"
						onChange={e => setTaskName(e.target.value)}
						value={taskName}
					/>
					<button className="btn" type="submit">
						Add
					</button>
				</form>
			</section>
		</div>
	);
};

export default App;

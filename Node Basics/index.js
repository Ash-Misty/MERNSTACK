const express = require('express');
const app = express();
const mongoose = require('mongoose')
const path=require('path')
mongoose.connect('mongodb://localhost:27017/todo')
	.then(() => console.log('Db connected'))
	.catch((err) => console.log(err));
const todo = new mongoose.Schema({
	title: {
		required: true,
		type: String
	},
	description: String
});
const todoModel = mongoose.model('Todo', todo)
app.use(express.static('public'))
app.use(express.static(path.join(__dirname,'public')))
app.use(express.json())
app.get('/', (request, response) => {
	console.log("Hello World");
	// response.send('<h2>Hello World</h2>');
	respond.send('public/index.html')
});
app.use(express.json())
app.post('/todo', async (req, res) => {
	const { title, description } = req.body;
	try {
		const newTodo = new todoModel({ title, description })
		await newTodo.save()
		res.status(201).json(newTodo)
	}
	catch (error) {
		console.log(error)
		res.status(500)
	}
});
app.get('/home', (request, response) => {
	console.log("Home")
	// response.send('public/home.html')
	response.sendFile(path.join(__dirname,'public','home.html'))
})
app.get('/form', (request, response) => {
	console.log("form page is shown")
	// response.send('public/home.html')
	response.sendFile(path.join(__dirname,'public','form.html'))
})

app.get('/api/user', (request, response)=>{
response.json({user:"ram", gender: "male"})
})
app.get('/todos', async (req, res) => {
	try {
		const todos = await todoModel.find();
		res.status(200).json(todos);
	}
	catch (error) {
		console.log("Error: ", error.message);
	}
});
app.get('/todos/:id', async (req, res) => {
	try {
		const todo = await todoModel.findById(req.params.id);
		res.status(200).json(todo);
	}
	catch (error) {
		console.log("Error: ", error.message);
	}
});
app.delete('/todos/:id', async (req, res) => {
	try {
		const todo = await todoModel.findByIdAndDelete(req.params.id);
		res.status(200).json("Deleted Successfully");
	}
	catch (error) {
		console.log("Error: ", error.message);
	}
});
app.patch('/todos/:id', async (req, res) => {
	try {
		const todo = await todoModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
		if (!todo) console.log("Not Found");
		res.status(200).json(todo);
	}
	catch (error) {
		console.log("Error: ", error.message);
	}
});



app.listen(3000, () => console.log("Server Started"));
require('dotenv').config();
const express = require('express');
const { InitDB } = require('./models/init.js');
const UsersController = require('./controllers/UsersController.js');

const app = express();
const cors = require('cors');

app.use(InitDB());

app.use(cors());

app.use(express.json());

app.post('/signup', UsersController.Signup);
app.post('/login', UsersController.Login);

app.listen(3100, () => {
	console.log('Server is running on port 3100');
});
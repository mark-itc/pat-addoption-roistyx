require('dotenv').config();
const express = require('express');
const app = express();
const { initDB } = require('./models/init.js');

const { createUser } = require('./models/UsersDAO.js');
const cors = require('cors');
app.use(express.json());

setTimeout(() => {
	createUser({
		username: 'testusernam',
		password: 'testpassword',
	});
}, 1000);

app.listen(3001, async () => {
	console.log('Server is running on port 3001');
	initDB();
});

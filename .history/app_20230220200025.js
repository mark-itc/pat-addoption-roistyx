require('dotenv').config();
const express = require('express');
const { InitDB } = require('./models/init.js');
const UsersController = require('./controllers/UsersController.js');
const CatalogController = require('./controllers/CatalogController.js');
const UsersDAO = require('./models/UsersDAO.js');
const jwt = require('jsonwebtoken');

const { AuthMiddleware } = require('./middlewares/AuthMiddleware');
const {
	ToLowerCaseMiddleware,
} = require('./middlewares/ToLowerCaseMiddleware.js');

const app = express();
const cors = require('cors');

InitDB();

app.use(
	cors({
		origin: 'http://localhost:3000',
		credentials: true,
	})
);

app.use(express.json());

app.post('/user/signup', UsersController.Signup);
app.post('/user/login', UsersController.Login);
app.get('/user/:id', UsersController.getUser);
app.post('/user/logout', AuthMiddleware, UsersController.Logout);
app.put('/user/:id', AuthMiddleware, UsersController.updateUser);
app.put('/pet/:id/save', AuthMiddleware, UsersController.savePet);
app.delete('/pet/:id/delete', AuthMiddleware, UsersController.deletePet);
app.put('/pet/:id/caregiver', AuthMiddleware, UsersController.caregiverStatus);
app.get('/', AuthMiddleware, authenticateToken);

function authenticateToken(req, res, next) {
	console.log('Authenticated', req.currentUser);
	res.status(200).json({
		success: true,
		message: 'User is authenticated',
		user: req.currentUser,
	});
	next();
}

// const authHeader = req.headers.authorization;
// const token = authHeader && authHeader.split(' ')[1];
// console.log('token', token);
// if (!token) {
// 	res.sendStatus(401);
// } else {
// 	jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
// 		if (err) {
// 			res.sendStatus(403);
// 		} else {
// 			req.user = user;
// 			next();
// 		}
// 	});
// }
// }

app.post(
	'/catalog/add-pet',
	AuthMiddleware,
	// ToLowerCaseMiddleware,
	CatalogController.addPet
);
app.get(
	'/catalog/user-pets/',
	AuthMiddleware,
	CatalogController.petListByUserId
);
app.put(
	'/catalog/update-pet/:id',
	AuthMiddleware,
	ToLowerCaseMiddleware,
	CatalogController.updatePet
);
app.get('/catalog/pet/:id', CatalogController.getPetById);
app.delete(
	'/catalog/delete-pet/:id',
	AuthMiddleware,
	CatalogController.deletePet
);
app.get('/catalog', CatalogController.searchPetCatalog);

app.get('/auth', AuthMiddleware, (req, res) => {
	console.log('req.currentUser', req.currentUser);
	const userObject = {
		username: req.currentUser.username,
		firstName: req.currentUser.firstName,
		lastName: req.currentUser.lastName,
		phoneNumber: req.currentUser.phoneNumber,
	};
	return res.status(200).json({
		success: true,
		message: 'User is authenticated',
		user: userObject,
	});
});

app.listen(3100, () => {
	console.log('Server is running on port 3100');
});
const UsersDAO = require('../models/UsersDAO');

const sha256 = require('sha256');
const jwt = require('jsonwebtoken');
const {
	SignupValidations,
	LoginValidations,
	StatusValidations,
} = require('./validations/UsersValidations');
const CatalogDAO = require('../models/CatalogDAO');
const { ObjectId } = require('mongodb');

module.exports = class UsersController {
	static async Signup(req, res) {
		console.log('req.body', req.body);

		try {
			const userObject = {
				username: req.body.username,
				password: req.body.password,
				// firstName: req.body.firstName,
				// lastName: req.body.lastName,
				// phoneNumber: req.body.phoneNumber,
			};
			console.log('userObject', userObject);

			const exitingUser = await UsersDAO.getUserByUsername(userObject.username);
			if (exitingUser) {
				return res.status(400).json({
					success: false,
					message: 'Username already exists',
				});
			}

			const validRequest = SignupValidations(userObject);
			if (!validRequest) {
				return res.status(400).json({
					success: false,
					message: 'Invalid request',
				});
			}

			if (await UsersDAO.getUserByUsername(userObject.username)) {
				console.log('Username already exists', userObject);
				return res.status(400).json({
					success: false,
					message: 'Username already exists',
				});
			}
			userObject.password = sha256(userObject.password);

			await UsersDAO.createUser(userObject);
			console.log('User created', userObject);
			return res.status(200).json({
				success: true,
				message: 'User created',
				userObj: userObject,
			});
		} catch (err) {
			console.log('Error in UsersController.Signup: ', err);
			return res.status(500).json({
				success: false,
				message: 'Unknown error',
			});
		}
	}

	static async Login(req, res) {
		try {
			// const userObject = {
			// 	username: req.body.username,
			// 	password: req.body.password,
			// };
			// const user = await UsersDAO.getUserByUsername(req.body.username);
			// console.log('user', user._id);
			// const validRequest = LoginValidations(req.body);
			// console.log('validRequest', validRequest);
			// if (!validRequest) {
			// 	return res.status(400).json({
			// 		success: false,
			// 		message: 'Please enter username and password',
			// 	});
			// }
			// if (!user || user.password !== sha256(req.body.password)) {
			// 	console.log('Wrong username or password');
			// 	return res.status(400).json({
			// 		success: false,
			// 		message: 'Wrong username or password',
			// 	});
			// }
			// // await UsersDAO.getUserById('63e206319ca263ccfef06d8f');
			// console.log('process.env.JWT_SECRET', process.env.JWT_SECRET);
			// const token = jwt.sign(
			// 	{ user_id: user._id, username: user.username },
			// 	process.env.JWT_SECRET
			// );
			// console.log('token', token);
			// return res.status(200).json({
			// 	success: true,
			// 	message: 'User logged in',
			// 	token,
			// });
		} catch (err) {
			console.log('Error in UsersController.Login: ', err);
			return res.status(500).json({
				success: false,
				message: 'Unknown error',
			});
		}
	}

	static async getUser(req, res) {
		console.log('req.params', req.params);
		const userId = req.params;
		const getUserObject = {
			username: req.body.username,
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			phoneNumber: req.body.phoneNumber,
		};
		try {
			const user = await UsersDAO.getUserById(userId);

			if (!user) {
				return res.status(400).json({
					success: false,
					message: 'User not found',
				});
			}

			return res.status(200).json({
				success: true,
				message: 'User found',
				user: getUserObject,
			});
		} catch (err) {
			console.log('Error in UsersController.getUser: ', err);
			return res.status(500).json({
				success: false,
				message: 'Could not get user',
			});
		}
	}

	static async updateUser(req, res) {
		const userId = req.params;
		const verifiedUserid = new ObjectId(userId);
		console.log(new ObjectId(userId));
		console.log(req.currentUser._id);
		if (req.currentUser._id !== verifiedUserid) {
			console.log('You are not authorized to update this user');
		}

		const updatedUserObject = {
			username: req.body.username,
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			phoneNumber: req.body.phoneNumber,
		};

		try {
			const user = await UsersDAO.getUserById(userId);

			if (!user) {
				return res.status(400).json({
					success: false,
					message: 'User not found',
				});
			}

			await UsersDAO.updateUserById(userId, updatedUserObject);
			console.log('User updated', updatedUserObject);
			return res.status(200).json({
				success: true,
				message: 'User updated',
				user: updatedUserObject,
			});
		} catch (err) {
			console.log('Error in UsersController.updateUser: ', err);
			return res.status(500).json({
				success: false,
				message: 'Could not update user',
			});
		}
	}

	static async savePet(req, res) {
		try {
			const petId = req.params.id;
			const petObj = await CatalogDAO.getPetById(petId);
			const currentUserId = req.currentUser._id;
			console.log('currentUserId log', currentUserId);

			console.log('petId', petId);

			if (!petObj)
				return res.status(400).json({
					success: false,
					message: 'Your are the owner of this pet or pet does not exist',
				});
			const savedPet = await UsersDAO.savePet(currentUserId, petId);
			console.log('savedPet', savedPet);
			return res.status(200).json({
				success: true,
				message: 'Pet saved',
			});
		} catch (err) {
			console.log('Error in CatalogController.savePet: ', err);
			return res.status(500).json({
				success: false,

				message: 'Could not save pet',
			});
		}
	}

	static async deletePet(req, res) {
		try {
			const petId = req.params.id;
			const currentUserId = req.currentUser._id;
			console.log('currentUserId log', currentUserId);
			console.log('petId', petId);

			// await UsersDAO.deleteSavedPet(currentUserId, petId);
			const savedList = await UsersDAO.deletePet(currentUserId, petId);

			console.log('savedList', savedList);
			return res.status(200).json({
				success: true,
				message: 'Pet deleted',
				save_list: savedList,
			});
		} catch (err) {
			console.log('Error in CatalogController.deleteSavedPet: ', err);
			return res.status(500).json({
				success: false,
				message: 'Could not delete pet',
			});
		}
	}

	static async caregiverStatus(req, res) {
		try {
			const currentUserId = req.currentUser._id;
			console.log('currentUserId log', currentUserId);
			const user = await UsersDAO.getUserById(currentUserId);
			console.log('user', user);
			if (!user) {
				return res.status(400).json({
					success: false,
					message: 'User not found',
				});
			}
			const status = await CatalogDAO.updatePetById(petId, petObject);
			console.log('status', status);
			return res.status(200).json({
				success: true,
				message: 'User found',
				status,
			});
		} catch (err) {
			console.log('Error in UsersController.caregiverStatus: ', err);
			return res.status(500).json({
				success: false,
				message: 'Could not get user',
			});
		}
	}
};

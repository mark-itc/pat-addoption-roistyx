const UsersDAO = require('../models/UsersDAO');
const sha256 = require('sha256');
const {
	SignupValidations: RegisterValidations,
} = require('./validations/UsersValidations');

module.exports = class UsersController {
	static async Signup(req, res) {
		try {
			const valid = RegisterValidations(req.body);
			console.log(valid);
			const userObject = {
				username: req.body.username,
				password: req.body.password,
			};

			if (await UsersDAO.getUserByUsername(userObject.username)) {
				return res.status(400).json({
					success: false,
					message: 'Username already exists',
				});
			}
			userObject.password = sha256(userObject.password);

			await UsersDAO.createUser(userObject);
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
};

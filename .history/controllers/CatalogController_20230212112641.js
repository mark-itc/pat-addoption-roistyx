const CatalogDAO = require('../models/CatalogDAO');

// const {
// 	SignupValidations: SignupValidations,
// } = require('./validations/userValidations');

module.exports = class CatalogController {
	constructor() {
		this.petObject = petObject = {
			pet_id: req.body.pet_id,
			specie: req.body.specie,
			breed: req.body.breed,
			sex: req.body.sex,
			age: req.body.age,
			weight: req.body.weight,
			height: req.body.height,
			color: req.body.color,
			hypoallergenic: req.body.hypoallergenic,
			name: req.body.name,
			bio: req.body.bio,
			profilePic: req.body.profilePic,
			adoptionStatus: req.body.adoptionStatus,
		};
	}
	static async addPet(req, res) {
		console.log('req.body', this.petObject);
		try {
			this.petObject.petCreatedByUsername = req.currentUser.username;
			// console.log('req.body.currentUser.username', req.currentUser);

			const insertedPet = await CatalogDAO.createPet(this.petObject);
			console.log('pet created', this.petObject);
			return res.status(200).json({
				success: true,
				message: 'pet created',
				petObj: insertedPet,
			});
		} catch (err) {
			console.log('Error in CatalogController.addPet: ', err);
			return res.status(500).json({
				success: false,
				message: 'Unknown error',
			});
		}
	}

	static async PetList(req, res) {
		try {
			const petList = await CatalogDAO.getUserPets(req.currentUser.username);
			console.log('petList', petList);
			return res.status(200).json({
				success: true,
				message: 'pet list',
				petList: petList,
			});
		} catch (err) {
			console.log('Error in CatalogController.PetList: ', err);
			return res.status(500).json({
				success: false,
				message: 'Unknown error',
			});
		}
	}
};

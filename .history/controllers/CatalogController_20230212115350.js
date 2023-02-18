const CatalogDAO = require('../models/CatalogDAO');

// const {
// 	SignupValidations: SignupValidations,
// } = require('./validations/userValidations');

module.exports = class CatalogController {
	static async addPet(req, res) {
		try {
			const petObject = {
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
			petObject.petCreatedByUsername = req.currentUser.username;
			// console.log('req.body.currentUser.username', req.currentUser);

			const insertedPet = await CatalogDAO.createPet(petObject);
			console.log('pet created', petObject);
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

	static async updatePet(req, res) {
		let petObject = {
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
		try {
			const petId = req.params;
			console.log('petId', petId);
			// const petObject = getPetId(petId);
			// const updatedPet = await CatalogDAO.updatePet(petId);
			// 	console.log('pet updated', updatedPet);
			// 	return res.status(200).json({
			// 		success: true,
			// 		message: 'pet updated',
			// 		petObj: updatedPet,
			// 	});
			return res.status(200).json({
				success: true,
				message: 'pet updated',
				petObj: petObject,
			});
		} catch (err) {
			console.log('Error in CatalogController.updatePet: ', err);
			return res.status(400).json({
				success: false,

				message: 'Could not update pet',
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

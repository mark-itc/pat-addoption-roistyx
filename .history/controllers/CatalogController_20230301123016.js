const CatalogDAO = require('../models/CatalogDAO');
const multer = require('multer');
const path = require('path');
const UsersDao = require('../models/UsersDAO');
const upload = multer({ dest: 'uploads/' });
const { ObjectId } = require('mongodb');

module.exports = class CatalogController {
	static async addPet(req, res) {
		console.log('req.body', req.body);
		try {
			const petObject = {
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
				status: req.body.status,
				created_at: JSON.stringify(new Date()),
				created_by: req.currentUser._id,
				currentOwner: req.currentUser._id,
			};
			// console.log('petObject', petObject);
			// petObject.petCreatedByUsername = req.currentUser.username;

			const insertedPet = await CatalogDAO.createPet(petObject);
			console.log('pet created', insertedPet);
			return res.status(200).json({
				success: true,
				message: ['Thank you', 'Your pet was added to the database.'],
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

	static async petListByUserId(req, res) {
		console.log('Hello world');
		const userId = req.currentUser._id;
		const petToUpdate = await CatalogDAO.getUserPets(userId);
		console.log('users pets', petToUpdate);

		if (petToUpdate.currentOwner !== userId) {
			console.log('Your are not the owner of this pet or pet does not exist');
			// return res.status(400).json({
			// 	success: false,
			// 	message: 'Your are not the owner of this pet or pet does not exist',
			// });
		}
		console.log('user matched');
		try {
			const petListById = await CatalogDAO.getUserPets(userId);
			// console.log('petList', petListById);
			return res.status(200).json({
				success: true,
				message: 'pet list',
				petList: petListById,
			});
		} catch (err) {
			console.log('Error in CatalogController.PetList: ', err);
			return res.status(500).json({
				success: false,
				message: 'Unknown error',
			});
		}
	}

	static async updatePet(req, res) {
		const petId = req.params.id;
		console.log('petId', petId);
		// const objectId = new ObjectId(req.body.id);
		// console.log('objectId', objectId);
		const petToUpdateObject = {
			_id: new ObjectId(req.body.id),
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
			status: req.body.status,
			modified_at: new Date(),
			currentOwner: req.currentUser._id,
		};

		try {
			const isPetExist = await CatalogDAO.getPetById(petId);
			// console.log('petObj controller', petObj);
			if (!isPetExist)
				return res.status(400).json({
					success: false,
					message: 'Pet does not exist',
				});
			const updatedPet = await CatalogDAO.updatePetById(
				petId,
				petToUpdateObject
			);
			console.log('updatedPet', updatedPet);
			return res.status(200).json({
				success: true,
				message: ['Thank you', 'Your pet was updated.'],
				petObj: await CatalogDAO.getPetById(petId),
			});
		} catch (err) {
			console.log('Error in CatalogController.updatePet: ', err);
			return res.status(400).json({
				success: false,

				message: 'Could not update pet',
			});
		}
	}

	static async getPetById(req, res) {
		try {
			const petId = req.params;
			console.log('petId', petId);
			const isPetExist = await CatalogDAO.getPetById(petId);
			if (!isPetExist)
				return {
					success: false,
					message: 'pet does not exist',
				};
			const pet = await CatalogDAO.getPetById(petId);
			console.log('pet', pet);
			return res.status(200).json({
				success: true,
				message: 'pet',
				pet: pet,
			});
		} catch (err) {
			console.log('Error in CatalogController.getPetById: ', err);
			return res.status(500).json({
				success: false,
				message: 'Could not get pet by id',
			});
		}
	}
	static async deletePet(req, res) {
		try {
			const petId = req.params.id;
			const petObj = await CatalogDAO.getPetById(petId);
			const currentUserId = req.currentUser._id.toString();
			const petOwnerId = petObj.currentOwner.toString();

			if (!petObj || currentUserId !== petOwnerId)
				return res.status(400).json({
					success: false,
					message: 'Your are not the owner of this pet or pet does not exist',
				});

			const deletePetById = await CatalogDAO.deletePetById(petId);
			console.log('deletePetById', deletePetById);
			return res.status(200).json({
				success: true,
				message: 'pet deleted',
				petObj: deletePetById,
			});
		} catch (err) {
			return res.status(500).json({
				success: false,
				message: 'could not delete pet',
			});
		}
	}

	static async searchField(req, res) {
		const searchQuery = req.query;
		console.log('Filtered', searchQuery);
		try {
			const petList = await CatalogDAO.getPetCatalog(searchQuery);
			if (petList.length === 0) {
				console.log('No pet found');
				return res.status(201).json({
					success: false,
					message: 'No pet found',
					petList: petList,
				});
			} else {
				return res.status(200).json({
					success: true,
					message: 'pet list',
					petList: petList,
				});
			}
		} catch (err) {
			console.log('Error in CatalogController.petList: ', err);
			return res.status(500).json({
				success: false,
				message: 'Could not get pet list',
			});
		}
	}

	static async searchEverywhere(req, res) {
		const searchQuery = req.params.term;

		console.log('Not filtered searchQuery', searchQuery);
		try {
			const petList = await CatalogDAO.getTextPetCatalog(searchQuery);
			if (petList.length === 0) {
				console.log('No pet found');
				return res.status(201).json({
					success: false,
					message: 'No pet found',
					petList: petList,
				});
			} else {
				return res.status(200).json({
					success: true,
					message: 'pet list',
					petList: petList,
				});
			}
		} catch (err) {
			console.log('Error in CatalogController.petList: ', err);
			return res.status(500).json({
				success: false,
				message: 'Could not get pet list',
			});
		}
	}
};

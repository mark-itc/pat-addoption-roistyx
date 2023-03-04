// injectDB injects this connection to the database
const { ObjectId } = require('mongodb');
const multer = require('multer');
const path = require('path');

let petCollection;

module.exports = class CatalogDAO {
	static async injectDB(connection) {
		if (!connection) return;

		try {
			petCollection = await connection.collection('catalog');
			petCollection.createIndex({ '$**': 'text' });
			console.log('Connected to MongoDB catalog');
		} catch (err) {
			console.log(
				`Unable to establish a collection or handle indexing in catalogDAO: ${err}`
			);
		}
	}

	static async createPet(petObject) {
		console.log('petObject', petObject);
		petObject.created_at = new Date();
		await petCollection.insertOne({ ...petObject });
		return petObject;
	}

	static async getSavedInCatalog(savedPetsArray) {
		savedPetsArray = savedPetsArray.map((petId) => new ObjectId(petId));
		console.log('savedPetsArray', savedPetsArray);
		const result = await petCollection
			.find({ _id: { $in: savedPetsArray } })
			.toArray();
		console.log('result', result);
		return result;
	}

	static async updatePetById(petId, petObject) {
		// console.log('petObject', petObject.status);
		try {
			const updateResponse = await petCollection.updateOne(
				{ _id: new ObjectId(petId) },
				{ $set: { ...petObject } }
			);
			return updateResponse;
		} catch (err) {
			console.log('Error in updatePetById: ', err);
			return { error: err };
		}
	}

	static async getPetById(petId) {
		// console.log('petId', petId);
		const result = await petCollection.findOne({
			_id: new ObjectId(petId),
		});
		console.log('result', result);
		return result;
	}

	static async getPetCatalog(searchQuery) {
		// console.log('searchQuery', searchQuery);
		const result = await petCollection.find(searchQuery).toArray();
		// console.log('result', result);
		return result;
	}

	static async getTextPetCatalog(searchQuery) {
		// console.log('searchQueryDAO', typeof searchQuery);
		const result = await petCollection
			.find({ $text: { $search: searchQuery } })
			.toArray();
		console.log('result', result);
		return result;
	}

	static async getUserPets(owner) {
		const userId = new ObjectId(owner);
		// console.log('owner', owner);

		const results = await petCollection
			.find({ currentOwner: userId })
			.toArray();

		console.log('results', results);
		return results;
	}

	static async deletePetById(petId) {
		try {
			console.log('petId', petId);
			const deleteResponse = await petCollection.deleteOne({
				_id: new ObjectId(petId),
			});
			return deleteResponse;
		} catch (err) {
			console.log('Error in deletePetById: ', err);
			return { error: err };
		}
	}
};

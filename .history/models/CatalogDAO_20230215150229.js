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
			console.log('Connected to MongoDB catalog');
		} catch (err) {
			console.log(
				`Unable to establish a collection handle in catalogDAO: ${err}`
			);
		}
	}

	static async createPet(petObject) {
		petObject.created_at = new Date();
		await petCollection.insertOne({ ...petObject });
	}

	static async updatePetById(petId, petObject) {
		console.log('petObject', petObject);
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
		try {
			petId = new ObjectId(petId);
			return await petCollection.findOne({ _id: petId });
		} catch (err) {
			console.log('Error in getPetById: ', err);
			return { error: err };
		}
	}

	static async getPetCatalog(searchQuery) {
		return await petCollection.find(searchQuery).toArray();
	}

	static async getUserPets(owner) {
		const userId = new ObjectId(owner);
		// const caca = petCollection.createIndex();
		const results = await petCollection
			.find({ currentOwner: userId })
			.toArray();

		console.log('results', results);
		// return await petCollection.aggregate({ $eq: 'cacame' }).toArray();
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

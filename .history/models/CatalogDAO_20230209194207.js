// injectDB injects this connection to the database

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
		console.log('petObject', petObject);
		petObject.created_at = new Date();
		await petCollection.insertOne({ ...petObject });
	}

	static async getUserPets(username) {
		return await petCollection.find({ currentUser: username }).toArray();
	}
};

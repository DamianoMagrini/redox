import { Db, MongoClient } from 'mongodb';

const mongo = new MongoClient(process.env.MONGO_URI!, {
	auth: {
		username: process.env.MONGO_USERNAME!,
		password: process.env.MONGO_PASSWORD!,
	},
});
let connected = false;

export const getDatabase = async (): Promise<Db> => {
	if (!connected) {
		await mongo.connect();
		connected = true;
	}

	const database = mongo.db(process.env.MONGO_DB_NAME!);
	return database;
};

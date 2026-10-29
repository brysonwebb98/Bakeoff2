import { MongoClient } from "mongodb";

const uri = import.meta.env.MONGODB_URI;

if (!uri) {
	throw new Error("MONGODB_URI is not defined");
}

const client = new MongoClient(uri);

let db;

export async function getDb() {
	if (!db) {
		await client.connect();
		db = client.db("bakeoff2");
	}

	return db;
}
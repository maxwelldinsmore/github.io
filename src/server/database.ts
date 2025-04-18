import { MongoClient, Db } from "mongodb";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

const USER_NAME = process.env.DB_USER_NAME;
const PASSWORD = process.env.MONGO_PASSWORD;
const DB_NAME = process.env.MONGO_DB;
const CLUSTER = process.env.CLUSTER_NAME;
console.log(
    `[INFO] MongoDB connection string: mongodb+srv://${USER_NAME}:${PASSWORD}@${CLUSTER}/${DB_NAME}?retryWrites=true&w=majority&appName=cluster0`)
//mongodb+srv://maxdinsmore:<db_password>@cluster0.umulu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
const MONGO_URI = `mongodb+srv://${USER_NAME}:${PASSWORD}@${CLUSTER}/${DB_NAME}?retryWrites=true&w=majority&appName=cluster0`;



class Database {
    private static instance: Database;
    private client: MongoClient;
    private db: Db | null = null;

    private constructor() {
        this.client = new MongoClient(MONGO_URI);
    }

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    public async connect(): Promise<Db> {
        if (!this.db) {
            try {
                await this.client.connect();
                console.log("Connected to MongoDB");
                this.db = this.client.db(DB_NAME);
            } catch (error) {
                console.error("[ERROR] Error connecting to MongoDB", error);
                throw new Error("Failed to connect to the database");
            }
        }
        return this.db;
    }


    public async disconnect(): Promise<void> {
        await this.client.close();
        console.log("Disconnected from MongoDB");
        this.db = null;
        
    }

}
export default Database;
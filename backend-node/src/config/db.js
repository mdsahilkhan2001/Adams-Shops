import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongod;

const connectDatabase = async () => {
  let uri = process.env.MONGODB_URI;

  if (!uri) {
    mongod = await MongoMemoryServer.create();
    uri = mongod.getUri();
    console.log("Using in-memory MongoDB for local development.");
  }

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  console.log("MongoDB connected successfully.");
};

const disconnectDatabase = async () => {
  await mongoose.disconnect();
  if (mongod) {
    await mongod.stop();
  }
};

export { disconnectDatabase };
export default connectDatabase;

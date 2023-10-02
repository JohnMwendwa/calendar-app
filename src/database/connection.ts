import { connect } from "mongoose";

const MONGO_URL: string =
  process.env.NODE_ENV !== "production"
    ? process.env.LOCAL_DB!
    : process.env.MONGO_URL!;

const connectDB = async () => {
  try {
    const conn = await connect(MONGO_URL);
    console.log(`Connected to database : ${conn.connection.host}`);
  } catch (error) {
    console.log(`Error : ${error}`);
    process.exit(1);
  }
};

export default connectDB;

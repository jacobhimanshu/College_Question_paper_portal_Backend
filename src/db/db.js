import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectdb = async () => {
  try {
    const connectionInst = await mongoose.connect(
      `${process.env.MONGO_URI}/${DB_NAME}`
    );
    console.log(
      " yes our db has connected",
      `${connectionInst.connection.host}`
    );
  } catch (error) {
    console.log("got error while connecting our db", error);
  }
};

export default connectdb;

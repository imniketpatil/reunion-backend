import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const dbUri = `${process.env.MONGODB_URL}`;
    const connectionInstance = await mongoose.connect(dbUri);
    console.log(
      `\n MongoDB connected successfully! DB HOST: ${connectionInstance.connection.host} \n`
    );
  } catch (error) {
    console.error("\nMONGO Connection Error:\n", error.message);
    process.exit(1);
  }
};

export default connectDB;

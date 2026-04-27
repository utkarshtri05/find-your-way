import mongoose from "mongoose";

export const connectDatabase = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is not configured");
  }

  if (mongoUri.includes("<db_password>")) {
    throw new Error("MONGODB_URI still contains <db_password>. Replace it with your real MongoDB password.");
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(mongoUri, {
    serverApi: {
      version: "1",
      strict: true,
      deprecationErrors: true,
    },
  });
};

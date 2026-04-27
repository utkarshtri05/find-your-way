import "./config/loadEnv.js";
import app from "./app.js";
import { connectDatabase } from "./config/db.js";

const port = Number(process.env.PORT) || 5000;

const listen = (targetPort) =>
  new Promise((resolve, reject) => {
    const server = app.listen(targetPort, () => resolve(server));
    server.on("error", reject);
  });

const startServer = async () => {
  try {
    await connectDatabase();
    await listen(port);
    console.log(`Find Your Way API running on port ${port}`);
  } catch (error) {
    if (error.code === "EADDRINUSE") {
      console.error(`Failed to start server: port ${port} is already in use`);
      process.exit(1);
    }

    console.error("Failed to start server", error);
    process.exit(1);
  }
};

startServer();

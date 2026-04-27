import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

const configDirectory = path.dirname(fileURLToPath(import.meta.url));
const serverRoot = path.resolve(configDirectory, "../..");
const projectRoot = path.resolve(serverRoot, "..");

const envFiles = [
  path.join(serverRoot, ".env.local"),
  path.join(projectRoot, ".env.local"),
  path.join(serverRoot, ".env"),
  path.join(projectRoot, ".env"),
];

envFiles.forEach((envFile) => {
  if (fs.existsSync(envFile)) {
    dotenv.config({ path: envFile });
  }
});

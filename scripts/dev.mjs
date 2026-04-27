import net from "net";
import { spawn } from "child_process";
import process from "process";

const DEFAULT_SERVER_PORT = Number(process.env.PORT) || 5000;
const DEFAULT_CLIENT_PORT = Number(process.env.CLIENT_PORT) || 5173;
const HOST = "127.0.0.1";
const HEALTH_PATH = "/api/health";

const quoteArgument = (value) => {
  if (!/[ \t"]/.test(value)) {
    return value;
  }

  return `"${value.replace(/"/g, '\\"')}"`;
};

const toSpawnCommand = (command, args) => {
  if (process.platform !== "win32") {
    return { command, args };
  }

  const commandLine = [command, ...args].map(quoteArgument).join(" ");

  return {
    command: process.env.ComSpec || "cmd.exe",
    args: ["/d", "/s", "/c", commandLine],
  };
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isPortFree = (port) =>
  new Promise((resolve) => {
    const server = net.createServer();

    server.once("error", () => resolve(false));
    server.once("listening", () => {
      server.close(() => resolve(true));
    });

    // Match Express' default bind behavior so we catch ports occupied on any interface.
    server.listen(port);
  });

const probeHealth = async (port) => {
  const urls = [`http://${HOST}:${port}${HEALTH_PATH}`, `http://localhost:${port}${HEALTH_PATH}`];

  for (const url of urls) {
    try {
      const response = await fetch(url);

      if (response.ok) {
        return true;
      }
    } catch {
      // Try the next loopback variant before treating the server as unavailable.
    }
  }

  return false;
};

const findAvailablePort = async (startingPort, maxAttempts = 20) => {
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const port = startingPort + attempt;

    if (await isPortFree(port)) {
      return port;
    }
  }

  throw new Error(`No free port found from ${startingPort} to ${startingPort + maxAttempts - 1}`);
};

const prefixStream = (stream, label) => {
  let buffer = "";

  stream.on("data", (chunk) => {
    buffer += chunk.toString();
    const lines = buffer.split(/\r?\n/);
    buffer = lines.pop() ?? "";

    lines.forEach((line) => {
      if (line.length) {
        console.log(`[${label}] ${line}`);
      }
    });
  });

  stream.on("end", () => {
    if (buffer.length) {
      console.log(`[${label}] ${buffer}`);
    }
  });
};

const spawnManagedProcess = (label, command, args, extraEnv = {}) => {
  const target = toSpawnCommand(command, args);
  const child = spawn(target.command, target.args, {
    cwd: process.cwd(),
    env: {
      ...process.env,
      ...extraEnv,
    },
  });

  prefixStream(child.stdout, label);
  prefixStream(child.stderr, label);

  return child;
};

const managedChildren = new Set();
let shuttingDown = false;

const stopChildren = (signal = "SIGTERM") => {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;

  managedChildren.forEach((child) => {
    if (!child.killed) {
      child.kill(signal);
    }
  });
};

const attachLifecycle = (child, { required = true } = {}) => {
  managedChildren.add(child);

  child.on("exit", (code, signal) => {
    managedChildren.delete(child);

    if (!shuttingDown && required && (code !== 0 || signal)) {
      console.error(`Process exited unexpectedly with code ${code ?? "null"}${signal ? ` and signal ${signal}` : ""}.`);
      stopChildren();
      process.exitCode = code ?? 1;
    }

    if (!shuttingDown && managedChildren.size === 0) {
      process.exit(code ?? 0);
    }
  });
};

const main = async () => {
  const existingServerHealthy = !(await isPortFree(DEFAULT_SERVER_PORT)) && (await probeHealth(DEFAULT_SERVER_PORT));

  let serverPort = DEFAULT_SERVER_PORT;
  let serverChild = null;

  if (existingServerHealthy) {
    console.log(`[server] Reusing existing API on http://${HOST}:${DEFAULT_SERVER_PORT}`);
  } else {
    if (!(await isPortFree(DEFAULT_SERVER_PORT))) {
      serverPort = await findAvailablePort(DEFAULT_SERVER_PORT + 1);
      console.log(
        `[server] Port ${DEFAULT_SERVER_PORT} is busy. Starting API on http://${HOST}:${serverPort} instead.`
      );
    }

    serverChild = spawnManagedProcess(
      "server",
      "npm",
      ["run", "dev", "--workspace", "server"],
      { PORT: String(serverPort) }
    );
    attachLifecycle(serverChild);

    const deadline = Date.now() + 20000;
    let healthy = false;

    while (Date.now() < deadline) {
      if (await probeHealth(serverPort)) {
        healthy = true;
        break;
      }

      if (serverChild.exitCode !== null) {
        throw new Error("Server process exited before becoming healthy");
      }

      await sleep(500);
    }

    if (!healthy) {
      throw new Error(`Server did not become healthy on port ${serverPort}`);
    }
  }

  const clientChild = spawnManagedProcess(
    "client",
    "npm",
    ["run", "dev", "--workspace", "client", "--", "--port", String(DEFAULT_CLIENT_PORT)],
    { VITE_API_BASE_URL: `http://localhost:${serverPort}/api` }
  );

  attachLifecycle(clientChild);
};

["SIGINT", "SIGTERM", "SIGHUP"].forEach((signal) => {
  process.on(signal, () => {
    stopChildren(signal);
  });
});

main().catch((error) => {
  console.error(`[dev] ${error.message}`);
  stopChildren();
  process.exit(1);
});

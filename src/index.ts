import dotenv from "dotenv";
dotenv.config();

import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions";
import readline from "readline";
import log from "npmlog";
import fs from "fs/promises";

const apiId = process.env.TELEGRAM_API_ID ? Number(process.env.TELEGRAM_API_ID) : 123456;
const apiHash = process.env.TELEGRAM_API_HASH || "your_api_hash_here";
const stringSession = new StringSession("");
const commandPrefix = process.env.COMMAND_PREFIX || "!";
const botName = process.env.PROJECT_CANIS_ALIAS || "Canis";
const autoReload = process.env.AUTO_RELOAD === "true";

log.info("Bot", `Initiating ${botName}...`);
log.info("Bot", `prefix: ${commandPrefix}`);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

(async () => {
  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });

  await client.start({
    phoneNumber: async () =>
      new Promise((resolve) =>
        rl.question("Please enter your number: ", resolve)
      ),
    password: async () =>
      new Promise((resolve) =>
        rl.question("Please enter your password: ", resolve)
      ),
    phoneCode: async () =>
      new Promise((resolve) =>
        rl.question("Please enter the code you received: ", resolve)
      ),
    onError: (err) => log.error("Client", `Error: ${err}`),
  });

  log.info("Bot", "Client started successfully");

   
  const tempDir = "./.session";
  await fs.mkdir(tempDir, { recursive: true });

  const tempPath = `${tempDir}/telegram_session.json`;
  await fs.writeFile(tempPath, stringSession.save() || "");

  await client.sendMessage("me", { message: "Hello!" });

})();

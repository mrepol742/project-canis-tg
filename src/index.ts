import dotenv from "dotenv";
dotenv.config();

import { TelegramClient } from "telegram";
import readline from "readline";
import log from "npmlog";
import fs from "fs";
import path from "path";
import loader from "@/components/utils/loader";
import StringSession, { save } from "@/components/utils/session";
import message from "@/components/events/message";

const apiId = process.env.TELEGRAM_API_ID
  ? Number(process.env.TELEGRAM_API_ID)
  : 123456;
const apiHash = process.env.TELEGRAM_API_HASH || "your_api_hash_here";
const commandPrefix = process.env.COMMAND_PREFIX || "!";
const botName = process.env.PROJECT_CANIS_ALIAS || "Canis";
const autoReload = process.env.AUTO_RELOAD === "true";
const commandsPath = path.join(__dirname, "commands");

log.info("Bot", `Initiating ${botName}...`);
log.info("Bot", `prefix: ${commandPrefix}`);

const commands: Record<
  string,
  {
    command: string;
    description: string;
    usage: string;
    example: string;
    role: string;
    cooldown: number;
    exec: (update: any, client: any) => void;
  }
> = {};

fs.readdirSync(commandsPath).forEach((file: string) => loader(file));

// Watch for changes
if (autoReload)
  fs.watch(commandsPath, (eventType: string, filename: string | null) => {
    if (filename && /\.js$|\.ts$/.test(filename)) {
      try {
        loader(filename);
      } catch (err) {
        log.error("Loader", `Failed to reload command: ${filename}`, err);
      }
    }
  });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

(async () => {
  const stringSession = await StringSession();

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

  save(stringSession);

  client.addEventHandler(async (update) => await message(update, client));
})();

export { commands };

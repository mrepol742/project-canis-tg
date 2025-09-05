import log from "npmlog"
import fs from "fs";
import path from "path";
import { commands } from "@/index";

const commandsPath = path.join(__dirname, "..", "..", "commands");

export default function (file: string, customPath?: string) {
  if (/\.js$|\.ts$/.test(file)) {
    const filePath = path.join(customPath || commandsPath, file);

    if (require.cache[require.resolve(filePath)])
      delete require.cache[require.resolve(filePath)];

    const commandModule = require(filePath);

    if (
      typeof commandModule.default === "function" &&
      commandModule.info &&
      commandModule.info.command
    ) {
      commands[commandModule.info.command] = {
        command: commandModule.info.command,
        description: commandModule.info.description || "No description",
        usage: commandModule.info.usage || "No usage",
        example: commandModule.info.example || "No example",
        role: commandModule.info.role || "user",
        cooldown: commandModule.info.cooldown || 5000,
        exec: commandModule.default,
      };
      log.info("Loader", `Loaded command: ${commandModule.info.command}`);
    }
  }
}

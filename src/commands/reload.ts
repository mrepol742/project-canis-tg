import axios from "axios";
import log from "npmlog";
import fs from "fs";
import path from "path";
import { commands } from "@/index";
import Loader from "@/components/utils/loader";
import message from "@/components/events/message";

export const info = {
  command: "reload",
  description: "Reload a specific command or all commands.",
  usage: "reload [command]",
  example: "reload ai",
  role: "admin",
  cooldown: 5000,
};

export default async function (update: any, client: any) {
  const query = update.msg.replace(/^reload\b\s*/i, "").trim();

  if (query.length !== 0) {
    if (!commands[query.toLocaleLowerCase()]) {
      await client.sendMessage("me", {
        message: `Command "${query}" not found.`,
      });
      return;
    }

    const commandsPath = path.join(__dirname, "..", "commands");
    const possibleExtensions = [".ts", ".js"];
    let found = false;

    for (const ext of possibleExtensions) {
      const filePath = path.join(commandsPath, `${query}${ext}`);
      if (fs.existsSync(filePath)) {
        Loader(`${query}${ext}`);
        found = true;
      }
    }

    if (!found)
      await client.sendMessage("me", {
        message: `
    Failed to load
    ${query}
    `,
      });
    if (found)
      await client.sendMessage("me", {
        message: `
      Successfully reloaded
      ${query}
      `,
      });
    return;
  }

  // Reload all commands
  let count = 0;
  const newCommands: string[] = [];
  const removeCommands: string[] = [];
  const commandsPath = path.join(__dirname, "..", "commands");

  fs.readdirSync(commandsPath).forEach((file) => {
    if (/\.js$|\.ts$/.test(file)) {
      const commandName = file.replace(/\.(js|ts)$/, "");
      if (!commands[commandName]) {
        newCommands.push(commandName);
      } else {
        removeCommands.push(commandName);
      }
      Loader(file);
      count++;
    }
  });

  let text = `
\`Reloaded\`
  ${count} commands
  `;

  if (newCommands.length > 0) {
    text += `
  \`Found new command(s)\`
  ${newCommands.join(", ")}
  `;
  }

  await client.sendMessage("me", {
    message: text,
  });
}

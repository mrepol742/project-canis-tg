import { Message } from "../../types/message";
import os from "os";
import timestamp from "../components/utils/timestamp";

export const info = {
  command: "uptime",
  description: "Get the bot's uptime and process information.",
  usage: "uptime",
  example: "uptime",
  role: "user",
  cooldown: 5000,
};

export default async function (msg: Message) {
  if (!/^uptime\b/i.test(msg.body)) return;

  const statsMessage = `
    \`${timestamp(process.uptime())}\`

    ID: #${process.pid}
    LA: ${os
      .loadavg()
      .map((n) => n.toFixed(2))
      .join(", ")}
    Node.js: ${process.version}
  `;

  await msg.reply(statsMessage);
}

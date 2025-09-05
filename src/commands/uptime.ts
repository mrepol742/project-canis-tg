import os from "os";
import timestamp from "@/components/utils/timestamp";
import log from "npmlog";
import message from "@/components/events/message";

export const info = {
  command: "uptime",
  description: "Get the bot's uptime and process information.",
  usage: "uptime",
  example: "uptime",
  role: "user",
  cooldown: 5000,
};

export default async function (update: any, client: any) {
  if (!/^uptime\b/i.test(update.msg)) return;

  const statsMessage = `
\`${timestamp(process.uptime())}\`

ID: #${process.pid}
LA: ${os
    .loadavg()
    .map((n) => n.toFixed(2))
    .join(", ")}
Node.js: ${process.version}
`.trim();

  await client.sendMessage("me", {
    message: statsMessage,
  });
}

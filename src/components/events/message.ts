import log from "npmlog";
import { commands } from "../utils/cmd/loader";
import Font from "@/components/utils/font";
import { errors } from "../utils/data";

const commandPrefix = process.env.COMMAND_PREFIX || "!";
const commandPrefixLess = process.env.COMMAND_PREFIX_LESS === "true";
const debug = process.env.DEBUG === "true";

export default async function (update: any, client: any) {
  let message = update?.message?.message;
  if (!message) return;

  message = message
    .normalize("NFKC")
    .replace(/[\u0300-\u036f\u00b4\u0060\u005e\u007e]/g, "")
    .trim();

  const prefix = !message.startsWith(commandPrefix);
  const senderId =
    update.message?.peerId?.userId.value ||
    update.message?.savedPeerId?.userId.value;

  /*
   * Prefix
   */
  if (!commandPrefixLess && prefix) return;

  /*
   * Check if the message starts with the command prefix.
   */
  const messageBody = message.split(" ")[0];
  const bodyHasPrefix = messageBody.startsWith(commandPrefix);
  const key = bodyHasPrefix
    ? messageBody.slice(commandPrefix.length).trim()
    : messageBody;
  const handler = commands[key.toLowerCase()];
  if (!handler) return;

  log.info("Message", senderId, update.message?.message.slice(0, 150));
  message = !bodyHasPrefix ? message : message.slice(commandPrefix.length);

  /*
   * Execute the command handler.
   */
  try {
    // this is for cross compatibility
    update.body = message;
    update.reply = async (message: string) => {
      return await client.sendMessage("me", {
        message: Font(message),
      });
    };

    handler.exec(update);
  } catch (error: any) {
    if (error.response) {
      const { status, headers } = error.response;
      const statusMessages: Record<number, string> = {
        429: "Rate limit exceeded",
        524: "timed out",
        500: "Internal server error",
        404: "Not found",
        403: "Forbidden",
        400: "Bad request",
        503: "Service unavailable",
        408: "Request timeout",
        401: "Unauthorized",
        422: "Unprocessable entity",
        504: "Gateway timeout",
        502: "Bad gateway",
        301: "Moved permanently",
      };

      if (statusMessages[status]) {
        const logFn = status === 500 ? log.error : log.warn;
        log.error(key, error);
        const text = `
        \`${errors[Math.floor(Math.random() * errors.length)]}\`\`

          We encountered an error while processing ${key}.
          Provider returned an error ${statusMessages[status]}.
          We notify the developers of the issue.
          Please try again later.
        `;
        await client.sendMessage(senderId, text);
        return;
      }
    }
    log.error(key, error);
    const text = `
    \`${errors[Math.floor(Math.random() * errors.length)]}\`

      We encountered an error while processing ${key}.
      We notify the developers of the issue.
      Please try again later.
      If the problem persists, please create an issue on GitHub.

      https://github.com/project-canis/issues/
    `;
    await client.sendMessage(senderId, text);
  }
}

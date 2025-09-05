import log from "npmlog";
import { commands } from "@/index";

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
  const senderId = update.message?.from_id?.user_id || update.message?.from_id;

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
  if (!handler) return

  if (debug) {
    log.info("Message", senderId, update.message?.message.slice(0, 150));
  }
  message = !bodyHasPrefix ? message : message.slice(commandPrefix.length);

  /*
   * Execute the command handler.
   */
  try {
    update.msg = message;
    await handler.exec(update, client);
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
        logFn(key, statusMessages[status], { status, headers });
        const text = `
        \`${statusMessages[status]}\`

          Error fetching data for "${key}" command the
          provider returned a ${status} status code.
        `;
        await client.sendMessage(
          senderId,
          text
        );
        return;
      }
    }
    log.error(
      key,
      "Unexpected error occurred while processing the request:",
      error
    );
    await client.sendMessage(
      senderId,
      `An unexpected error occurred while processing your request for "${key}". Please try again later.`
    );
  }
}

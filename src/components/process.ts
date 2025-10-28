import log from "./utils/log";
import redis from "./redis";

async function gracefulShutdown(signal: string): Promise<void> {
  log.info("Process", `Received ${signal}, shutting down...`);

  try {
    redis.sendCommand(["SAVE"]);
    await Promise.allSettled([redis.quit()]);
  } catch (err) {
    log.error("Browser", `Error closing browser: ${(err as Error).message}`);
  } finally {
    process.exit(0);
  }
}

["SIGINT", "SIGTERM", "SIGHUP"].forEach((signal) => {
  process.on(signal, async () => await gracefulShutdown(signal));
});

process.on("uncaughtException", (err, origin) => {
  log.error(
    "UncaughtException",
    `Exception: ${err.message}\nOrigin: ${origin}`,
  );
});

process.on("unhandledRejection", (reason, promise) => {
  log.error("UnhandledRejection", `Reason: ${reason}\nPromise: ${promise}`);
});

log.info("Process", "Event listeners for process signals have been set up.");

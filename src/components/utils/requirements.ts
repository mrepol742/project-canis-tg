import { execSync } from "child_process";
import * as process from "process";
import semver from "semver";
import log from "./log";
import redis from "../redis";

function checkNodeVersion() {
  const current = process.versions.node;
  const required = ">=18.0.0";
  if (!semver.satisfies(current, required)) {
    log.warn("Node", `Node.js ${required} required, found ${current}`);
  } else {
    log.info("Node", `Node.js ${current}`);
  }
}

async function checkRedis() {
  const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
  try {
    const start = Date.now();
    await redis.ping();
    const end = Date.now() - start;
    log.info("Redis", `Ping ${end}ms at ${redisUrl}`);
  } catch {
    log.error(
      "Redis",
      "Redis is required but not found (install redis-cli or ensure server is running).",
    );
    process.exit(1);
  }
}

function checkFFMPEG() {
  try {
    const version = execSync("ffmpeg -version")
      .toString()
      .split("\n")[0]
      .trim();
    log.info("FFMPEG", version);
  } catch {
    log.warn("FFMPEG", "FFmpeg not found. Some features may not work.");
  }
}

export function checkRequirements() {
  log.info("Requirements", "Checking bot requirements...");
  checkNodeVersion();
  checkRedis();
  checkFFMPEG();
  log.info("Requirements", "Bot requirements check complete.");
}

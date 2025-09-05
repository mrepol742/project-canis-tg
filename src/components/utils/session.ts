import { promises as fs } from "fs";
import { StringSession } from "telegram/sessions";

export default async function (): Promise<StringSession> {
  const tempDir = "./.session";
  await fs.mkdir(tempDir, { recursive: true });

  const tempPath = `${tempDir}/.telegram_session`;

  try {
    const session = await fs.readFile(tempPath, "utf-8");
    return new StringSession(session || "");
  } catch {
    // file doesn't exist or unreadable
    return new StringSession("");
  }
}

export async function save(stringSession: StringSession): Promise<void> {
  const tempDir = "./.session";
  await fs.mkdir(tempDir, { recursive: true });

  const tempPath = `${tempDir}/.telegram_session`;
  const sessionString = stringSession.save();

  await fs.writeFile(tempPath, sessionString || "");
}

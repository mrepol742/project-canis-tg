import fs from "fs";
import { StringSession } from "telegram/sessions";

export default async function (): Promise<StringSession> {
  const tempDir = "./.session";
  await fs.mkdirSync(tempDir, { recursive: true });

  const tempPath = `${tempDir}/.telegram_session`;

  if (!(await fs.existsSync(tempPath))) return new StringSession("");

  const session = await fs.readFileSync(tempPath);
  if (session) return new StringSession(session.toString());

  // fallback if the session file is empty or not found
  return new StringSession("");
}

export async function save(stringSession: StringSession): Promise<void> {
  const tempDir = "./.session";
  await fs.mkdirSync(tempDir, { recursive: true });

  const tempPath = `${tempDir}/.telegram_session`;
  const sessionString = stringSession.save();

  await fs.writeFileSync(tempPath, sessionString || "");
}

import crypto from "crypto";
 
const ALGORITHM = "aes-256-cbc";
const IV_LENGTH = 16;
 
// Generate a 32-byte key from BETTER_AUTH_SECRET
const secret = process.env.BETTER_AUTH_SECRET || "fallback_secret_32_chars_long_!!";
const ENCRYPTION_KEY = crypto.scryptSync(secret, "bucc-salt", 32);
 
export function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
}
 
export function decrypt(text: string): string {
  const parts = text.split(":");
  const iv = Buffer.from(parts.shift() || "", "hex");
  const encryptedTextString = parts.join(":");
  const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);
  let decrypted = decipher.update(encryptedTextString, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

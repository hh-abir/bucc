import fs from "fs/promises";
import path from "path";

export async function readContextFile(filename: string): Promise<string> {
  try {
    const filePath = path.join(process.cwd(), "public", filename);
    const content = await fs.readFile(filePath, "utf-8");
    return content;
  } catch (error) {
    console.error("Error reading file:", error);
    return "";
  }
}

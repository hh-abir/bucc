import dbConnect from "@/lib/dbConnect";
import AppConfig from "@/model/AppConfig";

export async function getConfigValue<T = string>(
  key: string,
  defaultValue?: T,
): Promise<T> {
  await dbConnect();
  const config: any = await AppConfig.findOne({ key }).lean();

  if (!config || config.value === null || config.value === undefined) {
    return defaultValue as T;
  }

  return config.value as T;
}

export async function setConfigValue<T = string>(
  key: string,
  value: T,
): Promise<void> {
  await dbConnect();
  await AppConfig.findOneAndUpdate(
    { key },
    { $set: { value } },
    { upsert: true, new: true },
  );
}

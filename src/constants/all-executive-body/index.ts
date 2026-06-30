import { StaticImageData } from "next/image";
import ExecutiveBody2020 from "./executive-body-2020/data";
import ExecutiveBody2021 from "./executive-body-2021/data";
import ExecutiveBody2022 from "./executive-body-2022/data";
import ExecutiveBody2023 from "./executive-body-2023/data";
import ExecutiveBody2024 from "./executive-body-2024/data";
import ExecutiveBody2025 from "./executive-body-2025/data";
import ExecutiveBody2026 from "./executive-body-2026/data";

export interface EBMember {
  fullName: string;
  nickName: string;
  department: string;
  designation: string;
  image: StaticImageData;
  facebookURL?: string;
  linkedinURL?: string;
  gitHubURL?: string;
}

export type EBData = Record<string, EBMember[]>;

export const allExecutiveBodies: EBData = {
  "2020": ExecutiveBody2020 as EBMember[],
  "2021": ExecutiveBody2021 as EBMember[],
  "2022": ExecutiveBody2022 as EBMember[],
  "2023": ExecutiveBody2023 as EBMember[],
  "2024": ExecutiveBody2024 as EBMember[],
  "2025": ExecutiveBody2025 as EBMember[],
  "2026": ExecutiveBody2026 as EBMember[],
};

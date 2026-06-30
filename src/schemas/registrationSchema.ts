import { z } from "zod";

export const registrationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  studentId: z
    .string()
    .regex(/^(?:[0-9]{8}|[0-9]{10})$/, "Please enter a valid 8 or 10-digit student ID"),
  email: z
    .string()
    .regex(
      /^[a-zA-Z0-9._%+-]+@(g\.)?bracu\.ac\.bd$/,
      "Please use a valid BRACU G-Suite email address",
    ),
  phoneNumber: z.string().min(1, "Phone number is required"),
  bracuDepartment: z.string().min(1, "BRACU Department is required"),
  buccDepartment: z.string().optional(),
  joinedSemester: z.string().min(1, "Joined Semester is required"),
  joinedYear: z.string().min(1, "Joined Year is required"),
});

export type RegistrationSchema = z.infer<typeof registrationSchema>;

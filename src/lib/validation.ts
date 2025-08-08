import { z } from "zod";

export const registerStep1Schema = z
  .object({
    email: z.string().email("Noto‘g‘ri email format"),
    password: z.string().min(8, "Parol kamida 8 belgidan iborat bo‘lishi kerak"),
    confirm_password: z.string().min(8, "Parolni tasdiqlang"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Parollar mos kelmaydi",
    path: ["confirm_password"],
  });

export const verifyEmailSchema = z.object({
  code: z.string().min(1, "Kod kiritilishi shart").regex(/^\d+$/, "Kod faqat raqamlardan iborat bo‘lishi kerak"),
});

export const signInSchema = z.object({
  email: z.string().email("Noto‘g‘ri email format"),
  password: z.string().min(8, "Parol kamida 8 belgidan iborat bo‘lishi kerak"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Noto‘g‘ri email format"),
});

export const resetPasswordSchema = z
  .object({
    new_password: z.string().min(8, "Yangi parol kamida 8 belgidan iborat bo‘lishi kerak"),
    confirm_password: z.string().min(8, "Parolni tasdiqlang"),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Parollar mos kelmaydi",
    path: ["confirm_password"],
  });
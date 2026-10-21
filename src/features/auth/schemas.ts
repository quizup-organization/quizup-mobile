import { z } from "zod";

/** Validation partagée du login (même rôle que les schémas web). */
export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email({ message: "Entre une adresse email valide." });

export const codeSchema = z
  .string()
  .regex(/^\d{6}$/, "Le code doit contenir 6 chiffres.");

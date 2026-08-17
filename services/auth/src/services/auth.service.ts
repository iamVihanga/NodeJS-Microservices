import { AppError } from "shared";
import { createUser, findByEmail } from "../repositories/user.repo";
import { type RegisterInput } from "../schemas/auth.schemas";
import bcrypt from "bcryptjs";
import { convertToPublicUser } from "../utils/auth.utils";

export async function register(input: RegisterInput) {
  const existing = await findByEmail(input.email);

  if (existing) {
    throw new AppError(409, "Email already exists");
  }

  const hashedPassword = await bcrypt.hash(input.password, 10);

  const user = await createUser({
    ...input,
    passwordHash: hashedPassword,
    role: "USER"
  });

  return convertToPublicUser(user);
}

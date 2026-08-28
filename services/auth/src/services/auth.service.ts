import { AppError } from "shared";
import { createUser, findByEmail, findById } from "../repositories/user.repo";
import { type LoginInput, type RegisterInput } from "../schemas/auth.schemas";
import bcrypt from "bcryptjs";
import { convertToPublicUser } from "../utils/auth.utils";
import { signToken } from "shared";

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

export async function login(input: LoginInput) {
  const existingUser = await findByEmail(input.email);

  if (!existingUser) throw new AppError(401, "Invalid email or password");

  const valid = await bcrypt.compare(
    input.password,
    existingUser.password_hash
  );

  if (!valid) throw new AppError(401, "Invalid email or password");

  const token = signToken({
    userId: existingUser.id,
    role: existingUser.role,
    name: existingUser.name
  });

  return {
    token,
    user: convertToPublicUser(existingUser)
  };
}

export async function getMe(userId: string) {
  const existingUser = await findById(userId);

  if (!existingUser) throw new AppError(401, "User not found");

  return convertToPublicUser(existingUser);
}

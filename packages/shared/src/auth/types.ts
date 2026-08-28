export type UserRole = "USER" | "ADMIN";

export type JwtPayload = {
  name: string;
  userId: string;
  role: string;
};

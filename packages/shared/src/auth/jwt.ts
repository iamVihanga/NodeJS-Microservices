import jwt from "jsonwebtoken";
import type { JwtPayload } from "./types";

export function extractJwtSecret(): string {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) throw new Error("JWT Secret not found");

  return jwtSecret;
}

export function extractExpiresIn(): jwt.SignOptions["expiresIn"] {
  const expiresIn = process.env.JWT_EXPIRES_IN;

  return (expiresIn as jwt.SignOptions["expiresIn"]) || "7d";
}

export function signToken(payload: JwtPayload) {
  const jwtSecret = extractJwtSecret();
  const expiresIn = extractExpiresIn();

  return jwt.sign(payload, jwtSecret, { expiresIn });
}

export function verifyToken(token: string): JwtPayload {
  const decodedToken = jwt.verify(token, extractJwtSecret());

  console.log(typeof decodedToken, decodedToken);

  if (
    typeof decodedToken !== "object" ||
    decodedToken === null ||
    typeof decodedToken.userId !== "string"
  ) {
    throw new Error("Invalid token payload");
  }

  return {
    userId: decodedToken.userId,
    name: decodedToken.name,
    role: decodedToken.role
  };
}

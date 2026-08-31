import type { Request, Response, NextFunction } from "express";
import { AppError, UserRole, verifyToken } from "shared";
import { getAllowedRoles, isPublicRoute } from "../rbac";

const IDENTITY_HEADERS = [
  "x-user-id",
  "x-user-role",
  "x-gateway-secret"
] as const;

function stripeIdentityHeaders(req: Request) {
  for (const header in IDENTITY_HEADERS) {
    delete req.headers[header];
  }
}

/**
 * Attach Gateway Secret
 * - used to prove in auth service, the particular request came through the gateway
 */
function attachGatewaySecret(req: Request) {
  const secret = process.env.GATEWAY_SECRET;

  if (!secret) {
    throw new AppError(500, "Gateway Secret isn't configured");
  }

  req.headers["x-gateway-secret"] = secret;
}

function requestPath(req: Request) {
  const combinedPath = `${req.baseUrl}${req.path}`;

  if (combinedPath.length > 1 && combinedPath.endsWith("/")) {
    return combinedPath.slice(0, -1);
  }

  return combinedPath || "/";
}

function attachUserHeaders(req: Request, userId: string, role: string) {
  req.headers["x-user-id"] = userId;
  req.headers["x-user-role"] = role;
}

/**
 * Gateway Auth Middleware
 * - runs on every /auth requests before the proxy forward to auth service
 */
export function gatewayAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    stripeIdentityHeaders(req);
    attachGatewaySecret(req);

    const path = requestPath(req);

    // Bypass for public routes
    if (isPublicRoute(req.method, path)) {
      return next();
    }

    const authHeader = req.header("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      throw new AppError(401, "Missing / Invalid auth token");
    }

    const token = authHeader.slice("Bearer ".length).trim();
    const payload = verifyToken(token);

    // RBAC
    const allowedRoles = getAllowedRoles(req.method, path);

    if (!allowedRoles) throw new AppError(404, "Route not found");

    if (!allowedRoles.includes(payload.role as UserRole)) {
      throw new AppError(
        401,
        "Forbidden - You do not have access to this route."
      );
    }

    attachUserHeaders(req, payload.userId, payload.role);
    return next();
  } catch (error) {
    if (error instanceof AppError) {
      return next(error);
    }

    return next(new AppError(401, "Invalid or Expired token"));
  }
}

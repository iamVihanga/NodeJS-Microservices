import { UserRole } from "shared";

export type RBACRule = {
  method: string;
  path: string;
  roles: UserRole[];
};

export const publicRoutes = [
  {
    method: "POST",
    path: "/auth/register"
  },
  {
    method: "POST",
    path: "/auth/login"
  }
] as const;

export const RBACRules: RBACRule[] = [
  {
    method: "GET",
    path: "/auth/me",
    roles: ["USER", "ADMIN"]
  },
  {
    method: "POST",
    path: "/tasks",
    roles: ["USER", "ADMIN"]
  },
  {
    method: "GET",
    path: "/tasks",
    roles: ["ADMIN", "USER"]
  },
  {
    method: "GET",
    path: "/tasks/:id",
    roles: ["ADMIN", "USER"]
  },
  {
    method: "DELETE",
    path: "/tasks/:id",
    roles: ["ADMIN", "USER"]
  }
];

export function matchPath(pattern: string, actualPath: string): boolean {
  if (pattern === actualPath) return true;

  const patternParts = pattern.split("/");
  const actualParts = actualPath.split("/");

  if (patternParts.length !== actualParts.length) {
    return false;
  }

  return patternParts.every(
    (part, index) => part.startsWith(":") || part === actualParts[index]
  );
}

export function isPublicRoute(method: string, path: string): boolean {
  return publicRoutes.some(
    (route) => route.method === method && matchPath(route.path, path)
  );
}

export function getAllowedRoles(
  method: string,
  path: string
): UserRole[] | null {
  const rule = RBACRules.find(
    (currentItem) =>
      currentItem.method === method && matchPath(currentItem.path, path)
  );

  return rule?.roles || null;
}

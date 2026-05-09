import { jwtDecode } from "jwt-decode";
import type { UserRole } from "@/shared/types";

interface JwtPayload {
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string | string[];
  role?: string | string[];
}

export function extractRoleFromToken(token: string): UserRole {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const raw =
      decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ??
      decoded.role ??
      "User";
    const s = Array.isArray(raw) ? raw[0] : raw;
    const r = (typeof s === "string" ? s : "User").trim().toLowerCase();
    if (r.includes("admin") || r.includes("super")) return "admin";
    return "user";
  } catch {
    return "user";
  }
}

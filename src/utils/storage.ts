export type Role = "admin" | "user" | "recruiter";

export interface User {
  token: string;
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
}

export function getUserFromStorage(): User | null {
  try {
    const data = localStorage.getItem("user");
    if (!data) return null;
    const parsed = JSON.parse(data);
    const role = (parsed.role || "").toLowerCase().trim() as Role;
    if (parsed?.token && parsed?.email && ["admin", "user", "recruiter"].includes(role)) {
      return { ...parsed, role };
    }
    return null;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
}

export function removeUserFromStorage(): void {
  localStorage.removeItem("user");
}

export function getFullName(user: User | null): string {
  if (!user) return "";
  return `${user.firstName} ${user.lastName}`.trim() || user.email;
}

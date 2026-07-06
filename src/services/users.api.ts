/**
 * Users API — /api/v1/users
 *
 * GET    /users          admin  → all users
 * PATCH  /users/:id/role admin  → assign role
 * DELETE /users/:id      admin  → delete user
 */
import api, { unwrap } from "./api";

export interface UserRecord {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export const getUsers = async (): Promise<UserRecord[]> => {
  const res = await api.get("/users");
  const raw = unwrap<UserRecord[]>(res);
  return Array.isArray(raw) ? raw : [];
};

export const assignUserRole = async (id: number, role: string): Promise<void> => {
  await api.patch(`/users/${id}/role`, { role });
};

export const deleteUser = async (id: number): Promise<void> => {
  await api.delete(`/users/${id}`);
};

import { apiFetch } from "./main";

export async function loginRequest(email: string, password: string) {
  return apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function registerRequest(
  email: string,
  password: string,
  username: string
) {
  return apiFetch("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password, username }),
  });
}

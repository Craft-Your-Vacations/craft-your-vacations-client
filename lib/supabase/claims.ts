// The custom claims (`user_role`, `phone_verified`, `has_name`) injected by the
// Supabase access-token hook live in the JWT payload, not on the user object.
// Decode them.
export function decodeClaims(accessToken?: string | null): {
  user_role?: string;
  phone_verified?: boolean;
  has_name?: boolean;
} {
  if (!accessToken) return {};
  try {
    const payload = accessToken.split(".")[1];
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return {};
  }
}

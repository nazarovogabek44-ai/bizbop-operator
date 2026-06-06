const AUTH_KEY = "bizbop-auth";

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(AUTH_KEY) === "1";
}

export function setAuthenticated(value: boolean): void {
  if (typeof window === "undefined") return;
  if (value) {
    sessionStorage.setItem(AUTH_KEY, "1");
  } else {
    sessionStorage.removeItem(AUTH_KEY);
  }
}

export function validateCredentials(login: string, password: string): boolean {
  const expectedLogin =
    process.env.NEXT_PUBLIC_OPERATOR_LOGIN?.trim() || "operator";
  const expectedPassword =
    process.env.NEXT_PUBLIC_OPERATOR_PASSWORD?.trim() || "operator";

  return (
    login.trim() === expectedLogin && password === expectedPassword
  );
}

export function getTelegramBotUrl(): string | null {
  const url = process.env.NEXT_PUBLIC_TELEGRAM_BOT_URL?.trim();
  return url || null;
}

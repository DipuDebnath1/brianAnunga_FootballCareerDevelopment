export const tokenTypes = {
  access: "access",
  refresh: "refresh",
  resetPassword: "resetPassword",
  verifyEmail: "verifyEmail",
} as const;

export type TokenType = (typeof tokenTypes)[keyof typeof tokenTypes];

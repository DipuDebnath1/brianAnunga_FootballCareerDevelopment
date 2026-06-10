export interface UserTokenPayload {
  userId: string;
  role: string;
  name: string;
  email: string;
  image: string;
}

export type OtpPurpose = "verify" | "reset";

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role: string;
}

import { Document, HydratedDocument, Model, Types } from "mongoose";
import { TokenType } from "./token.type";

export interface IToken extends Document {
  token: string;
  user: Types.ObjectId;
  type: TokenType;
  expires: Date;
  blacklisted: boolean;
}

export type TokenDocument = HydratedDocument<IToken>;
export type TokenModel = Model<IToken>;

export interface AccessTokenPayload {
  sub: string;
  type: TokenType;
  iat?: number;
  exp?: number;
}

import { Document, HydratedDocument, Model, Types } from "mongoose";

export interface IConversation extends Document {
  _id: Types.ObjectId;
  participants: [Types.ObjectId, Types.ObjectId];
  lastMessage?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export type ConversationDocument = HydratedDocument<IConversation>;
export type ConversationModel = Model<IConversation>;

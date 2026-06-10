import { Schema } from "mongoose";

const urlValidator = {
    validator: function (value: string) {
      if (!value) return true; // allow empty string
  
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    },
    message: (props: { value: string }) =>
      `${props.value} is not a valid URL`,
  };


export type TSocialMedia = {
    facebook?: string;
    x?: string;
    instagram?: string;
    linkedin?: string;
  };
  
export const socialMediaSchema = new Schema<TSocialMedia>(
    {
      facebook: {
        type: String,
        default: "",
        validate: urlValidator,
      },
      x: {
        type: String,
        default: "",
        validate: urlValidator,
      },
      instagram: {
        type: String,
        default: "",
        validate: urlValidator,
      },
      linkedin: {
        type: String,
        default: "",
        validate: urlValidator,
      },
    },
    { _id: false }
  );
import mongoose, { Schema, model, Model } from "mongoose"
import { UserType } from "../interfaces/user"

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: {
        values: ["admin", "client"],
        message: "Invalid role",
        default: "client",
        required: true,
      },
    },
  },
  {
    timestamps: true,
  }
)

const UserModel: Model<UserType> =
  mongoose.models.User ?? model("User", UserSchema)

export { UserModel }

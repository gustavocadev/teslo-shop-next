import mongoose, { Schema, model, Model } from "mongoose"
import { ProductType } from "../interfaces/products"

const ProductSchema = new Schema(
  {
    description: {
      type: String,
      required: true,
      default: "",
    },
    images: [
      {
        type: String,
      },
    ],
    inStock: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    sizes: [
      {
        type: String,
        enum: {
          values: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
          message:
            "enum validator failed for path `{PATH}` with value `{VALUE}`",
        },
      },
    ],
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    tags: [
      {
        type: String,
      },
    ],
    title: {
      type: String,
      required: true,
      default: "",
    },
    type: {
      type: String,
      enum: {
        values: ["shirts", "pants", "hoodies", "hats"],
        message: "enum validator failed for path `{PATH}` with value `{VALUE}`",
      },
      default: "shirts",
    },

    gender: {
      type: String,
      enum: {
        values: ["men", "women", "kid", "unisex"],
        message: "enum validator failed for path `{PATH}` with value `{VALUE}`",
      },
      default: "women",
    },
  },
  {
    timestamps: true,
  }
)

// todo : create index from mongodb
ProductSchema.index({ title: "text", tags: "text" })

const ProductModel: Model<ProductType> =
  mongoose.models.Product ?? model<ProductType>("Product", ProductSchema)

export default ProductModel

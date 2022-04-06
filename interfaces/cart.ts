import type { ValidSizeType } from "."

export type CartProductType = {
  _id: string
  image: string
  price: number
  size?: ValidSizeType
  slug: string
  title: string
  quantity: number
  gender: "men" | "women" | "kid" | "unisex"
}

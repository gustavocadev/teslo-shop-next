export type ValidSizeType = "XS" | "S" | "M" | "L" | "XL" | "XXL" | "XXXL"
export type ValidType = "shirts" | "pants" | "hoodies" | "hats"

export type ProductType = {
  _id: string
  description: string
  images: string[]
  inStock: number
  price: number
  sizes: ValidSizeType[]
  slug: string
  tags: string[]
  title: string
  type: ValidType
  gender: "men" | "women" | "kid" | "unisex"

  // todo: add createdAt and updatedAt
  createdAt: string
  updatedAt: string
}

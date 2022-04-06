import { NextApiRequest, NextApiResponse } from "next"
import { db, SHOP_CONSTANTS } from "../../../database"
import ProductModel from "../../../models/Product"
import { ProductType } from "../../../interfaces/products"

type Data =
  | ProductType
  | {
      message: string
    }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return getProducts(req, res)
    default:
      return res.status(405).json({
        message: `Method ${req.method} not allowed`,
      })
  }
}

const getProducts = async (req: NextApiRequest, res: NextApiResponse) => {
  const { gender = "all" } = req.query as {
    gender: string
  }

  let condition = {}

  const { validGenders } = SHOP_CONSTANTS
  if (gender !== "all" && validGenders.includes(gender)) {
    condition = {
      gender,
    }
  }

  await db.connect()
  const products = await ProductModel.find(condition)
    .select("title images price inStock slug -_id")
    .lean()
  await db.disconnect()

  const updatedProducts = products.map((product) => {
    product.images = product.images.map((img) => {
      return img.includes("http")
        ? img
        : `${process.env.HOST_NAME}products/${img}`
    })

    return product
  })
  res.status(200).json(updatedProducts)
}

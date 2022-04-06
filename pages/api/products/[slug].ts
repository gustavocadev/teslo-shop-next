import { NextApiRequest, NextApiResponse } from "next"
import { db } from "../../../database"
import { ProductType } from "../../../interfaces"
import ProductModel from "../../../models/Product"

type Data =
  | {
      message: string
    }
  | ProductType

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET":
      return getProductBySlug(req, res)

    default:
      return res.status(400).json({
        message: "bad request",
      })
  }
}

const getProductBySlug = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const { slug } = req.query as {
    slug: string
  }
  await db.connect()
  const productFound = await ProductModel.findOne({ slug }).lean()
  await db.disconnect()

  if (!productFound) {
    return res.status(404).json({
      message: "Product not found",
    })
  }
  productFound.images = productFound.images.map((img) => {
    return img.includes("http")
      ? img
      : `${process.env.HOST_NAME}products/${img}`
  })

  res.status(200).json(productFound)
}

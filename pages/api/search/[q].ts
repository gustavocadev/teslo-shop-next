import { NextApiRequest, NextApiResponse } from "next"
import { db } from "../../../database"
import { ProductType } from "../../../interfaces"
import ProductModel from "../../../models/Product"

type Data =
  | {
      message: string
    }
  | ProductType[]

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return searchProducts(req, res)
    default:
      return res.status(405).json({
        message: `Bad request`,
      })
  }
}

const searchProducts = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  let { q = "" } = req.query as {
    q: string
  }
  if (q.length === 0) {
    return res.status(400).json({
      message: "Must provide a search query",
    })
  }

  q = q.toString().toLowerCase()

  await db.connect()
  const products = await ProductModel.find({
    $text: {
      $search: q,
    },
  })
    .select("title images price inStock slug -_id")
    .lean()

  await db.disconnect()

  return res.status(200).json(products)
}

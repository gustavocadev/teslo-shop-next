import { NextApiRequest, NextApiResponse } from "next"
import { db } from "../../../database"
import { OrderType } from "../../../interfaces/order"
import { OrderModel } from "../../../models"
type Data =
  | {
      message: string
    }
  | OrderType[]

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET":
      return getOrders(req, res)

    default:
      return res.status(405).json({ message: "Method not allowed" })
  }

  res.status(200).json({ message: "Hello World" })
}
async function getOrders(req: NextApiRequest, res: NextApiResponse<Data>) {
  await db.connect()
  const orders = await OrderModel.find()
    .sort({ createdAt: "desc" })
    .populate("user", "name email")
    .lean()

  await db.disconnect()

  return res.status(200).json(orders)
}

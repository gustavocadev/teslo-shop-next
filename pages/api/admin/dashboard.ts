import { NextApiRequest, NextApiResponse } from "next"
import { db } from "../../../database"
import { OrderModel, ProductModel, UserModel } from "../../../models"

type Data = {
  numberOfOrders: number
  paidOrders: number
  notPaidOrders: number
  numberOfClients: number
  numberOfProducts: number
  productsWithNoInventory: number
  lowInventory: number
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await db.connect()
  // Group of the promises that will be executed in parallel
  const [
    numberOfOrders,
    paidOrders,
    numberOfProducts,
    productsWithNoInventory,
    lowInventory,
  ] = await Promise.all([
    OrderModel.count(),
    OrderModel.find({ isPaid: true }).count(),
    ProductModel.count(),
    ProductModel.find({ inStock: 0 }).count(),
    ProductModel.find({ inStock: { $lte: 10 } }).count(),
  ])

  // Group of the promises that will be executed in parallel
  const numberOfClients = await UserModel.find({ role: "client" }).count()

  // Group of the promises that will be executed in parallel
  await db.disconnect()

  res.status(200).json({
    notPaidOrders: numberOfOrders - paidOrders,
    numberOfOrders,
    paidOrders,
    numberOfClients,
    numberOfProducts,
    productsWithNoInventory,
    lowInventory,
  })
}

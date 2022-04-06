import { NextApiRequest, NextApiResponse } from "next"
import { seedDatabase } from "../../database"
import ProductModel from "../../models/Product"
import { db } from "../../database"
import { UserModel, OrderModel } from "../../models"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (process.env.NODE_ENV === "production") {
    return res.status(401).json({ message: "Unauthorized" })
  }
  const { initialData } = seedDatabase
  const { products, users } = initialData

  await db.connect()
  await Promise.all([
    UserModel.deleteMany(),
    ProductModel.deleteMany(),
    OrderModel.deleteMany(),
  ])
  await UserModel.insertMany(users)

  await ProductModel.insertMany(products)

  await await db.disconnect()

  res.status(200).json({ message: "Seeded" })
}

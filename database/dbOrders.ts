import { OrderType } from "../interfaces"
import { isValidObjectId } from "mongoose"
import { db } from "."
import { OrderModel } from "../models"

export const getOrderById = async (id: string): Promise<OrderType | null> => {
  if (!isValidObjectId(id)) {
    return null
  }

  await db.connect()

  const order = await OrderModel.findById(id).lean()
  await db.disconnect()

  if (!order) {
    return null
  }

  return JSON.parse(JSON.stringify(order))
}

export const getOrdersByUser = async (userId: string): Promise<OrderType[]> => {
  if (!isValidObjectId(userId)) {
    return []
  }
  await db.connect()
  const orders = await OrderModel.find({ user: userId }).lean()
  await db.disconnect()

  return JSON.parse(JSON.stringify(orders))
}

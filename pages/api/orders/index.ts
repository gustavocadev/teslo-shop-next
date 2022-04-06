import { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react"
import { db } from "../../../database"
import { OrderType } from "../../../interfaces"
import { ProductModel, OrderModel } from "../../../models"

type Data =
  | {
      message: string
    }
  | OrderType

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "POST":
      return createOrder(req, res)

    default:
      return res.status(400).json({ message: "Bad request" })
  }
}

const createOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { orderItems, total } = req.body as OrderType

  // verify that we have the user session
  const session = (await getSession({ req })) as any

  if (!session) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  // create an array with the products that that person wants to buy
  const productsIds = orderItems.map((product) => product._id)
  await db.connect()
  const dbProducts = await ProductModel.find({
    _id: {
      $in: productsIds,
    },
  })
  try {
    const subTotal = orderItems.reduce((prev, current) => {
      console.log(current._id)
      const currentPrice = dbProducts.find(
        (prod) => prod.id === current._id
      )!.price

      if (!currentPrice) {
        throw new Error("Verifique el carrito de nuevo, producto no existe")
      }

      return currentPrice * current.quantity + prev
    }, 0)

    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE ?? 0)
    const backendTotal = subTotal + taxRate * subTotal

    if (total !== backendTotal) {
      throw new Error("El total no cuadra con el monto enviado")
    }
    // todo bien hasta este punto
    const userId = session.user._id
    const newOrder = new OrderModel({
      ...req.body,
      isPaid: false,
      user: userId,
    })

    newOrder.total = Math.round(newOrder.total * 100) / 100

    await newOrder.save()
    await db.disconnect()

    return res.status(201).json({ message: "Orden creada" })
  } catch (error: any) {
    await db.disconnect()
    console.log(error)
    res.status(400).json({
      message: error.message ?? "Revise los logs del servidor",
    })
  }

  return res.status(200).json(req.body)
}

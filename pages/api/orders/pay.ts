import { NextApiRequest, NextApiResponse } from "next"
import { db } from "../../../database"
import { Paypal } from "../../../interfaces"
import { OrderModel } from "../../../models"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "POST":
      return payOrder(req, res)

    default:
      return res.status(400).json({ message: "Bad request" })
  }
}

const getPaypalBearerToken = async (): Promise<string | null> => {
  const PAYPAL_CLIENT = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
  const PAYPAL_SECRET = process.env.PAYPAL_SECRET

  const base64Token = Buffer.from(
    `${PAYPAL_CLIENT}:${PAYPAL_SECRET}`,
    "utf-8"
  ).toString("base64")

  const body = new URLSearchParams(`grant_type=client_credentials`)
  try {
    const resp = await fetch(`${process.env.PAYPAL_OAUTH_URL ?? ""}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${base64Token}`,
      },
      body: body,
    })
    const data = await resp.json()
    return data.access_token
  } catch (error) {
    console.log(error)

    return null
  }
}

const payOrder = async (req: NextApiRequest, res: NextApiResponse) => {
  // todo: validar session del usuario
  // todo: validar mongo id

  // Get token from Paypal
  const paypalBearerToken = await getPaypalBearerToken()

  if (!paypalBearerToken) {
    return res.status(500).json({ message: "Error getting token" })
  }

  const { transactionId = "", orderId = "" } = req.body
  // let's the request to paypal
  const resp = await fetch(
    `${process.env.PAYPAL_ORDERS_URL}/${transactionId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${paypalBearerToken}`,
      },
    }
  )
  const data: Paypal.PaypalOrderStatusResponse = await resp.json()
  console.log(data)

  // if the order is not paid, we return an error
  if (data.status !== "COMPLETED") {
    return res.status(401).json({
      message: "Order no reconocido",
    })
  }

  await db.connect()
  const dbOrder = await OrderModel.findById(orderId)

  // if the order is not found
  if (!dbOrder) {
    await db.disconnect()
    return res.status(400).json({
      message: "Order no existe",
    })
  }
  // if the amount of paypal is different from the amount of the order do nothing
  if (dbOrder.total !== Number(data.purchase_units[0].amount.value)) {
    await db.disconnect()
    return res.status(400).json({
      message: "Los montos de Paypal y nuestra orden no coinciden",
    })
  }

  // if all is ok, we update the order
  dbOrder.transactionId = transactionId
  dbOrder.isPaid = true
  await dbOrder.save()
  await db.disconnect()

  return res.status(200).json({ message: "Orden pagada" })
}

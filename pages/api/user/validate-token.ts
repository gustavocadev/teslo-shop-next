import { NextApiRequest, NextApiResponse } from "next"
import { db } from "../../../database"
import { UserModel } from "../../../models"
import bcryptjs from "bcryptjs"
import { jwt } from "../../../utils/"

type Data =
  | {
      message: string
    }
  | {
      user: {
        email: string
        role: string
        name: string
      }
      token: string
    }

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return checkJWT(req, res)
    case "POST":
      return
    default:
      return res.status(405).json({ message: "Method not allowed" })
  }
}

const checkJWT = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { token = "" } = req.cookies

  let userId = ""
  try {
    userId = await jwt.isValidToken(token)
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" })
  }

  await db.connect()
  const user = await UserModel.findById(userId).lean()
  await db.disconnect()

  // Check if user exists
  if (!user) {
    return res.status(400).json({ message: "User not found" })
  }

  const newToken = await jwt.signToken(userId, user.email)

  return res.status(200).json({
    user: {
      email: user.email,
      role: user.role,
      name: user.name,
    },
    token: newToken, // jwt,
  })
}

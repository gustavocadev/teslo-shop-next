import { NextApiRequest, NextApiResponse } from "next"
import { db } from "../../../database"
import { connect } from "../../../database/db"
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
      return
    case "POST":
      return loginUser(req, res)
    default:
      return res.status(405).json({ message: "Method not allowed" })
  }
}

const loginUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { email = "", password = "" } = req.body

  await db.connect()
  const user = await UserModel.findOne({ email }).lean()
  await db.disconnect()

  // Check if user exists
  if (!user) {
    return res.status(400).json({ message: "User not found" })
  }

  // Check if password is correct
  const isMatch = await bcryptjs.compare(password, user.password!)

  // If password is incorrect
  if (!isMatch) {
    return res.status(400).json({ message: "Wrong password" })
  }

  const { role, name } = user

  const token = await jwt.signToken(user._id, email)

  return res.status(200).json({
    user: {
      email,
      role,
      name,
    },
    token, // jwt,
  })
}

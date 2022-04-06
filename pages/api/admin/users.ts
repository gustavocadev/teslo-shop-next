import { NextApiResponse, NextApiRequest } from "next"
import { db } from "../../../database"
import { UserType } from "../../../interfaces"
import { UserModel } from "../../../models"
import { isValidObjectId } from "mongoose"

type Data =
  | {
      message: string
    }
  | UserType[]
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return getUsers(req, res)
    case "PUT":
      return updateUsers(req, res)
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
async function getUsers(req: NextApiRequest, res: NextApiResponse<Data>) {
  await db.connect()
  const users = await UserModel.find().select("-password").lean()
  await db.disconnect()

  return res.status(200).json(users)
}

async function updateUsers(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { userId = "", role = "" } = req.body

  if (!isValidObjectId(userId)) {
    return res.status(400).json({ message: "Invalid userId" })
  }

  const validRoles = ["admin", "client"]

  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: "Invalid role" })
  }

  await db.connect()

  const user = await UserModel.findById(userId)

  if (!user) {
    await db.disconnect()
    return res.status(404).json({ message: "User not found" })
  }

  user.role = role
  await user.save()
  await db.disconnect()

  return res.status(200).json({ message: "User updated" })
}

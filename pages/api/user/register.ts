import { NextApiRequest, NextApiResponse } from "next"
import { db } from "../../../database"
import { UserModel } from "../../../models"
import bcryptjs from "bcryptjs"
import { jwt } from "../../../utils/"
import { isValidEmail } from "../../../utils/validations"

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
      return registerUser(req, res)
    default:
      return res.status(405).json({ message: "Method not allowed" })
  }
}

const registerUser = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const { email = "", password = "", name = "" } = req.body

  await db.connect()

  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password should be at least 6 characters" })
  }

  // check is the name is valid
  if (name.length < 2) {
    return res
      .status(400)
      .json({ message: "Name should be at least 2 characters" })
  }

  // Check if email is valid
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: "Invalid email" })
  }

  // Check if user exists
  const userFound = await UserModel.findOne({ email }).lean()

  if (userFound) {
    await db.disconnect()
    return res.status(400).json({ message: "User already exists" })
  }

  // Hash password
  const hashedPassword = await bcryptjs.hash(password, 10)

  // Create user
  const newUser = new UserModel({
    email,
    password: hashedPassword,
    name,
    role: "client",
  })

  try {
    await newUser.save({ validateBeforeSave: true })
    await db.disconnect()
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: "Internal server error" })
  }

  // Create token
  const token = await jwt.signToken(newUser._id, email)

  // Return user and token
  return res.status(200).json({
    user: {
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    },
    token, // jwt,
  })
}

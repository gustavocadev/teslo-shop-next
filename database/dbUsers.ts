import { db } from "."
import { UserModel } from "../models"
import bcryptjs from "bcryptjs"

export const checkUserEmailPassword = async (
  email: string,
  password: string
) => {
  await db.connect()
  const user = await UserModel.findOne({ email }).lean()
  await db.disconnect()
  if (!user) {
    return null
  }
  const isMatchPassword = await bcryptjs.compare(password, user.password!)
  if (!isMatchPassword) return null

  const { role, name, _id } = user
  return {
    role,
    name,
    _id,
    email: email.toLowerCase(),
  }
}

// Esta funcion crea o verifica un usuario de OAuth
export const oAUthToDbUser = async (oAuthEmail: string, oAuthName: string) => {
  await db.connect()
  const user = await UserModel.findOne({ email: oAuthEmail }).lean()
  await db.disconnect()
  if (user) {
    await db.disconnect()
    const { _id, name, email, role } = user
    return { _id, name, email, role }
  }

  const newUser = new UserModel({
    email: oAuthEmail,
    name: oAuthName,
    password: "@",
    role: "client",
  })
  await newUser.save()
  await db.connect()
  const { _id, name, email, role } = newUser
  return {
    _id,
    name,
    email,
    role,
  }
}

import { NextApiResponse, NextApiRequest } from "next"
import { ProductType } from "../../../interfaces"
import { ProductModel } from "../../../models"
import { db } from "../../../database"
import { isValidObjectId } from "mongoose"
import { v2 as cloudinary } from "cloudinary"

cloudinary.config(process.env.CLOUDINARY_URL ?? "")

type Data =
  | {
      message: string
    }
  | ProductType[]
  | ProductType

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return getProducts(req, res)
    case "POST":
      return createProduct(req, res)
    case "PUT":
      return updateProduct(req, res)
    default:
      return res.status(404).json({ message: "Not found" })
  }
}

const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  await db.connect()
  const products = await ProductModel.find().sort({ title: "asc" }).lean()
  await db.disconnect()

  // todo: tendremos que actulizar las imagenes
  const updatedProducts = products.map((product) => {
    product.images = product.images.map((img) => {
      return img.includes("http")
        ? img
        : `${process.env.HOST_NAME}products/${img}`
    })

    return product
  })

  return res.status(200).json(updatedProducts)
}
const updateProduct = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const { _id = "", images = [] } = req.body as ProductType

  if (!isValidObjectId(_id)) {
    return res.status(400).json({ message: "Invalid id" })
  }

  if (images.length < 2) {
    return res.status(400).json({ message: "Es necesario al menos 2 imagenes" })
  }

  // todo: posiblemente un localhost:3000/products/aewqewq.jpg

  try {
    await db.connect()

    const product = await ProductModel.findById(_id)

    if (!product) {
      await db.disconnect()
      return res.status(404).json({ message: "Product not found with that id" })
    }
    // todo: tendremos que eliminar las imagenes en cloudinary
    product.images.forEach(async (image) => {
      if (!images.includes(image)) {
        const [fileId, extesion] = image
          .substring(image.lastIndexOf("/") + 1)
          .split(".")
        console.log({ fileId, extesion })
        await cloudinary.uploader.destroy(fileId)
      }
    })
    await product.update(req.body)

    await db.disconnect()

    res.status(200).json(product)
  } catch (error) {
    console.log(error)
    await db.disconnect()
    res.status(500).json({ message: "Internal server error" })
  }
}
const createProduct = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const { images = [] } = req.body as ProductType
  if (images.length < 2) {
    return res.status(400).json({ message: "Es necesario al menos 2 imagenes" })
  }
  // todo: posiblemente un localhost:3000/products/aewqewq.jpg

  try {
    await db.connect()
    const productInDB = await ProductModel.findOne({
      slug: req.body.slug,
    }).lean()
    if (productInDB) {
      await db.disconnect()
      return res.status(400).json({ message: "Product already exists" })
    }

    const product = new ProductModel(req.body)
    await product.save()

    await db.disconnect()

    res.status(201).json(product)
  } catch (error) {
    console.log(error)
    await db.disconnect()
    res.status(500).json({ message: "Internal server error" })
  }
}

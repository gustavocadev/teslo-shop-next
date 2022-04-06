import { ProductType } from "../interfaces"
import { ProductModel } from "../models"
import { db } from "./"

const getProductBySlug = async (slug: string): Promise<ProductType | null> => {
  await db.connect()
  const product = await ProductModel.findOne({
    slug,
  }).lean()
  await db.disconnect()

  if (!product) {
    return null
  }

  // todo: un procesamiento de las imagenes cuando las subamos al server
  product.images = product.images.map((img) => {
    return img.includes("http")
      ? img
      : `${process.env.HOST_NAME}products/${img}`
  })

  return JSON.parse(JSON.stringify(product))
}

type ProductSlug = {
  slug: string // slug of the product
}

const getAllProductSlugs = async (): Promise<ProductSlug[]> => {
  await db.connect()
  const slugs = await ProductModel.find().select("slug -_id").lean()

  await db.disconnect()

  return slugs
}

const getProductsByTerm = async (term: string) => {
  await db.connect()
  term = term.toString().toLowerCase()

  const products = await ProductModel.find({
    $text: {
      $search: term,
    },
  })
    .select("title images price inStock slug -_id")
    .lean()
  await db.disconnect()

  const updatedProducts = products.map((product) => {
    product.images = product.images.map((img) => {
      return img.includes("http")
        ? img
        : `${process.env.HOST_NAME}products/${img}`
    })

    return product
  })

  return updatedProducts
}

const getAllProducts = async (): Promise<ProductType[]> => {
  await db.connect()
  const products = await ProductModel.find().lean()
  await db.disconnect()

  const updatedProducts = products.map((product) => {
    product.images = product.images.map((img) => {
      return img.includes("http")
        ? img
        : `${process.env.HOST_NAME}products/${img}`
    })
  })

  return JSON.parse(JSON.stringify(updatedProducts))
}

export {
  getProductBySlug,
  getAllProductSlugs,
  getProductsByTerm,
  getAllProducts,
}

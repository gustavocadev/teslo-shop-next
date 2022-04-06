import { NextApiResponse, NextApiRequest } from "next"
import formidable from "formidable"
import fs from "fs/promises"
import { v2 as cloudinary } from "cloudinary"

cloudinary.config(process.env.CLOUDINARY_URL ?? "")

type Data = {
  message: string
}

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST":
      return await uploadFile(req, res)

    default:
      return res.status(404).json({ message: "Not found" })
  }
}

const saveFile = async (file: formidable.File) => {
  // const data = await fs.readFile(file.filepath)
  // await fs.writeFile(`./public/${file.originalFilename}`, data)
  // await fs.unlink(file.filepath) // elimina la data guardada en memoria
  // return
  // using cloudinary
  const { secure_url } = await cloudinary.uploader.upload(file.filepath)
  return secure_url
}

const parseFiles = async (req: NextApiRequest): Promise<string> => {
  return new Promise((resolve, reject) => {
    const form = new formidable.IncomingForm()
    form.parse(req, async (err, fields, files) => {
      console.log({ err, fields, files })
      if (err) {
        return reject(err)
      }
      const filePath = await saveFile(files.file as formidable.File)
      resolve(filePath)
    })
  })
}

async function uploadFile(req: NextApiRequest, res: NextApiResponse<Data>) {
  const imageUrl = await parseFiles(req)
  return res.status(200).json({ message: imageUrl })
}

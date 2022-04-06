import { NextApiRequest, NextApiResponse } from "next"

type Data = {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    default:
      return res.status(404).json({
        message: `It doesn't exist an endpoint for ${req.method} method here`,
      })
  }
}

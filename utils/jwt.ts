import jwt from "jsonwebtoken"

const signToken = (_id: string, email: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const payload = {
      _id,
      email,
    }

    if (!process.env.JWT_SECRET_SEED) {
      reject("JWT_SECRET_SEED is not defined")
    }

    const newJWT = jwt.sign(payload, process.env.JWT_SECRET_SEED!, {
      expiresIn: "30d",
    })

    resolve(newJWT)
  })
}

const isValidToken = (token: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!process.env.JWT_SECRET_SEED) {
      reject("JWT_SECRET_SEED is not defined")
    }
    try {
      const { _id } = jwt.verify(token, process.env.JWT_SECRET_SEED ?? "") as {
        _id: string
      }
      resolve(_id)
    } catch (error) {
      reject(error)
    }
  })
}

export { signToken, isValidToken }

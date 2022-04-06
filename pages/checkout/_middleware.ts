import { getToken } from "next-auth/jwt"
import { NextRequest, NextFetchEvent, NextResponse } from "next/server"
import { jwt } from "../../utils"
export async function middleware(req: NextRequest | any, ev: NextFetchEvent) {
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const { origin } = req.nextUrl
  // console.log({ session })

  if (!session) {
    const requestedPage = req.page.name
    return NextResponse.redirect(`${origin}/auth/login?page=${requestedPage}`)
  }
  return NextResponse.next()
  // const { token = "" } = req.cookies
  // const { pathname, origin } = req.nextUrl
  // try {
  //   await jwt.isValidToken(token)
  //   return NextResponse.next()
  // } catch (error) {
  //   const requestedPage = req.page.name
  //   return NextResponse.redirect(`${origin}/auth/login?page=${requestedPage}`)
  // }
}

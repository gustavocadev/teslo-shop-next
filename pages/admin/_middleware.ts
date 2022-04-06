import { getToken } from "next-auth/jwt"
import { NextRequest, NextFetchEvent, NextResponse } from "next/server"
export async function middleware(req: NextRequest | any, ev: NextFetchEvent) {
  const session: any = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })
  const { origin } = req.nextUrl

  if (!session) {
    const requestedPage = req.page.name
    return NextResponse.redirect(`${origin}/auth/login?page=${requestedPage}`)
  }

  const validRoles = ["admin"]

  if (!validRoles.includes(session.user.role)) {
    return NextResponse.redirect(`${origin}/`)
  }

  return NextResponse.next()
}

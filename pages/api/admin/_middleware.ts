import { getToken } from "next-auth/jwt"
import { NextRequest, NextFetchEvent, NextResponse } from "next/server"
export async function middleware(req: NextRequest | any, ev: NextFetchEvent) {
  const session: any = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })
  const { origin } = req.nextUrl

  if (!session) {
    return new Response(JSON.stringify({ message: "No autorizado" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }

  const validRoles = ["admin"]

  if (!validRoles.includes(session.user.role)) {
    return new Response(JSON.stringify({ message: "No autorizado" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }

  return NextResponse.next()
}

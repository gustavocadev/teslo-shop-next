import { FC, useEffect, useReducer } from "react"
import { UserType } from "../../interfaces"
import { AuthContext, authReducer } from "./"
import Cookie from "js-cookie"
import { useRouter } from "next/router"
import { useSession, signOut } from "next-auth/react"

export type AuthState = {
  isLoggedIn: boolean
  user?: UserType
}

const AUTH_INITIAL_STATE: AuthState = {
  isLoggedIn: false,
  user: undefined,
}

const AuthProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE)
  const { status, data } = useSession()

  const router = useRouter()

  useEffect(() => {
    if (status === "authenticated") {
      dispatch({
        type: "LOGIN",
        payload: data?.user as UserType,
      })
    }
  }, [status, data])

  const checkToken = async () => {
    // if it doesn't exist a token, then we don't need to check
    if (!Cookie.get("token")) return

    try {
      const resp = await fetch("/api/user/validate-token")
      const { user, token } = await resp.json()

      // Set token to cookie
      Cookie.set("token", token)
      // Set user to state
      dispatch({
        type: "LOGIN",
        payload: user,
      })
    } catch (error) {
      Cookie.remove("token")
    }
  }
  // useEffect(() => {
  //   checkToken()
  // }, [])

  const loginUser = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })
      if (!response.ok) {
        throw new Error("Login failed")
      }
      const user = await response.json()
      const { token } = user

      // Set token to cookie
      Cookie.set("token", token)

      // Dispatch login action
      dispatch({ type: "LOGIN", payload: user })
      return true
    } catch (error) {
      // console.error(String(error))
      return false
    }
  }

  const registerUser = async (
    name: string,
    email: string,
    password: string
  ): Promise<{ hasError: boolean; message?: string }> => {
    try {
      const response = await fetch("/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      })
      if (!response.ok) {
        return {
          hasError: true,
          message: "Error al registrar el usuario en la base de datos",
        }
      }
      const data = await response.json()
      const { token, user } = data

      // Set token to cookie
      Cookie.set("token", token)

      // Dispatch login action
      dispatch({ type: "LOGIN", payload: user })
      return {
        hasError: false,
      }
    } catch (error) {
      // console.error(String(error))
      return {
        hasError: true,
        message: "Error al registrar usuario",
      }
    }
  }

  const logoutUser = async () => {
    // Cookie.remove("token")
    Cookie.remove("cart")

    Cookie.remove("firstName")
    Cookie.remove("lastName")
    Cookie.remove("address")
    Cookie.remove("address2")
    Cookie.remove("postalCode")
    Cookie.remove("city")
    Cookie.remove("country")
    Cookie.remove("phone")

    await signOut()
    // router.reload()

    dispatch({ type: "LOGOUT" })
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        // methods
        loginUser,
        registerUser,
        logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
export { AuthProvider }

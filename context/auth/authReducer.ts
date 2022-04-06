import { UserType } from "../../interfaces"
import { AuthState } from "./"

type AuthActionType =
  | {
      type: "LOGIN"
      payload: UserType
    }
  | {
      type: "LOGOUT"
    }

const authReducer = (state: AuthState, action: AuthActionType) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        isLoggedIn: true,
        user: action.payload,
      }
    case "LOGOUT":
      return {
        ...state,
        isLoggedIn: false,
        user: undefined,
      }
    default:
      return state
  }
}
export { authReducer }

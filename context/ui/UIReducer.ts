import { UIState } from "./"

type UIActionType = {
  type: "TOGGLE_MENU"
}

const uiReducer = (state: UIState, action: UIActionType) => {
  switch (action.type) {
    case "TOGGLE_MENU":
      return {
        ...state,
        isMenuOpen: !state.isMenuOpen,
      }
    default:
      return state
  }
}
export { uiReducer }

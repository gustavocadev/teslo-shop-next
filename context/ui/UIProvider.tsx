import { FC, useReducer } from "react"
import { UIContext, uiReducer } from "./"

export type UIState = {
  isMenuOpen: boolean
}

const UI_initial_state: UIState = {
  isMenuOpen: false,
}

const UIProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(uiReducer, UI_initial_state)

  // actions to dispatch
  const toggleSideMenu = () => dispatch({ type: "TOGGLE_MENU" })

  return (
    <UIContext.Provider
      value={{
        ...state,
        toggleSideMenu,
      }}
    >
      {children}
    </UIContext.Provider>
  )
}
export { UIProvider }

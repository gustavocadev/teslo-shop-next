import { createContext } from "react"

type ContextProps = {
  isMenuOpen: boolean

  // methods
  toggleSideMenu: () => void
}

export const UIContext = createContext({} as ContextProps)

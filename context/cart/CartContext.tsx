import { createContext } from "react"
import { ShippingAddress, CartProductType } from "../../interfaces"

type ContextProps = {
  cart: CartProductType[]
  numberOfItems: number
  subTotal: number
  taxRate: number
  total: number
  isLoaded: boolean

  shippingAddress?: ShippingAddress
  // methods
  addProductToCart: (product: CartProductType) => void
  updateCartQuantity: (product: CartProductType) => void
  removeCartProduct: (product: CartProductType) => void
  updateAddress: (address: ShippingAddress) => void
  createOrder: () => Promise<{ hasError: boolean; message: string }>
}

export const CartContext = createContext({} as ContextProps)

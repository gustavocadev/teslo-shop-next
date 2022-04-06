import { CartState } from "."
import { CartProductType, ShippingAddress } from "../../interfaces"

type CartActionType =
  | {
      type: "LOAD_CART_FROM_COOKIES"
      payload: CartProductType[]
    }
  | {
      type: "UPDATE_PRODUCTS_IN_CART"
      payload: CartProductType[]
    }
  | {
      type: "CHANGE_CART_QUANTITY"
      payload: CartProductType[]
    }
  | {
      type: "REMOVE_PRODUCT_IN_CART"
      payload: CartProductType[]
    }
  | {
      type: "UPDATE_ORDER_SUMMARY"
      payload: {
        numberOfItems: number
        subTotal: number
        taxRate: number
        total: number
      }
    }
  | {
      type: "LOAD_ADDRESS_FROM_COOKIES"
      payload: ShippingAddress
    }
  | {
      type: "UPDATE_ADDRESS"
      payload: ShippingAddress
    }
  | {
      type: "ORDER_COMPLETE"
    }
const cartReducer = (state: CartState, action: CartActionType) => {
  switch (action.type) {
    case "LOAD_CART_FROM_COOKIES":
      return {
        ...state,
        isLoaded: true,
        cart: action.payload,
      }
    case "UPDATE_PRODUCTS_IN_CART":
      return {
        ...state,
        cart: action.payload,
      }
    case "CHANGE_CART_QUANTITY":
      return {
        ...state,
        cart: action.payload,
      }
    case "REMOVE_PRODUCT_IN_CART":
      return {
        ...state,
        cart: action.payload,
      }
    case "UPDATE_ORDER_SUMMARY":
      return {
        ...state,
        ...action.payload,
      }

    case "UPDATE_ADDRESS":
    case "LOAD_ADDRESS_FROM_COOKIES":
      return {
        ...state,
        shippingAddress: action.payload,
      }
    case "ORDER_COMPLETE":
      return {
        ...state,
        cart: [],
        numberOfItems: 0,
        subTotal: 0,
        tax: 0,
        total: 0,
        // shippingAddress: {
        //   firstName: "",
        //   lastName: "",
        //   address: "",
        //   address2: "",
        //   postalCode: "",
        //   city: "",
        //   country: "",
        //   phone: "",
        // },
      }
    default:
      return state
  }
}
export { cartReducer }

import { FC, useEffect, useReducer } from "react"
import { CartProductType, ShippingAddress } from "../../interfaces"
import { CartContext, cartReducer } from "./"
import Cookie from "js-cookie"
import { OrderType } from "../../interfaces/order"

export type CartState = {
  isLoaded: boolean
  cart: CartProductType[]
  numberOfItems: number
  subTotal: number
  taxRate: number
  total: number
  shippingAddress?: ShippingAddress
}

const Cart_initial_state: CartState = {
  cart: [],
  numberOfItems: 0,
  subTotal: 0,
  taxRate: 0,
  total: 0,
  isLoaded: false,
  shippingAddress: undefined,
}

const CartProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, Cart_initial_state)

  useEffect(() => {
    try {
      const cartLoadedFromCookies = JSON.parse(Cookie.get("cart") ?? "[]")
      dispatch({
        type: "LOAD_CART_FROM_COOKIES",
        payload: cartLoadedFromCookies,
      })
    } catch (error) {
      dispatch({
        type: "LOAD_CART_FROM_COOKIES",
        payload: [],
      })
    }
  }, [])

  useEffect(() => {
    if (Cookie.get("firstName")) {
      dispatch({
        type: "LOAD_ADDRESS_FROM_COOKIES",
        payload: {
          firstName: Cookie.get("firstName") ?? "",
          lastName: Cookie.get("lastName") ?? "",
          address: Cookie.get("address") ?? "",
          address2: Cookie.get("address2") ?? "",
          postalCode: Cookie.get("postalCode") ?? "",
          city: Cookie.get("city") ?? "",
          country: Cookie.get("country") ?? "",
          phone: Cookie.get("phone") ?? "",
        },
      })
    }
  }, [])

  useEffect(() => {
    Cookie.set("cart", JSON.stringify(state.cart))
  }, [state.cart])

  useEffect(() => {
    const numberOfItems = (state.cart as CartProductType[]).reduce(
      (prev, p) => p.quantity + prev,
      0
    )
    const subTotal = (state.cart as CartProductType[]).reduce(
      (prev, p) => p.price * p.quantity + prev,
      0
    )
    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE) ?? 0.15
    const orderSummary = {
      numberOfItems,
      subTotal,
      taxRate: subTotal * taxRate,
      total: subTotal + subTotal * taxRate,
    }

    dispatch({
      type: "UPDATE_ORDER_SUMMARY",
      payload: orderSummary,
    })
  }, [state.cart])

  // actions
  const addProductToCart = (product: CartProductType) => {
    const isSameProductSize = state.cart.some(
      (p) => p.size === product.size && p._id === product._id
    )

    if (isSameProductSize) {
      const newCart = state.cart.map((p) => {
        // if the product is different and it has different size do nothing
        if (p.size !== product.size && p._id !== product._id) return p

        // but if the product is the same and it has the same size do this
        p.quantity += product.quantity

        // and return the new array of carts
        return p
      })
      dispatch({ type: "UPDATE_PRODUCTS_IN_CART", payload: newCart })
      return
    }
    dispatch({
      type: "UPDATE_PRODUCTS_IN_CART",
      payload: [...state.cart, product],
    })
  }

  const updateCartQuantity = (product: CartProductType) => {
    const newCart = state.cart.map((p) => {
      if (p._id !== product._id && p.size !== product.size) return p

      return product
    })

    dispatch({
      type: "CHANGE_CART_QUANTITY",
      payload: newCart,
    })
  }

  const removeCartProduct = (product: CartProductType) => {
    const newCart = state.cart.filter(
      (p) => !(p._id === product._id && p.size === product.size)
    )

    dispatch({
      type: "REMOVE_PRODUCT_IN_CART",
      payload: newCart,
    })
  }

  const updateAddress = (address: ShippingAddress) => {
    Cookie.set("firstName", address.firstName)
    Cookie.set("lastName", address.lastName)
    Cookie.set("phone", address.phone)
    Cookie.set("address", address.address)
    Cookie.set("address2", address.address2 ?? "")
    Cookie.set("city", address.city)
    Cookie.set("country", address.country)
    Cookie.set("postalCode", address.postalCode)
    dispatch({ type: "UPDATE_ADDRESS", payload: address })
  }

  const createOrder = async (): Promise<{
    hasError: boolean
    message: string
  }> => {
    if (!state.shippingAddress) {
      throw new Error("Please provide shipping address")
    }

    const body: OrderType = {
      orderItems: state.cart.map((p) => ({
        ...p,
        size: p.size!,
      })),
      shippingAddress: state.shippingAddress,
      numbersOfItems: state.numberOfItems,
      subTotal: state.subTotal,
      taxRate: state.taxRate,
      total: state.total,
      isPaid: false,
    }

    try {
      const resp = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })

      if (!resp.ok) {
        throw new Error("Something went wrong")
      }

      const data: OrderType = await resp.json()
      console.log({ data })

      // todo: dispatch action to clear cart
      dispatch({ type: "ORDER_COMPLETE" })

      return {
        hasError: false,
        message: data._id!,
      }
    } catch (error: any) {
      console.log(error)
      return {
        hasError: true,
        message: error.message ?? "Hubo un error al crear la orden",
      }
    }
  }

  return (
    <CartContext.Provider
      value={{
        ...state,
        addProductToCart,
        updateCartQuantity,
        removeCartProduct,
        updateAddress,

        // orders
        createOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
export { CartProvider }

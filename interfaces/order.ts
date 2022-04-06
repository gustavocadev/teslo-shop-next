import { UserType } from "./"
import { ValidSizeType } from "./products"
export type OrderType = {
  _id?: string
  user?: UserType | string
  orderItems: OrderItemType[]
  shippingAddress: ShippingAddress
  paymentResult?: string

  numbersOfItems: number
  subTotal: number
  taxRate: number
  total: number

  isPaid: boolean
  paidAt?: string
  transactionId?: string

  createdAt?: string
  updatedAt?: string
}

export type OrderItemType = {
  _id: string
  title: string
  size: ValidSizeType
  slug: string
  image: string
  price: number
  quantity: number
  gender: "men" | "women" | "kid" | "unisex"
}

export type ShippingAddress = {
  firstName: string
  lastName: string
  address: string
  address2?: string
  postalCode: string
  city: string
  country: string
  phone: string
}

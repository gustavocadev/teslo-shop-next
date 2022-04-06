import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Typography,
} from "@mui/material"
import ShopLayout from "../../components/layouts/ShopLayout"
import CartList from "../../components/cart/CartList"
import OrderSummary from "../../components/cart/OrderSummary"
import { CreditScoreOutlined, CreditCardOffOutlined } from "@mui/icons-material"
import { GetServerSideProps } from "next"
import { getSession } from "next-auth/react"
import { getOrderById } from "../../database/dbOrders"
import { OrderType } from "../../interfaces"
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"
import { useRouter } from "next/router"
import { CircularProgress } from "@mui/material"
import { useState } from "react"

type OrderResponseBody = {
  id: string

  status:
    | "COMPLETED"
    | "SAVED"
    | "APPROVED"
    | "VOIDED"
    | "PAYER_ACTION_REQUIRED"
}

type Props = {
  order: OrderType
}

export default function OrderPage({ order }: Props) {
  const router = useRouter()
  const { shippingAddress } = order
  const [isPaying, setIsPaying] = useState(false)

  const hanldeOrderCompleted = async (details: OrderResponseBody) => {
    if (details.status !== "COMPLETED") {
      return alert("No hay pago en Paypal")
    }
    setIsPaying(true)
    try {
      const resp = await fetch(`${location.origin}/api/orders/pay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          transactionId: details.id,
          orderId: order._id,
        }),
      })
      if (!resp.ok) {
        throw new Error("Error al procesar el pago")
      }
      router.reload()
    } catch (error) {
      setIsPaying(false)
      console.log(error)
      alert("Error al procesar el pago")
    }
  }

  return (
    <ShopLayout
      title={`Resumen de orden 156161`}
      pageDescription={"Resumen de la orden"}
    >
      <Typography variant="h1" component="h1">
        Orden: {order._id}
      </Typography>

      {order.isPaid ? (
        <Chip
          sx={{
            my: 2,
          }}
          label="Orden ya fue Pagada"
          variant="outlined"
          color="success"
          icon={<CreditScoreOutlined />}
        />
      ) : (
        <Chip
          sx={{
            my: 2,
          }}
          label="En proceso - Pendiente de pago"
          variant="outlined"
          color="error"
          icon={<CreditCardOffOutlined />}
        />
      )}

      <Grid container className="fadeIn">
        <Grid item xs={12} sm={7}>
          <CartList products={order.orderItems} />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h2" component="h2">
                Resumen ( {order.numbersOfItems}{" "}
                {order.numbersOfItems === 1 ? "producto" : "productos"})
              </Typography>
              <Divider sx={{ my: 1 }} />

              <Box justifyContent="space-between" display="flex">
                <Typography variant="subtitle1">
                  Direccion de entrega
                </Typography>
              </Box>

              <Typography>
                {shippingAddress.firstName} {shippingAddress.lastName}
              </Typography>
              <Typography>
                {shippingAddress.address}{" "}
                {shippingAddress.address2 ? shippingAddress.address2 : ""}
              </Typography>
              <Typography>
                {shippingAddress.city} {shippingAddress.postalCode}
              </Typography>
              <Typography>{shippingAddress.country}</Typography>
              <Typography>{shippingAddress.phone}</Typography>

              <Divider sx={{ my: 1 }} />

              <OrderSummary order={order} />
              <Box
                sx={{
                  mt: 3,
                }}
                display="flex"
                flexDirection="column"
              >
                <Box
                  justifyContent="center"
                  className="fadeIn"
                  sx={{
                    display: isPaying ? "flex" : "none",
                  }}
                >
                  <CircularProgress />
                </Box>

                <Box
                  sx={{
                    display: isPaying ? "none" : "flex",
                    flex: 1,
                  }}
                  flexDirection="column"
                >
                  {order.isPaid ? (
                    <Chip
                      sx={{
                        my: 2,
                      }}
                      label="Orden ya fue Pagada"
                      variant="outlined"
                      color="success"
                      icon={<CreditScoreOutlined />}
                    />
                  ) : (
                    <PayPalButtons
                      createOrder={(data, actions) => {
                        return actions.order.create({
                          purchase_units: [
                            {
                              amount: {
                                value: `${order.total}`,
                              },
                            },
                          ],
                        })
                      }}
                      onApprove={(data, actions) => {
                        return actions.order!.capture().then((details) => {
                          hanldeOrderCompleted(details)
                          // console.log({ details })
                          // const name = details.payer.name.given_name
                        })
                      }}
                    />
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const { id = "" } = query
  const session = (await getSession({ req })) as any

  if (!session) {
    return {
      redirect: {
        destination: `/auth/login?page=orders/${id}`,
        permanent: false,
      },
    }
  }

  const order = await getOrderById(id as string)

  if (!order) {
    return {
      redirect: {
        destination: "/orders/history",
        permanent: false,
      },
    }
  }

  // if the order is not the user's, redirect to orders history
  if (order.user !== session.user._id) {
    return {
      redirect: {
        destination: "/orders/history",
        permanent: false,
      },
    }
  }

  return {
    props: {
      order,
    },
  }
}

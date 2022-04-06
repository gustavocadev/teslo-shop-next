import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Typography,
} from "@mui/material"
import CartList from "../../../components/cart/CartList"
import OrderSummary from "../../../components/cart/OrderSummary"
import { CreditScoreOutlined, CreditCardOffOutlined } from "@mui/icons-material"
import { GetServerSideProps } from "next"
import { getSession } from "next-auth/react"
import { getOrderById } from "../../../database/dbOrders"
import { OrderType } from "../../../interfaces"
import { AdminLayout } from "../../../components/layouts"

type Props = {
  order: OrderType
}

export default function OrderPage({ order }: Props) {
  const { shippingAddress } = order

  console.log(order)

  return (
    <AdminLayout
      title={`Resumen de la orden`}
      subtitle={`Orden Id: ${order._id}`}
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
                  sx={{
                    display: "flex",
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
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </AdminLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const { orderId = "" } = query
  const session = (await getSession({ req })) as any

  if (!session) {
    return {
      redirect: {
        destination: `/auth/login?page=orders/${orderId}`,
        permanent: false,
      },
    }
  }

  const order = await getOrderById(orderId as string)

  if (!order) {
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

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Link,
  Typography,
} from "@mui/material"
import ShopLayout from "../../components/layouts/ShopLayout"
import CartList from "../../components/cart/CartList"
import OrderSummary from "../../components/cart/OrderSummary"
import NextLink from "next/link"
import { useContext, useEffect, useState } from "react"
import { CartContext } from "../../context"
// import { countries } from "../../utils"
import Cookies from "js-cookie"
import { useRouter } from "next/router"
export default function SummaryPage() {
  const { shippingAddress, numberOfItems, createOrder } =
    useContext(CartContext)

  const [isPosting, setIsPosting] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const router = useRouter()
  useEffect(() => {
    if (!Cookies.get("firstName")) {
      router.push("/checkout/address")
    }
  }, [router])

  if (!shippingAddress) {
    return <></>
  }

  // const country = countries.find(
  //   (country) => country.code === shippingAddress?.country
  // )
  const handleCreateOrder = async () => {
    setIsPosting(true)
    const { hasError, message } = await createOrder() // todo: depende del resultado
    if (hasError) {
      setIsPosting(false)
      setErrorMessage(message)
      return
    }
    router.replace(`/orders/${message}`)
  }

  return (
    <ShopLayout
      title={`Resumen de orden`}
      pageDescription={"Resumen de la orden"}
    >
      <Typography variant="h1" component="h1">
        Carrito de compras
      </Typography>

      <Grid container>
        <Grid item xs={12} sm={7}>
          <CartList />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h2" component="h2">
                Resumen ( {numberOfItems}{" "}
                {numberOfItems === 1 ? "producto" : "productos"} )
              </Typography>
              <Divider sx={{ my: 1 }} />

              <Box justifyContent="space-between" display="flex">
                <Typography variant="subtitle1">
                  Direccion de entrega
                </Typography>

                <NextLink href="/checkout/address" passHref>
                  <Link underline="always">Editar</Link>
                </NextLink>
              </Box>

              <Typography>{shippingAddress?.firstName}</Typography>
              <Typography>
                {shippingAddress?.address}{" "}
                {shippingAddress?.address2 ? shippingAddress?.address2 : ""}
              </Typography>
              <Typography>
                {shippingAddress?.city}, {shippingAddress?.postalCode}
              </Typography>
              <Typography>{shippingAddress.country}</Typography>
              <Typography>{shippingAddress?.phone}</Typography>

              <Divider sx={{ my: 1 }} />

              <Box justifyContent="flex-end" display="flex">
                <NextLink href="/cart" passHref>
                  <Link underline="always">Editar</Link>
                </NextLink>
              </Box>

              <OrderSummary />
              <Box
                sx={{
                  mt: 3,
                }}
                display="flex"
                flexDirection="column"
              >
                <Button
                  color="secondary"
                  className="circular-btn"
                  fullWidth
                  onClick={handleCreateOrder}
                  disabled={isPosting}
                >
                  Confirmar orden
                </Button>
                <Chip
                  color="error"
                  label={errorMessage}
                  sx={{
                    display: errorMessage ? "flex" : "none",
                    mt: 2,
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  )
}

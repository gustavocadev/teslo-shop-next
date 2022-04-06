import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
} from "@mui/material"
import ShopLayout from "../../components/layouts/ShopLayout"
import CartList from "../../components/cart/CartList"
import OrderSummary from "../../components/cart/OrderSummary"
import { useContext, useEffect } from "react"
import { CartContext } from "../../context"
import { useRouter } from "next/router"
export default function CartPage() {
  const { isLoaded, cart } = useContext(CartContext)
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && cart.length === 0) {
      router.replace("/cart/empty")
    }
  }, [cart, isLoaded, router])

  if (!isLoaded || cart.length === 0) {
    return <></>
  }

  return (
    <ShopLayout
      title={`Carrito - 3 `}
      pageDescription={"Carrito de compras de la tienda"}
    >
      <Typography variant="h1" component="h1">
        Carrito de compras
      </Typography>

      <Grid container>
        <Grid item xs={12} sm={7}>
          <CartList editable />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Card className="summary-card">
            <CardContent>
              <Typography variant="h2" component="h2">
                Orden
              </Typography>
              <Divider sx={{ my: 1 }} />

              <OrderSummary />
              <Box
                sx={{
                  mt: 3,
                }}
              >
                <Button
                  color="secondary"
                  className="circular-btn"
                  fullWidth
                  href="/checkout/address"
                >
                  Checkout
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </ShopLayout>
  )
}

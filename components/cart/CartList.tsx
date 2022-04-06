import {
  Typography,
  Grid,
  Link,
  CardActionArea,
  CardMedia,
  Box,
  Button,
} from "@mui/material"
import NextLink from "next/link"
import { ItemCounter } from "../ui"
import { useContext } from "react"
import { CartContext } from "../../context"
import { CartProductType, OrderItemType } from "../../interfaces"
type Props = {
  editable?: boolean
  products?: OrderItemType[]
}

const CartList = ({ editable = false, products }: Props) => {
  const { cart, removeCartProduct, updateCartQuantity } =
    useContext(CartContext)

  const handleNewCartQuantityValue = (
    product: CartProductType,
    newQuantityValue: number
  ) => {
    product.quantity = newQuantityValue
    updateCartQuantity(product)
  }

  const productsToShow = products ?? cart

  return (
    <>
      {productsToShow.map((product) => {
        return (
          <Grid container spacing={2} key={product.slug} sx={{ mb: 1 }}>
            <Grid item xs={3}>
              <NextLink href={`/product/${product.slug}`} passHref>
                <Link>
                  <CardActionArea>
                    <CardMedia
                      image={`${product.image}`}
                      component="img"
                      sx={{
                        borderRadius: "5px",
                      }}
                    />
                  </CardActionArea>
                </Link>
              </NextLink>
            </Grid>
            <Grid item xs={7}>
              <Box display="flex" flexDirection="column">
                <Typography variant="body1">{product.title}</Typography>
                <Typography variant="body1">
                  Talla: <strong>{product.size}</strong>
                </Typography>
                {editable ? (
                  <ItemCounter
                    currentValue={product.quantity}
                    updateQuantity={(value) =>
                      handleNewCartQuantityValue(
                        product as CartProductType,
                        value
                      )
                    }
                    maxValue={10}
                  />
                ) : (
                  <Typography variant="h5">
                    {cart?.length}{" "}
                    {product.quantity > 1 ? "productos" : "producto"}
                  </Typography>
                )}
              </Box>
            </Grid>
            <Grid
              item
              xs={2}
              display="flex"
              alignItems="center"
              flexDirection="column"
            >
              <Typography variant="subtitle1">${product.price}</Typography>

              {editable && (
                <Button
                  variant="text"
                  color="secondary"
                  onClick={() => removeCartProduct(product as CartProductType)}
                >
                  Remover
                </Button>
              )}
            </Grid>
          </Grid>
        )
      })}
    </>
  )
}

export default CartList

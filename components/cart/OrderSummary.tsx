import { Grid, Typography } from "@mui/material"
import { useContext } from "react"
import { CartContext } from "../../context"
import { currency } from "../../utils"
import { ShippingAddress, OrderType } from "../../interfaces/order"

type Props = {
  order?: OrderType
}

const OrderSummary = ({ order }: Props) => {
  let { numberOfItems, subTotal, taxRate, total } = useContext(CartContext)
  if (order) {
    numberOfItems = order.numbersOfItems
    subTotal = order.subTotal
    taxRate = order.taxRate
    total = order.total
  }
  return (
    <Grid container>
      <Grid item xs={6}>
        <Typography>No. Productos</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="flex-end">
        <Typography>
          {numberOfItems} {numberOfItems > 1 ? "items" : "item"}
        </Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography>Subtotal</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="flex-end">
        <Typography>{currency.format(subTotal)}</Typography>
      </Grid>

      <Grid item xs={6}>
        <Typography>Impuestos (15%)</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="flex-end">
        <Typography>{currency.format(taxRate)}</Typography>
      </Grid>

      <Grid item xs={6} sx={{ mt: 2 }}>
        <Typography variant="subtitle1">Total:</Typography>
      </Grid>
      <Grid item xs={6} display="flex" justifyContent="flex-end" sx={{ mt: 2 }}>
        <Typography variant="subtitle1">{currency.format(total)}</Typography>
      </Grid>
    </Grid>
  )
}

export default OrderSummary

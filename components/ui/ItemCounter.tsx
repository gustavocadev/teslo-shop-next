import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material"
import { IconButton, Typography } from "@mui/material"
import { Box } from "@mui/system"

type Props = {
  updateQuantity: (quantity: number) => void
  currentValue: number
  maxValue: number
}

const ItemCounter = ({ updateQuantity, maxValue, currentValue }: Props) => {
  return (
    <Box display="flex" alignItems="center">
      <IconButton
        onClick={() => {
          if (currentValue <= 1) return
          updateQuantity(currentValue - 1)
        }}
      >
        <RemoveCircleOutline />
      </IconButton>
      <Typography sx={{ width: 40, textAlign: "center" }}>
        {currentValue}
      </Typography>
      <IconButton
        onClick={() => {
          if (currentValue >= maxValue) return
          updateQuantity(currentValue + 1)
        }}
      >
        <AddCircleOutline />
      </IconButton>
    </Box>
  )
}

export default ItemCounter

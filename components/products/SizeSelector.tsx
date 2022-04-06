import { Box, Button } from "@mui/material"
import { Dispatch, SetStateAction } from "react"
import { ValidSizeType, CartProductType } from "../../interfaces"

type Props = {
  selectedSize?: ValidSizeType
  sizes: ValidSizeType[]
  handleSelectedSize: (size: ValidSizeType) => void
}

const SizeSelector = ({ selectedSize, sizes, handleSelectedSize }: Props) => {
  return (
    <Box>
      {sizes.map((size) => {
        return (
          <Button
            key={size}
            size="small"
            color={selectedSize === size ? "info" : "primary"}
            onClick={() => handleSelectedSize(size)}
          >
            {size}
          </Button>
        )
      })}
    </Box>
  )
}

export default SizeSelector

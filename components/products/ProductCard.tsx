import { ProductType } from "../../interfaces/products"
import { Box, Chip, Link } from "@mui/material"
import {
  Card,
  CardActionArea,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material"
import { useMemo, useState } from "react"
import NextLink from "next/link"
type Props = ProductType
const ProductCard = ({ slug, title, images, price, inStock }: Props) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isImageLoaded, setIsImageLoaded] = useState(false)

  const productImage = useMemo(() => {
    return isHovered ? `${images[1]}` : `${images[0]}`
  }, [isHovered, images])
  return (
    <Grid
      item
      xs={12}
      sm={6}
      md={4}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card>
        <NextLink href={`/product/${slug}`} passHref>
          <Link>
            <CardActionArea>
              {inStock === 0 && (
                <Chip
                  color="info"
                  label="No hay disponibles"
                  sx={{
                    position: "absolute",
                    zIndex: 99,
                    top: "10px",
                    left: "10px",
                  }}
                />
              )}

              <CardMedia
                component="img"
                image={`${productImage}`}
                alt={title}
                className="fadeIn"
                onLoad={() => setIsImageLoaded(true)}
              />
            </CardActionArea>
          </Link>
        </NextLink>
      </Card>

      <Box
        sx={{ mt: 1, display: isImageLoaded ? "block" : "none" }}
        className="fadeIn"
      >
        <Typography variant="h5" component="h2" fontWeight={700}>
          {title}
        </Typography>
        <Typography variant="h5" component="h2" fontWeight={500}>
          ${price}
        </Typography>
      </Box>
    </Grid>
  )
}

export default ProductCard

import { useState, useContext } from "react"
import ShopLayout from "../../components/layouts/ShopLayout"
import { Button, Chip, Grid, Typography } from "@mui/material"
import { Box } from "@mui/system"
import { ProductSlideShow, SizeSelector } from "../../components/products"
import { ItemCounter } from "../../components/ui"
import { ProductType, CartProductType, ValidSizeType } from "../../interfaces"
import { GetServerSideProps, GetStaticPaths } from "next"
import { getAllProductSlugs, getProductBySlug } from "../../database"
import { useRouter } from "next/router"
import { CartContext } from "../../context/cart"

type Props = {
  product: ProductType
}

export default function ProductPage({ product }: Props) {
  const router = useRouter()
  const { addProductToCart } = useContext(CartContext)
  const [tempCartProduct, setTempCartProduct] = useState<CartProductType>({
    _id: product._id,
    image: product.images[0],
    price: product.price,
    size: undefined,
    slug: product.slug,
    title: product.title,
    gender: product.gender,
    quantity: 1,
  })
  const handleSelectedSize = (size: ValidSizeType) => {
    setTempCartProduct({
      ...tempCartProduct,
      size,
    })
  }

  const updateQuantity = (quantity: number) => {
    setTempCartProduct({
      ...tempCartProduct,
      quantity,
    })
  }
  const handleAddToCart = () => {
    if (!tempCartProduct.size) return

    // I add the product to the cart
    addProductToCart(tempCartProduct)

    router.push("/cart")
  }
  return (
    <ShopLayout title={product.title} pageDescription={product.description}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={7}>
          <ProductSlideShow images={product.images} />
        </Grid>
        <Grid item xs={12} sm={5}>
          <Box display="flex" flexDirection="column">
            {/* todo: titulos */}
            <Typography variant="h1" component="h1">
              {product.title}
            </Typography>
            <Typography variant="subtitle1" component="h2">
              ${product.price}
            </Typography>
            <Box sx={{ my: 2 }}>
              <Typography variant="subtitle2">Cantidad</Typography>
              <ItemCounter
                currentValue={tempCartProduct.quantity}
                updateQuantity={updateQuantity}
                maxValue={product.inStock > 10 ? 10 : product.inStock}
              />
              <SizeSelector
                sizes={product.sizes}
                selectedSize={tempCartProduct.size}
                handleSelectedSize={handleSelectedSize}
              />
            </Box>
            {/* agregar al carrito */}

            {product.inStock > 0 ? (
              <Button
                color="secondary"
                className="circular-btn"
                onClick={handleAddToCart}
              >
                {tempCartProduct.size
                  ? "Agregar al carrito"
                  : "Seleccione una talla"}
              </Button>
            ) : (
              <Chip
                label="No hay disponibles"
                color="error"
                variant="outlined"
              />
            )}

            {/* Description */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2">Descripción</Typography>
              <Typography variant="body2">{product.description}</Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ShopLayout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await getAllProductSlugs()

  const slugsWithParams = slugs.map((slug) => {
    return {
      params: slug,
    }
  })
  return {
    paths: slugsWithParams,
    fallback: "blocking",
  }
}

export const getStaticProps: GetServerSideProps = async ({ params }) => {
  const { slug = "" } = params as {
    slug: string
  }
  const product = JSON.parse(JSON.stringify(await getProductBySlug(slug)))

  if (!product) {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    }
  }

  console.log(slug)
  return {
    props: {
      product,
    },
    revalidate: 3600 * 24,
  }
}

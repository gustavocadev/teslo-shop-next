import { Typography } from "@mui/material"
import { ShopLayout } from "../../components/layouts"
import { ProductList } from "../../components/products"
import { FullScreenLoading } from "../../components/ui"
import { useProducts } from "../../hooks/useProducts"
import { ProductType } from "../../interfaces"

export default function Women() {
  const { products, isLoading } = useProducts("/products?gender=women")

  return (
    <ShopLayout
      title="Women"
      pageDescription="Encuentra los mejores productos de Teslo para Mujeres."
    >
      <Typography variant="h1" component="h1">
        Mujeres
      </Typography>
      <Typography variant="h2" sx={{ mb: 1 }}>
        Producto para mujeres
      </Typography>
      {isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
    </ShopLayout>
  )
}

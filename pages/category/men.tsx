import { Typography } from "@mui/material"
import { ShopLayout } from "../../components/layouts"
import { ProductList } from "../../components/products"
import { FullScreenLoading } from "../../components/ui"
import { useProducts } from "../../hooks/useProducts"
import { ProductType } from "../../interfaces"
export default function Men() {
  const { products, isLoading } = useProducts("/products?gender=men")
  return (
    <ShopLayout
      title="Teslo Shop Hombres"
      pageDescription="Encuentra los mejores productos de Teslo para hombres."
    >
      <Typography variant="h1" component="h1">
        Hombres
      </Typography>
      <Typography variant="h2" sx={{ mb: 1 }}>
        Producto para hombres
      </Typography>
      {isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
    </ShopLayout>
  )
}

import { Typography } from "@mui/material"
import type { NextPage } from "next"
import ShopLayout from "../components/layouts/ShopLayout"
import ProductList from "../components/products/ProductList"
import { useProducts } from "../hooks"
import FullScreenLoading from "../components/ui/FullScreenLoading"

const Home: NextPage = () => {
  const { products, isLoading } = useProducts("/products")
  return (
    <ShopLayout
      title={`Testo-Shop - Home`}
      pageDescription={`This is the home page of the Testo-Shop.`}
    >
      <Typography variant="h1" component="h1">
        Tienda
      </Typography>
      <Typography variant="h2" sx={{ mb: 1 }}>
        Todos los productos
      </Typography>
      {isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
    </ShopLayout>
  )
}

export default Home

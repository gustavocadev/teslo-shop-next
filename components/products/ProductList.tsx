import ProductCard from "./ProductCard"
import { ProductType } from "../../interfaces/products"
import { Grid } from "@mui/material"
type Props = {
  products: ProductType[]
}

const ProductList = ({ products }: Props) => {
  console.log(products)
  return (
    <Grid container spacing={3}>
      {products.map((product) => (
        <ProductCard {...product} key={product.slug} />
      ))}
    </Grid>
  )
}

export default ProductList

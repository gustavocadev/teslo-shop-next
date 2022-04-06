import { capitalize, Typography } from "@mui/material"
import type { NextPage } from "next"
import ShopLayout from "../../components/layouts/ShopLayout"
import ProductList from "../../components/products/ProductList"
import { ProductType } from "../../interfaces/products"
import { GetServerSideProps } from "next"
import { db, getAllProducts, getProductsByTerm } from "../../database"
import ProductModel from "../../models/Product"
import { Box } from "@mui/system"

type Props = {
  products: ProductType[]
  foundProducts: boolean
  query: string
}

const SearchPage: NextPage<Props> = ({ products, foundProducts, query }) => {
  // const { products, isLoading } = useProducts("/search/haha")
  return (
    <ShopLayout
      title={`Testo-Shop - SearchPage`}
      pageDescription={`This is the SearchPage page of the Testo-Shop.`}
    >
      <Typography variant="h1" component="h1">
        Buscar productos
      </Typography>

      {foundProducts ? (
        <Typography variant="h2" sx={{ mb: 1 }}>
          Termino: {capitalize(query)}
        </Typography>
      ) : (
        <Box display="flex">
          <Typography variant="h2" sx={{ mb: 1 }}>
            No se encontraron resultados para:
          </Typography>
          <Typography variant="h2" sx={{ ml: 1 }} color="secondary">
            {capitalize(query)}
          </Typography>
        </Box>
      )}

      <ProductList products={products} />
    </ShopLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { query = "" } = params as { query: string }

  if (query.length === 0) {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    }
  }
  let products = await getProductsByTerm(query)
  const foundProducts = products.length > 0

  // todo: return other products
  if (!foundProducts) {
    await db.connect()
    products = await getAllProducts()
    await db.disconnect()
  }

  return {
    props: {
      products,
      foundProducts,
      query,
    },
  }
}

export default SearchPage

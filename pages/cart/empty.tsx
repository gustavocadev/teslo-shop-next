import { RemoveShoppingCartOutlined } from "@mui/icons-material"
import { Box, Link, Typography } from "@mui/material"
import NextLink from "next/link"
import { ShopLayout } from "../../components/layouts"

export default function EmptyPage() {
  return (
    <ShopLayout
      title={"Carrito Vació"}
      pageDescription={"No hay articulos en el carrito de compras"}
    >
      <Box
        display="flex"
        flexDirection={{
          xs: "column",
          md: "row",
        }}
        justifyContent="center"
        alignItems="center"
        height="calc(100vh - 200px)"
      >
        <RemoveShoppingCartOutlined sx={{ fontSize: 100 }} />
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography marginLeft={2}>Su carrito está vació</Typography>
          <NextLink href="/" passHref>
            <Link typography="h4" color="secondary">
              Regresar
            </Link>
          </NextLink>
        </Box>
      </Box>
    </ShopLayout>
  )
}

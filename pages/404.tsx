import ShopLayout from "../components/layouts/ShopLayout"
import { Box } from "@mui/system"
import { Typography } from "@mui/material"
export default function Custom404() {
  return (
    <ShopLayout title="404" pageDescription="Página no encontrada">
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
        <Typography
          variant="h1"
          component="h1"
          fontSize={150}
          fontWeight={200}
          textAlign="center"
        >
          404 |
        </Typography>
        <Typography marginLeft={2} fontSize={24} textAlign="center">
          No encontramos ninguna página aquí
        </Typography>
      </Box>
    </ShopLayout>
  )
}

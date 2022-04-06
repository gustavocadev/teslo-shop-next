import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material"
import { Box } from "@mui/system"
import ShopLayout from "../../components/layouts/ShopLayout"
import { GetServerSideProps } from "next"
import { jwt } from "../../utils"
import { countries } from "../../utils/countries"
import { useForm } from "react-hook-form"
import { TextFields } from "@mui/icons-material"
import Cookies from "js-cookie"
import { useRouter } from "next/router"
import { useContext, useEffect } from "react"
import { CartContext } from "../../context"

type FormData = {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  address2?: string
  city: string
  country: string
  postalCode: string
}

const getAdressFromCookies = () => {
  return {
    firstName: Cookies.get("firstName") ?? "",
    lastName: Cookies.get("lastName") ?? "",
    email: Cookies.get("email") ?? "",
    phone: Cookies.get("phone") ?? "",
    address: Cookies.get("address") ?? "",
    address2: Cookies.get("address2") ?? "",
    city: Cookies.get("city") ?? "",
    country: Cookies.get("country") ?? "",
    postalCode: Cookies.get("postalCode") ?? "",
  }
}

export default function Address() {
  const router = useRouter()
  const { updateAddress, shippingAddress } = useContext(CartContext)

  const { formState, handleSubmit, register, reset } = useForm<FormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      address2: "",
      city: "",
      country: "",
      postalCode: "",
    },
  })

  useEffect(() => {
    reset(getAdressFromCookies())
  }, [reset])

  const { errors } = formState

  const handleFormData = (data: FormData) => {
    console.log(data)

    updateAddress(data)
    router.push("/checkout/summary")
  }
  return (
    <ShopLayout
      title={"Dirección"}
      pageDescription={"Confirmar dirección del destino"}
    >
      <Typography variant="h1" component="h1">
        Dirección
      </Typography>

      <form onSubmit={handleSubmit(handleFormData)}>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Nombre"
              variant="filled"
              fullWidth
              autoComplete="off"
              {...register("firstName", {
                required: {
                  value: true,
                  message: "El nombre es requerido",
                },
              })}
              helperText={errors.firstName?.message}
              error={errors.firstName ? true : false}
              color={errors.firstName && "error"}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Apellido"
              variant="filled"
              fullWidth
              autoComplete="off"
              {...register("lastName", {
                required: {
                  value: true,
                  message: "El apellido es requerido",
                },
              })}
              helperText={errors.lastName?.message}
              error={errors.lastName ? true : false}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Dirección"
              variant="filled"
              fullWidth
              autoComplete="off"
              {...register("address", {
                required: {
                  value: true,
                  message: "La dirección es requerida",
                },
              })}
              helperText={errors.address?.message}
              error={errors.address !== undefined}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Dirección 2 ( opcional )"
              variant="filled"
              fullWidth
              autoComplete="off"
              {...register("address2")}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Código Postal"
              variant="filled"
              fullWidth
              autoComplete="off"
              {...register("postalCode", {
                required: {
                  value: true,
                  message: "El código postal es requerido",
                },
              })}
              helperText={errors.postalCode?.message}
              error={errors.postalCode ? true : false}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Ciudad"
              variant="filled"
              fullWidth
              autoComplete="off"
              {...register("city", {
                required: {
                  value: true,
                  message: "La ciudad es requerida",
                },
              })}
              helperText={errors.city?.message}
              error={errors.city ? true : false}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            {/* <FormControl fullWidth> */}
            <TextField
              // select
              variant="filled"
              label="País"
              fullWidth
              // defaultValue={shippingAddress?.country ?? countries[0].code}
              {...register("country", {
                required: {
                  value: true,
                  message: "El país es requerido",
                },
              })}
              error={errors.country ? true : false}
              helperText={errors.country?.message}
            >
              {/* {countries.map((country) => (
                <MenuItem value={country.code} key={country.code}>
                  {country.name}
                </MenuItem>
              ))} */}
            </TextField>
            {/* </FormControl> */}
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="telefono"
              variant="filled"
              fullWidth
              autoComplete="off"
              {...register("phone", {
                required: {
                  value: true,
                  message: "El telefono es requerido",
                },
              })}
              helperText={errors.phone?.message}
              error={errors.phone ? true : false}
            />
          </Grid>
        </Grid>

        <Box
          sx={{
            mt: 5,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            color="secondary"
            className="circular-btn"
            size="large"
            type="submit"
          >
            Revisar Pedido
          </Button>
        </Box>
      </form>
    </ShopLayout>
  )
}

// export const getServerSideProps: GetServerSideProps = async ({ req }) => {
//   const { token } = req.cookies

//   let isValidToken = false

//   try {
//     await jwt.isValidToken(token)
//     isValidToken = true
//   } catch (error) {
//     isValidToken = false
//   }

//   if (!isValidToken) {
//     return {
//       redirect: {
//         destination: "/auth/login?page=/checkout/address",
//         permanent: false,
//       },
//     }
//   }

//   return {
//     props: {},
//   }
// }

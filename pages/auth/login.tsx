import {
  Box,
  Button,
  Grid,
  Link,
  TextField,
  Typography,
  Chip,
  Divider,
} from "@mui/material"
import AuthLayout from "../../components/layouts/AuthLayout"
import NextLink from "next/link"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import { isEmail, isValidEmail } from "../../utils/validations"
import { ErrorOutlined } from "@mui/icons-material"
// import { AuthContext } from "../../context"
import { useRouter } from "next/router"
import { getSession, signIn, getProviders } from "next-auth/react"
import { GetServerSideProps } from "next"

type FormData = {
  email: string
  password: string
}

export default function LoginPage() {
  const router = useRouter()

  const { register, handleSubmit, formState } = useForm<FormData>()
  const [showError, setShowError] = useState(false)
  const { errors } = formState
  // const { loginUser } = useContext(AuthContext)
  const [providers, setProviders] = useState<any>({})

  useEffect(() => {
    const getProvs = async () => {
      const prov = await getProviders()
      console.log({ prov })
      setProviders(prov)
    }
    getProvs()
  }, [])

  const handleLoginUser = async ({ email, password }: FormData) => {
    setShowError(false)

    // const isValidLogin = await loginUser(email, password)
    // if (!isValidLogin) {
    //   setShowError(true)
    //   setTimeout(() => setShowError(false), 3000)
    //   return
    // }

    // //todo: navegar a la pantalla en el que el usuario estaba
    // const destination = router.query.page?.toString() ?? "/"
    // router.replace(destination)
    await signIn("credentials", {
      email,
      password,
    })
  }

  return (
    <AuthLayout title={"Ingresar"}>
      <form onSubmit={handleSubmit(handleLoginUser)}>
        <Box sx={{ width: 350, padding: "10px 20px" }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h1" component="h1">
                Iniciar sesión
              </Typography>
              <Chip
                label="No reconocemos ese usuario / contraseña"
                color="error"
                icon={<ErrorOutlined />}
                className="fadeIn"
                sx={{
                  display: showError ? "flex" : "none",
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Correo"
                variant="filled"
                fullWidth
                {...register("email", {
                  required: "El correo es requerido",
                  validate: (value) => isEmail(value),
                  // isEmail: "El correo no es válido",
                  // isValidEmail: "El correo no es válido",
                })}
                error={errors.email ? true : false}
                helperText={errors.email?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Contraseña"
                type="password"
                variant="filled"
                fullWidth
                {...register("password", {
                  required: "La contraseña es requerida",
                  minLength: {
                    value: 6,
                    message: "La contraseña debe tener al menos 6 caracteres",
                  },
                })}
                error={errors.password ? true : false}
                helperText={errors.password?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                color="secondary"
                className="circular-btn"
                size="large"
                fullWidth
              >
                Ingresar
              </Button>
            </Grid>
            <Grid item xs={12} display="flex" justifyContent="end">
              <NextLink
                href={`/auth/register${
                  router.query.page?.toString()
                    ? `?page=${router.query.page?.toString()}`
                    : ""
                }`}
                passHref
              >
                <Link underline="always">No tienes cuenta?</Link>
              </NextLink>
            </Grid>

            <Grid
              item
              xs={12}
              display="flex"
              flexDirection="column"
              justifyContent="end"
            >
              <Divider
                sx={{
                  width: "100%",
                  mb: 2,
                }}
              />
              {Object.values(providers).map((provider: any) => {
                if (provider.id === "credentials") return
                return (
                  <Button
                    key={provider.name}
                    variant="outlined"
                    fullWidth
                    color="info"
                    sx={{ mb: 1 }}
                    onClick={() => signIn(provider.id)}
                  >
                    {provider.name}
                  </Button>
                )
              })}
            </Grid>
          </Grid>
        </Box>
      </form>
    </AuthLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const session = await getSession({ req })

  const { page = "/" } = query

  if (session) {
    return {
      redirect: {
        destination: page.toString(),
        permanent: false,
      },
    }
  }

  return {
    props: {},
  }
}

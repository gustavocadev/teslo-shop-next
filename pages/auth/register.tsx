import {
  Box,
  Button,
  Chip,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material"
import AuthLayout from "../../components/layouts/AuthLayout"
import NextLink from "next/link"
import { useForm } from "react-hook-form"
import { ErrorOutlined } from "@mui/icons-material"
import { useContext, useState } from "react"
import { useRouter } from "next/router"
import { AuthContext } from "../../context"
import { getSession, signIn } from "next-auth/react"
import { GetServerSideProps } from "next"

type FormData = {
  name: string
  email: string
  password: string
}

export default function RegisterPage() {
  const router = useRouter()
  const { registerUser } = useContext(AuthContext)
  const [showError, setShowError] = useState(false)

  const { handleSubmit, register, formState } = useForm<FormData>()
  const { errors } = formState
  const [errorMessage, setErrorMessage] = useState("")

  const handleRegisterForm = async ({ name, email, password }: FormData) => {
    // we create the user
    const { hasError, message } = await registerUser(name, email, password)
    setShowError(hasError)
    if (hasError) {
      setErrorMessage(message ?? "")
      setTimeout(() => setErrorMessage(""), 3000)
      return
    }
    //todo: navegar a la pantalla en el que el usuario estaba
    // const destination = router.query.page?.toString() ?? "/"
    // router.replace(destination)

    // next we sign in the user
    await signIn("credentials", {
      email,
      password,
    })
  }

  return (
    <AuthLayout title={"Ingresar"}>
      <Box sx={{ width: 350, padding: "10px 20px" }}>
        <form onSubmit={handleSubmit(handleRegisterForm)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h1" component="h1">
                Registro
              </Typography>
              <Chip
                label="Error al registrar, el email ya existe"
                icon={<ErrorOutlined />}
                color="error"
                sx={{
                  display: showError ? "flex" : "none",
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Nombre completo"
                variant="filled"
                fullWidth
                {...register("name", {
                  required: true,
                })}
                error={errors.name ? true : false}
                helperText={formState.errors.name && "Campo requerido"}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Correo"
                variant="filled"
                fullWidth
                {...register("email", {
                  required: true,
                  pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
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
                  required: true,
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
                Registrarte
              </Button>
            </Grid>

            <Grid item xs={12} display="flex" justifyContent="end">
              <NextLink
                href={`/auth/login${
                  router.query.page?.toString()
                    ? `?page=${router.query.page?.toString()}`
                    : ""
                }`}
                passHref
              >
                <Link underline="always">Ya tienes cuenta?</Link>
              </NextLink>
            </Grid>
          </Grid>
        </form>
      </Box>
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

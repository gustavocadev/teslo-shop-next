import { ReactNode } from "react"
import { SideMenu } from "../ui"
import AdminNavbar from "../admin/AdminNavbar"
import { Box, Typography } from "@mui/material"

type Props = {
  children: ReactNode
  title: string
  subtitle: string
  icon?: ReactNode
}

const AdminLayout = ({ children, title, subtitle, icon }: Props) => {
  return (
    <>
      <nav>
        <AdminNavbar />
      </nav>

      <SideMenu />

      <main
        style={{
          margin: "80px auto",
          maxWidth: "1440px",
          padding: "0px 30px",
        }}
      >
        <Box display="flex" flexDirection="column">
          <Typography variant="h1" component="h1">
            {icon} {title}
          </Typography>
          <Typography variant="h2" sx={{ mb: 1 }} component="h2">
            {subtitle}
          </Typography>
        </Box>

        <Box className="fadeIn">{children}</Box>
      </main>
    </>
  )
}

export default AdminLayout
